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
    // Get the current bank user
    const currentUser = (event.context as any).user
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Find the bank associated with this user
    const bank = await findBankByUserId(currentUser._id.toString())
    if (!bank || !bank._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found for this user'
      })
    }

    // Get borrower_id from query parameters
    const query = getQuery(event)
    const borrowerId = query.borrower_id as string

    if (!borrowerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'borrower_id query parameter is required'
      })
    }

    // Find the borrower
    const borrower = await findBorrowerById(borrowerId)
    if (!borrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found'
      })
    }

    // Verify the borrower belongs to this bank
    const borrowerBankId = typeof borrower.bankId === 'object' && borrower.bankId !== null
      ? (borrower.bankId as any)._id?.toString()
      : borrower.bankId?.toString()

    if (borrowerBankId !== bank._id.toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. This borrower does not belong to your bank.'
      })
    }

    // Get access token from borrower (need to explicitly select it since it's select: false)
    const BorrowerModel = await (await import('../../../models/Borrower')).getBorrowerModel()
    const borrowerWithToken = await BorrowerModel.findById(borrowerId).select('+accessToken').lean()

    // If borrower has no access token, return empty transactions instead of error
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

    // Get optional query parameters
    const accountId = query.account_id as string | undefined
    const cursor = query.cursor as string | undefined
    const useCache = query.use_cache !== 'false' // Default to true (use cache if available)

    // Get Plaid client and fetch transactions
    const client = getPlaidClient()

    // Build options for filtering
    const options: any = {}
    if (accountId) {
      options.account_ids = [accountId]
    }

    // Use transactionsSync API - matches Plaid API format: POST /transactions/sync
    // Equivalent to: https://sandbox.plaid.com/transactions/sync
    // Note: The SDK automatically handles client_id and secret in headers
    // Request body only needs: { access_token, cursor? }
    let currentCursor = cursor || null
    let hasMore = true
    const added: any[] = []
    const modified: any[] = []
    const removed: any[] = []

    // Iterate through pages of transactions
    while (hasMore) {
      // Request body format matches Plaid transactions/sync API
      // Body contains: { access_token, cursor?, options? }
      // (client_id and secret are handled by SDK in headers)
      const syncRequest: any = {
        access_token: accessToken,
      }

      // Include cursor if we have one (for pagination)
      if (currentCursor) {
        syncRequest.cursor = currentCursor
      }

      // Add options if we have any (e.g., account_ids filter)
      if (Object.keys(options).length > 0) {
        syncRequest.options = options
      }

      // Call Plaid transactions/sync endpoint
      const transactionsResponse = await client.transactionsSync(syncRequest)

      const nextCursor = transactionsResponse.data.next_cursor

      // If no cursor returned, we've reached the end
      if (!nextCursor || nextCursor === '') {
        break
      }

      // Collect transactions from this page
      added.push(...(transactionsResponse.data.added || []))
      modified.push(...(transactionsResponse.data.modified || []))
      removed.push(...(transactionsResponse.data.removed || []))

      hasMore = transactionsResponse.data.has_more || false
      currentCursor = nextCursor

      // Limit to avoid too many API calls in a single request
      if (added.length > 500) {
        break
      }
    }

    // Sort transactions by date (most recent first)
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

    // Handle Plaid API errors
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to fetch transactions',
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

