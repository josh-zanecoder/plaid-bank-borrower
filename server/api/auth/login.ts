import { getFirebaseAuth } from '../../lib/firebase'
import { setAuthCookie } from '../../utils/auth'

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

    const sessionToken = crypto.randomUUID()

    setCookie(event, 'session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    setCookie(event, 'user_id', decodedToken.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: error.message || 'Invalid ID token'
    })
  }
})
