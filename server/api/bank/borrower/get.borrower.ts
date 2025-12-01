import { findAllBorrowers } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
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

    // Get all borrowers for this bank only
    const borrowers = await findAllBorrowers(bank._id.toString())

    return {
      success: true,
      data: borrowers.map(borrower => ({
        id: borrower._id?.toString(),
        _id: borrower._id?.toString(),
        firstName: borrower.firstName,
        lastName: borrower.lastName,
        email: borrower.email,
        role: borrower.role,
        userId: borrower.userId,
        bankId: borrower.bankId,
        addedBy: borrower.addedBy,
        plaidConnectionTypes: borrower.plaidConnectionTypes || ['bank_account'],
        createdAt: borrower.createdAt,
        updatedAt: borrower.updatedAt,
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch borrowers'
    })
  }
})

