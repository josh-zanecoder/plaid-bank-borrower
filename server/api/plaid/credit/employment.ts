import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { findBorrowerByEmail, getBorrowerModel } from '../../../models/Borrower'

/**
 * Get credit employment information for the authenticated borrower
 * GET /api/plaid/credit/employment
 * 
 * Requires user_token to be created first via /api/plaid/token/create_user_token
 */
export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Require authentication
    const user = await getCurrentUser(event)
    
    if (!user || !user._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in.'
      })
    }

    if (user.role !== 'borrower') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Borrower role required.'
      })
    }

    // Find borrower and get user_token
    const borrower = await findBorrowerByEmail(user.email)
    if (!borrower || !borrower._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower profile not found'
      })
    }

    // Get borrower with user_token
    const BorrowerModel = await getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+userToken').lean()
    
    if (!borrowerWithToken?.userToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User token not found. Please complete income verification first.',
      })
    }

    // Get Plaid client
    const client = getPlaidClient()

    // Get credit employment information
    const creditEmploymentResponse = await client.creditEmploymentGet({
      user_token: borrowerWithToken.userToken,
    })

    return {
      success: true,
      credit_employment: creditEmploymentResponse.data,
    }

  } catch (error: any) {
    console.error('Error fetching credit employment:', error)
    
    // Handle Plaid API errors
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch credit employment',
        data: error.response.data,
      })
    }

    // Handle our custom errors (they already have statusCode)
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
})

