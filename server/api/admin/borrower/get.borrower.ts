import { findAllBorrowers } from '../../../models/Borrower'

export default defineEventHandler(async (event) => {
  try {
    const borrowers = await findAllBorrowers()

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
        createdAt: borrower.createdAt,
        updatedAt: borrower.updatedAt,
      }))
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch borrowers'
    })
  }
})

