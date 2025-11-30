import { getCookie, setCookie, deleteCookie, getHeader, getQuery } from 'h3'
import { findUserById } from '../models/User'
import type { User } from '../models/User'

export async function getCurrentUser(event: any): Promise<User | null> {
  try {
    let userId = getCookie(event, 'user_id') || getCookie(event, 'userId')
    
    if (!userId) {
      const authHeader = getHeader(event, 'authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        if (token && token.length >= 24) {
          userId = token
        }
      }
    }
    
    if (!userId) {
      const query = getQuery(event)
      userId = query.user_id as string | undefined
    }

    if (!userId) {
      return null
    }

    const user = await findUserById(userId)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getCurrentUserId(event: any): Promise<string | null> {
  const user = await getCurrentUser(event)
  return user?._id || null
}

export function setAuthCookie(event: any, userId: string): void {
  setCookie(event, 'user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearAuthCookie(event: any): void {
  deleteCookie(event, 'user_id')
  deleteCookie(event, 'userId')
}

export async function requireAuth(event: any): Promise<User> {
  const user = await getCurrentUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required. Please log in.'
    })
  }
  
  return user
}

