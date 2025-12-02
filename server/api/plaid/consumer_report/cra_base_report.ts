import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { findBorrowerByEmail, findBorrowerById, getBorrowerModel } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

/**
 * Get CRA Base Report for a borrower
 * GET /api/plaid/consumer_report/cra_base_report
 * GET /api/plaid/consumer_report/cra_base_report?borrower_id=xxx (for bank users)
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
        success: false,
        message: 'Borrower has not completed consumer report setup. User token is required.'
      }
    }

    // Get Plaid client
    const client = getPlaidClient()

    // Poll for the CRA base report to be ready
    const getResponse = await getCraBaseReportWithRetries(client, userToken)

    // Also get the PDF version (optional)
    let pdfBase64: string | null = null
    try {
      const pdfResponse = await client.craCheckReportPdfGet({
        user_token: userToken,
      }, {
        responseType: 'arraybuffer'
      })
      pdfBase64 = Buffer.from(pdfResponse.data as ArrayBuffer).toString('base64')
    } catch (pdfError: any) {
      console.warn('Could not fetch CRA base report PDF:', pdfError)
      // Continue without PDF
    }

    return {
      success: true,
      report: getResponse.data.report,
      pdf: pdfBase64,
      request_id: getResponse.data.request_id,
    }

  } catch (error: any) {
    console.error('Error fetching CRA base report:', error)
    
    // Handle Plaid API errors
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch CRA base report',
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

// Helper function to poll for CRA base report with retries
const getCraBaseReportWithRetries = async (
  plaidClient: any,
  userToken: string,
  ms: number = 1000,
  retriesLeft: number = 20
): Promise<any> => {
  return pollWithRetries(
    async () => {
      return await plaidClient.craCheckReportBaseReportGet({
        user_token: userToken
      })
    },
    ms,
    retriesLeft
  )
}

// Helper function to poll with retries
const pollWithRetries = (
  requestCallback: () => Promise<any>,
  ms: number = 1000,
  retriesLeft: number = 20
): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestCallback()
      .then(resolve)
      .catch((error: any) => {
        // If it's not a retryable error (like 404), reject immediately
        if (error.response?.status && error.response.status !== 202 && error.response.status < 500) {
          reject(error)
          return
        }
        
        if (retriesLeft === 1) {
          reject(new Error('Ran out of retries while polling for CRA base report'))
          return
        }
        
        setTimeout(() => {
          pollWithRetries(requestCallback, ms, retriesLeft - 1).then(resolve).catch(reject)
        }, ms)
      })
  })
}

