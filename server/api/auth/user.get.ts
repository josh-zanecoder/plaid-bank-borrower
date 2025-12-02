import { getCurrentUser } from '../../utils/auth'
import { getCookie } from 'h3'
import { findBorrowerByEmail, getBorrowerModel } from '../../models/Borrower'

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

    const userData: any = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    // If borrower, include borrower-specific data
    if (user.role === 'borrower') {
      try {
        const borrower = await findBorrowerByEmail(user.email)
        if (borrower) {
          const BorrowerModel = await getBorrowerModel()
          const borrowerWithToken = await BorrowerModel.findById(borrower._id).select('+accessToken').lean()
          const hasAccessToken = !!(borrowerWithToken && borrowerWithToken.accessToken)

          userData.borrower = {
            _id: borrower._id,
            firstName: borrower.firstName,
            lastName: borrower.lastName,
            plaidConnectionTypes: borrower.plaidConnectionTypes || ['bank_account'],
            hasAccessToken,
            bankId: typeof borrower.bankId === 'object' && borrower.bankId !== null 
              ? (borrower.bankId as any)._id?.toString() 
              : borrower.bankId?.toString(),
          }
        }
      } catch (borrowerError) {
        // If borrower data fetch fails, just continue without it
        console.error('Error fetching borrower data:', borrowerError)
      }
    }

    return {
      success: true,
      user: userData
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

