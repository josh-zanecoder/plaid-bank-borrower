import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { findBorrowerByEmail, updateBorrower, getBorrowerModel } from '../../../models/Borrower'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  const body = await readBody(event)
  const { public_token } = body

  if (!public_token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'public_token is required'
    })
  }

  try {
    const currentUser = await getCurrentUser(event)
    
    if (!currentUser || !currentUser._id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    if (currentUser.role !== 'borrower') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Borrower role required.'
      })
    }

    // Find borrower
    const borrower = await findBorrowerByEmail(currentUser.email)
    
    if (!borrower || !borrower._id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Borrower profile not found'
      })
    }

    const client = getPlaidClient()

    // Exchange public token for access token
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: public_token,
    })

    const accessToken = tokenResponse.data.access_token
    const itemId = tokenResponse.data.item_id

    // Get item information to extract institution details (optional)
    let institutionId: string | undefined
    let institutionName: string | undefined

    try {
      const itemResponse = await client.itemGet({
        access_token: accessToken,
      })
      institutionId = itemResponse.data.item.institution_id || undefined
      institutionName = itemResponse.data.item.institution_name || undefined
    } catch (err) {
      console.warn('Could not fetch item details:', err)
    }

    // Update borrower with access token
    await updateBorrower(borrower._id.toString(), {
      accessToken: accessToken,
    })

    return {
      success: true,
      access_token: accessToken,
      item_id: itemId,
      institution_id: institutionId,
      institution_name: institutionName,
      message: 'Successfully exchanged public token for access token',
    }

  } catch (error: any) {
    console.error('Error exchanging public token:', error)
    
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to exchange public token',
        data: error.response.data,
      })
    }

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
})

