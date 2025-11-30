import { deleteBorrower, findBorrowerById } from '../../../models/Borrower'
import { getFirebaseAuth } from '../../../lib/firebase'
import { deleteUser } from '../../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Borrower ID is required'
      })
    }

    const existingBorrower = await findBorrowerById(id)
    if (!existingBorrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found'
      })
    }

    if (existingBorrower.userId) {
      // Since findBorrowerById uses .populate('userId'), userId is the full user object
      const populatedUser = existingBorrower.userId as any
      
      // Extract user ID and firebaseUid from populated user object
      const userId = populatedUser?._id?.toString() || populatedUser?.toString()
      const firebaseUid = populatedUser?.firebaseUid
      
      // Delete from Firebase Auth
      if (firebaseUid) {
        try {
          const firebaseAuth = getFirebaseAuth()
          await firebaseAuth.deleteUser(firebaseUid)
        } catch (firebaseError: any) {
          console.error('Failed to delete Firebase user:', firebaseError)
        }
      }
      
      // Delete from Users collection
      if (userId) {
        try {
          await deleteUser(userId)
        } catch (userError: any) {
          console.error('Failed to delete user from Users collection:', userError)
        }
      }
    }

    const deleted = await deleteBorrower(id)

    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete borrower'
      })
    }

    return {
      success: true,
      message: 'Borrower deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete borrower'
    })
  }
})

