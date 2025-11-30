import { updateBank, findBankById } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bank ID is required'
      })
    }

    const body = await readBody(event)
    const { name, email } = body

    if (!name || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and email are required'
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

    const existingBank = await findBankById(id)
    if (!existingBank) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bank not found'
      })
    }

    const updatedBank = await updateBank(id, {
      name,
      email: normalizedEmail,
    })

    if (!updatedBank) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update bank'
      })
    }

    return {
      success: true,
      message: 'Bank updated successfully',
      data: {
        bank: {
          id: updatedBank._id?.toString(),
          name: updatedBank.name,
          email: updatedBank.email,
          role: updatedBank.role,
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update bank'
    })
  }
})

