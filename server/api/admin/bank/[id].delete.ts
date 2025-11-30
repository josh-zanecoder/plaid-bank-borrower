import { deleteBank, findBankById } from '../../../models/Banks'
import { getFirebaseAuth } from '../../../lib/firebase'
import { findUserById } from '../../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bank ID is required'
      })
    }

    const existingBank = await findBankById(id)
    if (!existingBank) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found'
      })
    }

    if (existingBank.userId) {
      const userId = existingBank.userId?.toString?.() || String(existingBank.userId)
      
      if (userId) {
        const user = await findUserById(userId)
        if (user?.firebaseUid) {
          try {
            const firebaseAuth = getFirebaseAuth()
            await firebaseAuth.deleteUser(user.firebaseUid)
          } catch (firebaseError: any) {
            console.error('Failed to delete Firebase user:', firebaseError)
          }
        }
      }
    }

    const deleted = await deleteBank(id)

    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete bank'
      })
    }

    return {
      success: true,
      message: 'Bank deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete bank'
    })
  }
})

