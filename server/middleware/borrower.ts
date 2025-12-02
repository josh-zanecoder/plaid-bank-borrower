import { getCurrentUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  if (path.startsWith('/api/borrower/')) {
    const user = await getCurrentUser(event)
    
    if (!user) {
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

    event.context.user = user
  }
})

