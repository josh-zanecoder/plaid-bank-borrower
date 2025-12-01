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

    if (!borrowerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'borrower_id query parameter is required',
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
      return {
        success: true,
        accounts: [],
        liabilities: {
          credit: null,
          mortgage: null,
          student: null,
        },
        message: 'Borrower has no connected Plaid account',
      }
    }

    const accessToken = borrowerWithToken.accessToken as string

    const client = getPlaidClient()

    const liabilitiesResponse = await client.liabilitiesGet({
      access_token: accessToken,
    })

    return {
      success: true,
      ...liabilitiesResponse.data,
    }
  } catch (error: any) {
    console.error('Error fetching liabilities for borrower:', error)

    const errorCode = error.response?.data?.error_code || error.response?.data?.error?.error_code
    const errorMessage =
      error.response?.data?.error_message || error.response?.data?.error?.error_message || ''

    if (
      errorCode === 'ITEM_ERROR' ||
      errorMessage.toLowerCase().includes('no valid liability') ||
      errorMessage.toLowerCase().includes('no liability account')
    ) {
      return {
        success: true,
        accounts: [],
        liabilities: {
          credit: null,
          mortgage: null,
          student: null,
        },
      }
    }

    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch liabilities',
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


