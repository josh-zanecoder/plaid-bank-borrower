import { deleteBorrower, findBorrowerById } from '../../../models/Borrower'
import { getFirebaseAuth } from '../../../lib/firebase'
import { deleteUser } from '../../../models/User'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Borrower ID is required'
      })
    }

    // Get the current bank user
    const currentUser = (event.context as any).user
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Find the bank associated with this user
    const bank = await findBankByUserId(currentUser._id.toString())
    if (!bank || !bank._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found for this user'
      })
    }

    // Check if borrower exists and belongs to this bank
    const existingBorrower = await findBorrowerById(id)
    if (!existingBorrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found'
      })
    }

    // Verify borrower belongs to this bank
    const borrowerBankId = existingBorrower.bankId?.toString() || (existingBorrower.bankId as any)?._id?.toString()
    if (borrowerBankId !== bank._id.toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this borrower'
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

