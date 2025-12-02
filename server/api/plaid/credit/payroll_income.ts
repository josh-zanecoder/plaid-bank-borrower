import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { findBorrowerByEmail, findBorrowerById, getBorrowerModel } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

/**
 * Get credit payroll income information for the authenticated borrower
 * GET /api/plaid/credit/payroll_income
 * GET /api/plaid/credit/payroll_income?borrower_id=xxx (for bank users)
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

    const query = getQuery(event)
    const borrowerId = query.borrower_id as string

    let borrower: any = null
    let userToken: string | undefined = undefined

    // If borrower_id is provided, check if user is a bank user accessing borrower data
    if (borrowerId) {
      if (user.role !== 'bank') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Only bank users can access borrower data by ID.'
        })
      }

      // Verify bank owns this borrower
      const bank = await findBankByUserId(user._id.toString())
      if (!bank || !bank._id) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Bank not found for this user'
        })
      }

      borrower = await findBorrowerById(borrowerId)
      if (!borrower) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Borrower not found'
        })
      }

      const borrowerBankId =
        typeof borrower.bankId === 'object' && borrower.bankId !== null
          ? (borrower.bankId as any)._id?.toString()
          : borrower.bankId?.toString()

      if (borrowerBankId !== bank._id.toString()) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. This borrower does not belong to your bank.'
        })
      }

      // Get borrower with user_token
      const BorrowerModel = await getBorrowerModel()
      const borrowerWithToken = await BorrowerModel.findById(borrowerId).select('+userToken').lean()
      userToken = borrowerWithToken?.userToken as string | undefined
    } else {
      // Self-access: borrower accessing their own data
      if (user.role !== 'borrower') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Borrower role required.'
        })
      }

      borrower = await findBorrowerByEmail(user.email)
      if (!borrower || !borrower._id) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Borrower profile not found'
        })
      }

      const BorrowerModel = await getBorrowerModel()
      const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+userToken').lean()
      userToken = borrowerWithToken?.userToken as string | undefined
    }
    
    if (!userToken) {
      return {
        success: true,
        credit_payroll_income: null,
        message: 'Borrower has not completed income verification'
      }
    }

    // Get Plaid client
    const client = getPlaidClient()

    // Get credit payroll income information
    const creditPayrollIncomeResponse = await client.creditPayrollIncomeGet({
      user_token: userToken,
    })

    return {
      success: true,
      credit_payroll_income: creditPayrollIncomeResponse.data,
    }

  } catch (error: any) {
    console.error('Error fetching credit payroll income:', error)
    
    // Handle Plaid API errors
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch credit payroll income',
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

