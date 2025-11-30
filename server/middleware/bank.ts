import { getCurrentUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  if (path.startsWith('/api/bank/')) {
    const user = await getCurrentUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in.'
      })
    }

    if (user.role !== 'bank') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Bank role required.'
      })
    }

    event.context.user = user
  }
})

