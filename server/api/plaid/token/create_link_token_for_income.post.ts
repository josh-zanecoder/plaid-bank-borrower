import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { updateUser } from '../../../models/User'
import { findBorrowerByEmail, updateBorrower, getBorrowerModel } from '../../../models/Borrower'
import { randomUUID } from 'crypto'

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
        statusMessage: 'Authentication required for income verification. Please log in first.',
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

    // Ensure borrower has a user_token
    const BorrowerModel = await getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+userToken').lean()
    let userToken: string | undefined = borrowerWithToken?.userToken as string | undefined

    if (!userToken && user.user_token) {
      userToken = user.user_token
    }

    if (!userToken) {
      const clientUserId = `borrower_${randomUUID()}`
      const userCreateRequest: any = {
        client_user_id: clientUserId,
      }

      try {
        const userCreateResponse = await client.userCreate(userCreateRequest)
        userToken = userCreateResponse.data.user_token

        // Store user_token in borrower model
        if (userToken && borrower._id) {
          await updateBorrower(borrower._id.toString(), { userToken })
        }
      } catch (error: any) {
        console.error('Error creating user token for income verification:', error)
        throw createError({
          statusCode: 400,
          statusMessage: error.response?.data?.error_message || error.message || 'Failed to create user token required for income verification. Please try again.',
          data: error.response?.data,
        })
      }
    }

    const countryCodes = (config.plaidCountryCodes || 'US').split(',').map((c: string) => c.trim())

    const linkTokenRequest: any = {
      user: {
        client_user_id: `borrower_${randomUUID()}`, 
      },
      client_name: config.plaidClientName || 'Bank Borrower App',
      products: ['income_verification', 'employment'],
      country_codes: countryCodes,
      language: 'en',
      user_token: userToken,
    }

    if (config.plaidRedirectUri) {
      linkTokenRequest.redirect_uri = config.plaidRedirectUri
    }

    if (config.plaidAndroidPackageName) {
      linkTokenRequest.android_package_name = config.plaidAndroidPackageName
    }

    const incomeVerificationConfig: any = {}
    
    if (body.income_source_types) {
      incomeVerificationConfig.income_source_types = body.income_source_types
    } else {
      incomeVerificationConfig.income_source_types = ['payroll']
    }
    
    if (incomeVerificationConfig.income_source_types.includes('payroll')) {
      incomeVerificationConfig.payroll_income = {}
      
      if (body.include_risk_signals === true || body.parsing_config?.risk_signals === true) {
        incomeVerificationConfig.payroll_income.parsing_config = ['risk_signals']
      }
    }
    
    linkTokenRequest.income_verification = incomeVerificationConfig

    const response = await client.linkTokenCreate(linkTokenRequest)

    return {
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      message: 'Link token created for income verification flow',
    }
  } catch (error: any) {
    console.error('Plaid income verification link token creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to create link token for income verification',
        data: error.response.data,
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create link token'
    })
  }
})

