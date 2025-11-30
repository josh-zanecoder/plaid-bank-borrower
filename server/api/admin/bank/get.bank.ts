import { findAllBanks } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
    const banks = await findAllBanks()

    return {
      success: true,
      banks: banks.map(bank => ({
        _id: bank._id?.toString(),
        id: bank._id?.toString(),
        name: bank.name,
        email: bank.email,
        role: bank.role,
        userId: bank.userId,
        createdAt: bank.createdAt,
        updatedAt: bank.updatedAt,
      }))
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch banks'
    })
  }
})

