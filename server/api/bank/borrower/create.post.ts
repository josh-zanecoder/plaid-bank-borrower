import { getFirebaseAuth } from '../../../lib/firebase'
import { createUser, findUserByEmail } from '../../../models/User'
import { createBorrower } from '../../../models/Borrower'
import { findBankByUserId } from '../../../models/Banks'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { firstName, lastName, email, password, plaidConnectionTypes } = body

    if (!firstName || !lastName || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First name, last name, email, and password are required'
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

    // Get the current bank user
    const currentUser = (event.context as any).user
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required to create borrower'
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

    const firebaseAuth = getFirebaseAuth()

    let firebaseUid: string
    let firebaseUser: any

    try {
      firebaseUser = await firebaseAuth.createUser({
        email: normalizedEmail,
        password: password,
        displayName: `${firstName} ${lastName}`,
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
        name: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        firebaseUid: firebaseUid,
        role: 'borrower',
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

    let borrower
    try {
      borrower = await createBorrower({
        firstName: firstName,
        lastName: lastName,
        email: normalizedEmail,
        userId: mongoUser._id?.toString(),
        bankId: bank._id.toString(),
        addedBy: currentUser._id?.toString(),
        plaidConnectionTypes: plaidConnectionTypes || ['bank_account'],
      })
    } catch (borrowerError: any) {
      try {
        await firebaseAuth.deleteUser(firebaseUid)
      } catch (deleteError) {
        console.error('Failed to clean up Firebase user after borrower creation error:', deleteError)
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create borrower: ${borrowerError.message}`
      })
    }

    return {
      success: true,
      message: 'Borrower created successfully',
      data: {
        borrower: {
          id: borrower._id?.toString(),
          firstName: borrower.firstName,
          lastName: borrower.lastName,
          email: borrower.email,
          role: borrower.role,
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
      statusMessage: error.message || 'Failed to create borrower'
    })
  }
})

