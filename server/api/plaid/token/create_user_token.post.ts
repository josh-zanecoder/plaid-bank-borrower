import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { updateUser } from '../../../models/User'
import { findBorrowerByEmail, updateBorrower } from '../../../models/Borrower'
import { randomUUID } from 'crypto'

const buildConsumerReportIdentity = (user: any) => {
  const missingFields: string[] = []

  if (!user?.firstName) missingFields.push('firstName')
  if (!user?.lastName) missingFields.push('lastName')
  if (!user?.email) missingFields.push('email')
  if (!user?.phoneNumber) missingFields.push('phoneNumber')
  if (!user?.dateOfBirth) missingFields.push('dateOfBirth')
  if (!user?.ssnLast4) missingFields.push('ssnLast4')

  if (!user?.address) {
    missingFields.push('address')
  } else {
    if (!user.address.street) missingFields.push('address.street')
    if (!user.address.city) missingFields.push('address.city')
    if (!user.address.region) missingFields.push('address.region')
    if (!user.address.postalCode) missingFields.push('address.postalCode')
    if (!user.address.country) missingFields.push('address.country')
  }

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Additional identity information is required. Please complete your profile.',
      data: {
        require_profile_update: true,
        missingFields,
      },
    })
  }

  return {
    first_name: user.firstName,
    last_name: user.lastName,
    emails: [user.email],
    phone_numbers: [user.phoneNumber],
    primary_address: {
      street: user.address.street,
      city: user.address.city,
      region: user.address.region,
      postal_code: user.address.postalCode,
      country: user.address.country || 'US',
    },
    date_of_birth: user.dateOfBirth,
    ssn_last_4: user.ssnLast4,
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
    const user = await getCurrentUser(event)
    
    if (!user || !user._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in.'
      })
    }

    // Check if user already has a user_token
    if (user.user_token) {
      // Also check borrower if user is a borrower
      if (user.role === 'borrower') {
        const borrower = await findBorrowerByEmail(user.email)
        if (borrower) {
          const BorrowerModel = await (await import('../../../models/Borrower')).getBorrowerModel()
          const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+userToken').lean()
          if (borrowerWithToken?.userToken) {
            return {
              success: true,
              user_token: borrowerWithToken.userToken,
              message: 'User token already exists',
            }
          }
        }
      }
      
      return {
        success: true,
        user_token: user.user_token,
        message: 'User token already exists',
      }
    }

    // Get Plaid client
    const client = getPlaidClient()

    // Create Plaid user_token with random UUID for client_user_id
    // Generate a completely random client_user_id to avoid conflicts
    const clientUserId = `user_${randomUUID()}`

    const userCreateRequest: any = {
      client_user_id: clientUserId,
    }

    const config = useRuntimeConfig()
    const productsEnv = config.plaidProducts || 'transactions'
    const productsArray = productsEnv.split(',').map((p: string) => p.trim().toLowerCase())

    const hasCraProducts = productsArray.some((p: string) => p.startsWith('cra_'))
    
    if (hasCraProducts) {
      userCreateRequest.consumer_report_user_identity = buildConsumerReportIdentity(user)
    }

    // Create Plaid user
    const userCreateResponse = await client.userCreate(userCreateRequest)
    const plaidUserToken = userCreateResponse.data.user_token

    if (!plaidUserToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user token - no token returned from Plaid'
      })
    }

    // Store user_token in database - prefer borrower if exists, otherwise user
    if (user.role === 'borrower') {
      const borrower = await findBorrowerByEmail(user.email)
      if (borrower?._id) {
        await updateBorrower(borrower._id.toString(), { userToken: plaidUserToken })
      } else if (user._id) {
        await updateUser(user._id.toString(), { user_token: plaidUserToken })
      }
    } else if (user._id) {
      await updateUser(user._id.toString(), { user_token: plaidUserToken })
    }

    return {
      success: true,
      user_token: plaidUserToken,
      message: 'User token created successfully',
    }

  } catch (error: any) {
    console.error('Error creating user token:', error)
    
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to create user token',
        data: error.response.data,
      })
    }

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
})

