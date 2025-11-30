import { getCurrentUser } from '../../utils/auth'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        const userIdCookie = getCookie(event, 'user_id')
        const sessionCookie = getCookie(event, 'session_token')
        console.log('Auth check failed - cookies:', { 
          userIdCookie: userIdCookie ? 'present' : 'missing',
          sessionCookie: sessionCookie ? 'present' : 'missing',
          url: event.node.req.url
        })
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
})

