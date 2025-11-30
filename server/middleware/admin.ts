import { getCurrentUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''
  
  if (path.startsWith('/api/admin/')) {
    const user = await getCurrentUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in.'
      })
    }

    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Admin role required.'
      })
    }

    event.context.user = user
  }
})

