import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { updateUser } from '../../../models/User'
import { findBorrowerByEmail, updateBorrower, getBorrowerModel } from '../../../models/Borrower'
import { randomUUID } from 'crypto'

const buildConsumerReportIdentity = (user: any) => {
  // Use user data if available, otherwise use static/default data
  return {
    first_name: user?.firstName || 'John',
    last_name: user?.lastName || 'Doe',
    emails: user?.email ? [user.email] : ['user@example.com'],
    phone_numbers: user?.phoneNumber ? [user.phoneNumber] : ['+14155551234'],
    primary_address: {
      street: user?.address?.street || '123 Main Street',
      city: user?.address?.city || 'San Francisco',
      region: user?.address?.region || 'CA',
      postal_code: user?.address?.postalCode || '94105',
      country: user?.address?.country || 'US',
    },
    date_of_birth: user?.dateOfBirth || '1990-01-01',
    ssn_last_4: user?.ssnLast4 || '1234',
  }
}

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const client = getPlaidClient()

    // Require authentication
    const user = await getCurrentUser(event)
    if (!user || !user._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required for consumer report. Please log in first.',
      })
    }

    if (user.role !== 'borrower') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Borrower role required.'
      })
    }

    // Find borrower
    const borrower = await findBorrowerByEmail(user.email)
    if (!borrower || !borrower._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower profile not found'
      })
    }

    // Ensure borrower has a user_token with consumer report identity
    const BorrowerModel = await getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+userToken').lean()
    let userToken: string | undefined = borrowerWithToken?.userToken as string | undefined

    if (!userToken && user.user_token) {
      userToken = user.user_token
    }

    // Build consumer report identity from user data
    const consumerReportIdentity = buildConsumerReportIdentity(user)

    if (!userToken) {
      // Create user_token with consumer report identity
      const clientUserId = `borrower_${randomUUID()}`
      const userCreateRequest: any = {
        client_user_id: clientUserId,
        consumer_report_user_identity: consumerReportIdentity,
      }

      try {
        const userCreateResponse = await client.userCreate(userCreateRequest)
        userToken = userCreateResponse.data.user_token

        // Store user_token in borrower model
        if (userToken && borrower._id) {
          await updateBorrower(borrower._id.toString(), { userToken })
        }
      } catch (error: any) {
        console.error('Error creating user token for consumer report:', error)
        throw createError({
          statusCode: 400,
          statusMessage: error.response?.data?.error_message || error.message || 'Failed to create user token required for consumer report. Please try again.',
          data: error.response?.data,
        })
      }
    } else {
      // User token exists - update it with consumer report identity if needed
      try {
        await client.userUpdate({
          user_token: userToken,
          consumer_report_user_identity: consumerReportIdentity,
        })
        console.log(`Updated user_token with consumer_report_user_identity for CRA products`)
      } catch (updateError: any) {
        // If update fails, check if it's because identity is already set or another error
        console.warn('Could not update user token with identity info (may already be set):', updateError)
        // Continue anyway - the token might already have identity info
      }
    }

    const countryCodes = (config.plaidCountryCodes || 'US').split(',').map((c: string) => c.trim())

    // Build link token request for consumer report (CRA)
    const linkTokenRequest: any = {
      user: {
        client_user_id: user._id?.toString() || `borrower_${randomUUID()}`,
      },
      client_name: config.plaidClientName || 'Bank Borrower App',
      products: ['cra_base_report'],
      country_codes: countryCodes,
      language: 'en',
      user_token: userToken, // Required for CRA products
      consumer_report_permissible_purpose: body.consumer_report_permissible_purpose || 'ACCOUNT_REVIEW_CREDIT',
      cra_options: {
        days_requested: body.days_requested || 60,
      },
    }

    // Add redirect URI if configured
    if (config.plaidRedirectUri) {
      linkTokenRequest.redirect_uri = config.plaidRedirectUri
    }

    // Add Android package name if configured
    if (config.plaidAndroidPackageName) {
      linkTokenRequest.android_package_name = config.plaidAndroidPackageName
    }

    const response = await client.linkTokenCreate(linkTokenRequest)

    return {
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      message: 'Link token created for consumer report flow',
    }
  } catch (error: any) {
    console.error('Plaid consumer report link token creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to create link token for consumer report',
        data: error.response.data,
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create link token'
    })
  }
})

