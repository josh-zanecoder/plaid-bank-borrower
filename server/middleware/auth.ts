import { getCurrentUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/user')) {
    return
  }

  if (path.startsWith('/api/')) {
    const user = await getCurrentUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in.'
      })
    }

    event.context.user = user
  }
})

