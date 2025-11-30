import { updateBorrower, findBorrowerById } from '../../../models/Borrower'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Borrower ID is required'
      })
    }

    const body = await readBody(event)
    const { firstName, lastName, email } = body

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

    const existingBorrower = await findBorrowerById(id)
    if (!existingBorrower) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower not found'
      })
    }

    const updatedBorrower = await updateBorrower(id, {
      firstName,
      lastName,
      email: normalizedEmail,
    })

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

