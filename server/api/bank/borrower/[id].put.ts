import { updateBorrower, findBorrowerById } from '../../../models/Borrower'
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

    const body = await readBody(event)
    const { firstName, lastName, email, plaidConnectionTypes } = body

    if (!firstName || !lastName || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First name, last name, and email are required'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

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
        statusMessage: 'You do not have permission to update this borrower'
      })
    }

    const updateData: any = {
      firstName,
      lastName,
      email: normalizedEmail,
    }
    
    if (plaidConnectionTypes !== undefined) {
      updateData.plaidConnectionTypes = plaidConnectionTypes
    }

    const updatedBorrower = await updateBorrower(id, updateData)

    if (!updatedBorrower) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update borrower'
      })
    }

    return {
      success: true,
      message: 'Borrower updated successfully',
      data: {
        borrower: {
          id: updatedBorrower._id?.toString(),
          firstName: updatedBorrower.firstName,
          lastName: updatedBorrower.lastName,
          email: updatedBorrower.email,
          role: updatedBorrower.role,
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update borrower'
    })
  }
})

