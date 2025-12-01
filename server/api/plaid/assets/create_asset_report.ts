import { getPlaidClient } from '../../../utils/plaid'
import { findBorrowerById } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
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

    const body = await readBody<{
      borrower_id?: string
      days_requested?: number
      client_report_id?: string
      webhook?: string
    }>(event)

    const borrowerId = body.borrower_id

    if (!borrowerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'borrower_id is required',
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

    const BorrowerModel = await (await import('../../../models/Borrower')).getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrowerId).select('+accessToken').lean()

    if (!borrowerWithToken || !borrowerWithToken.accessToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Borrower has no connected Plaid account. Please connect a bank account first.',
      })
    }

    const accessToken = borrowerWithToken.accessToken as string

    const daysRequested = body.days_requested || 90
    const clientReportId = body.client_report_id || undefined
    const webhook = body.webhook || undefined

    const client = getPlaidClient()

    const requestBody: any = {
      access_tokens: [accessToken],
      days_requested: daysRequested,
      options: {
        client_report_id: clientReportId,
        user: {
          client_user_id: borrowerId,
          first_name: borrower.firstName,
          last_name: borrower.lastName,
          ssn: '000-00-0000',
          phone_number: '+10000000000',
          email: borrower.email,
        },
      },
    }

    if (webhook) {
      requestBody.options.webhook = webhook
    }

    const assetReportResponse = await client.assetReportCreate(requestBody)
    const responseData = assetReportResponse.data

    return {
      success: true,
      asset_report_token: responseData.asset_report_token,
      asset_report_id: responseData.asset_report_id,
      request_id: responseData.request_id,
      status: 'creating',
      message:
        "Asset report is being created. Use the asset_report_token to retrieve it once it's ready.",
    }
  } catch (error: any) {
    console.error('Error creating asset report for borrower:', error)

    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to create asset report',
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


