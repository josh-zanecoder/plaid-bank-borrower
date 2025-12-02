import { getPlaidClient } from '../../../utils/plaid'
import { getCurrentUser } from '../../../utils/auth'
import { findBorrowerByEmail } from '../../../models/Borrower'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const client = getPlaidClient()


    const productsEnv = config.plaidProducts || 'transactions,assets,liabilities'
    const productsArray = productsEnv.split(',').map((p: string) => p.trim().toLowerCase())
    
    const requestedProducts = body.products || productsArray
    const requestedProductsLower = Array.isArray(requestedProducts) 
      ? requestedProducts.map((p: string) => p.trim().toLowerCase())
      : [requestedProducts.trim().toLowerCase()]
    
    const countryCodes = (config.plaidCountryCodes || 'US').split(',').map((c: string) => c.trim())

    // Get authenticated user if available
    let user = null
    let borrower = null
    try {
      user = await getCurrentUser(event)
      
      // Find borrower if user is authenticated
      if (user?._id && user.role === 'borrower') {
        borrower = await findBorrowerByEmail(user.email)
      }
    } catch (error) {
      // User not authenticated - that's okay for basic bank account connection
      console.log('User not authenticated for link token creation')
    }

    // Build link token request for basic bank account connection
    const linkTokenRequest: any = {
      user: {
        client_user_id: user?._id?.toString() || borrower?._id?.toString() || body.client_user_id || `user_${Date.now()}`,
      },
      client_name: config.plaidClientName || 'Bank Borrower App',
      products: requestedProducts,
      country_codes: countryCodes,
      language: 'en',
    }


    // Add redirect URI if configured
    if (config.plaidRedirectUri) {
      linkTokenRequest.redirect_uri = config.plaidRedirectUri
    }

    // Add webhook URL if configured
    if (config.plaidWebhookUrl) {
      linkTokenRequest.webhook = config.plaidWebhookUrl
    }

    // Add Android package name if configured
    if (config.plaidAndroidPackageName) {
      linkTokenRequest.android_package_name = config.plaidAndroidPackageName
    }

    // Configure transactions if included
    if (requestedProductsLower.includes('transactions')) {
      linkTokenRequest.transactions = {
        days_requested: body.days_requested || 90
      }
    }

    if (requestedProductsLower.includes('assets')) {
    }

    if (!linkTokenRequest.additional_consented_products) {
      linkTokenRequest.additional_consented_products = []
    }
    if (!linkTokenRequest.additional_consented_products.includes('liabilities')) {
      linkTokenRequest.additional_consented_products.push('liabilities')
    }


    // Create link token
    const response = await client.linkTokenCreate(linkTokenRequest)

    return {
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    }
  } catch (error: any) {
    console.error('Plaid link token creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.response?.data) {
      throw createError({
        statusCode: error.response.status || 400,
        statusMessage: error.response.data.error_message || 'Failed to create link token',
        data: error.response.data,
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create link token'
    })
  }
})

