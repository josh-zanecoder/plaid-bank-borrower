import { getFirebaseAuth } from '../../../lib/firebase'
import { createUser, findUserByEmail } from '../../../models/User'
import { createBank } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password } = body

    if (!name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, and password are required'
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

    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email already exists'
      })
    }

    const firebaseAuth = getFirebaseAuth()

    let firebaseUid: string
    let firebaseUser: any

    try {
      firebaseUser = await firebaseAuth.createUser({
        email: normalizedEmail,
        password: password,
        displayName: name,
        emailVerified: false,
      })
      firebaseUid = firebaseUser.uid
    } catch (firebaseError: any) {
      if (firebaseError.code === 'auth/email-already-exists') {
        throw createError({
          statusCode: 400,
          statusMessage: 'User with this email already exists in Firebase'
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create Firebase user: ${firebaseError.message}`
      })
    }

    let mongoUser
    try {
      mongoUser = await createUser({
        email: normalizedEmail,
        name: name,
        password: password,
        firebaseUid: firebaseUid,
        role: 'bank',
      })
    } catch (mongoError: any) {
      try {
        await firebaseAuth.deleteUser(firebaseUid)
      } catch (deleteError) {
        console.error('Failed to clean up Firebase user after MongoDB error:', deleteError)
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create user in database: ${mongoError.message}`
      })
    }

    let bank
    try {
      bank = await createBank({
        name: name,
        email: normalizedEmail,
        userId: mongoUser._id?.toString(),
      })
    } catch (bankError: any) {
      try {
        await firebaseAuth.deleteUser(firebaseUid)
      } catch (deleteError) {
        console.error('Failed to clean up Firebase user after bank creation error:', deleteError)
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create bank: ${bankError.message}`
      })
    }

    return {
      success: true,
      message: 'Bank created successfully',
      data: {
        bank: {
          id: bank._id?.toString(),
          name: bank.name,
          email: bank.email,
          role: bank.role,
        },
        user: {
          id: mongoUser._id?.toString(),
          email: mongoUser.email,
          name: mongoUser.name,
          firebaseUid: mongoUser.firebaseUid,
          role: mongoUser.role,
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create bank'
    })
  }
})

