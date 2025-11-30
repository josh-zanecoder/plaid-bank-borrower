import { getFirebaseAuth } from '../../lib/firebase'
import { setAuthCookie } from '../../utils/auth'
import { findUserByFirebaseUid } from '../../models/User'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)
    const { idToken } = body

    if (!idToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID token is required'
      })
    }

    const firebaseAuth = getFirebaseAuth()
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    // Find user in MongoDB by firebaseUid
    const user = await findUserByFirebaseUid(decodedToken.uid)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found. Please contact support.'
      })
    }

    const sessionToken = crypto.randomUUID()

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    }

    setCookie(event, 'session_token', sessionToken, cookieOptions)
    
    const userId = user._id?.toString()
    if (!userId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to get user ID'
      })
    }
    
    setCookie(event, 'user_id', userId, cookieOptions)

    return {
      success: true,
      user: {
        id: user._id?.toString(),
        uid: decodedToken.uid,
        email: user.email,
        name: user.name,
        role: user.role || 'borrower',
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: error.message || 'Invalid ID token'
    })
  }
})
