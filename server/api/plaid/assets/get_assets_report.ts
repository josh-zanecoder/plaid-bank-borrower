import { getPlaidClient } from '../../../utils/plaid'
import { findBorrowerById } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

  try {
    const currentUser = (event.context as any).user
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    const bank = await findBankByUserId(currentUser._id.toString())
    if (!bank || !bank._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found for this user',
      })
    }

    const query = getQuery(event)
    const borrowerId = typeof query.borrower_id === 'string' ? query.borrower_id : null
    const assetReportToken =
      typeof query.asset_report_token === 'string' ? query.asset_report_token : null

    if (!borrowerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'borrower_id query parameter is required',
      })
    }

    if (!assetReportToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'asset_report_token query parameter is required',
      })
    }

    const borrower = await findBorrowerById(borrowerId)
    if (!borrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found',
      })
    }

    const borrowerBankId =
      typeof borrower.bankId === 'object' && borrower.bankId !== null
        ? (borrower.bankId as any)._id?.toString()
        : borrower.bankId?.toString()

    if (borrowerBankId !== bank._id.toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. This borrower does not belong to your bank.',
      })
    }

    const client = getPlaidClient()

    const assetReportResponse = await client.assetReportGet({
      asset_report_token: assetReportToken,
    })

    return {
      success: true,
      report: assetReportResponse.data.report,
      request_id: assetReportResponse.data.request_id,
      status: 'ready',
    }
  } catch (error: any) {
    console.error('Error fetching asset report for borrower:', error)

    if (error.response?.data) {
      if (error.response.data.error_code === 'PRODUCT_NOT_READY') {
        return {
          success: false,
          status: 'creating',
          message: 'Asset report is still being generated. Please try again in a few moments.',
        }
      }

      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch asset report',
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


