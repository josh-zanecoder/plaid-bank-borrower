import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

let plaidClient: PlaidApi | null = null

export function getPlaidClient(): PlaidApi {
  if (plaidClient) {
    return plaidClient
  }

  const config = useRuntimeConfig()
  const clientId = config.plaidClientId || process.env.PLAID_CLIENT_ID
  const secret = config.plaidSecret || process.env.PLAID_SECRET
  const env = config.plaidEnv || process.env.PLAID_ENV || 'sandbox'

  if (!clientId || !secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Plaid credentials not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET in your .env file'
    })
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[env as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': clientId,
        'PLAID-SECRET': secret,
        'Plaid-Version': '2020-09-14',
      },
    },
  })

  plaidClient = new PlaidApi(configuration)
  return plaidClient
}

