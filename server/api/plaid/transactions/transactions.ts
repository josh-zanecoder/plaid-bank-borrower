import { getPlaidClient } from '../../../utils/plaid'
import { findBorrowerById } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const currentUser = (event.context as any).user
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const bank = await findBankByUserId(currentUser._id.toString())
    if (!bank || !bank._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found for this user'
      })
    }

    const query = getQuery(event)
    const borrowerId = query.borrower_id as string

    if (!borrowerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'borrower_id query parameter is required'
      })
    }

    const borrower = await findBorrowerById(borrowerId)
    if (!borrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found'
      })
    }

    const borrowerBankId = typeof borrower.bankId === 'object' && borrower.bankId !== null
      ? (borrower.bankId as any)._id?.toString()
      : borrower.bankId?.toString()

    if (borrowerBankId !== bank._id.toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. This borrower does not belong to your bank.'
      })
    }

    const BorrowerModel = await (await import('../../../models/Borrower')).getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrowerId).select('+accessToken').lean()

    if (!borrowerWithToken || !borrowerWithToken.accessToken) {
      return {
        success: true,
        transactions: [],
        modified: [],
        removed: [],
        cursor: null,
        has_more: false,
        count: 0,
        message: 'Borrower has no connected Plaid account'
      }
    }

    const accessToken = borrowerWithToken.accessToken

    const accountId = query.account_id as string | undefined
    const cursor = query.cursor as string | undefined
    const useCache = query.use_cache !== 'false'

    const client = getPlaidClient()

    const options: any = {}
    if (accountId) {
      options.account_ids = [accountId]
    }

    let currentCursor = cursor || null
    let hasMore = true
    const added: any[] = []
    const modified: any[] = []
    const removed: any[] = []

    while (hasMore) {
      const syncRequest: any = {
        access_token: accessToken,
      }

      if (currentCursor) {
        syncRequest.cursor = currentCursor
      }

      if (Object.keys(options).length > 0) {
        syncRequest.options = options
      }

      const transactionsResponse = await client.transactionsSync(syncRequest)

      const nextCursor = transactionsResponse.data.next_cursor

      if (!nextCursor || nextCursor === '') {
        break
      }

      added.push(...(transactionsResponse.data.added || []))
      modified.push(...(transactionsResponse.data.modified || []))
      removed.push(...(transactionsResponse.data.removed || []))

      hasMore = transactionsResponse.data.has_more || false
      currentCursor = nextCursor

      if (added.length > 500) {
        break
      }
    }

    added.sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.authorized_date || 0).getTime()
      const dateB = new Date(b.date || b.authorized_date || 0).getTime()
      return dateB - dateA
    })

    return {
      success: true,
      transactions: added,
      modified: modified,
      removed: removed,
      cursor: currentCursor,
      has_more: hasMore,
      count: added.length,
    }

  } catch (error: any) {
    console.error('Error fetching transactions:', error)

    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch transactions',
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

