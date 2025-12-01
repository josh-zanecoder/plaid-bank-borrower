// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  css: ['./app/assets/css/main.css'],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    plaidClientId: process.env.PLAID_CLIENT_ID,
    plaidSecret: process.env.PLAID_SECRET,
    plaidEnv: process.env.PLAID_ENV || 'sandbox',
    plaidProducts: process.env.PLAID_PRODUCTS || 'transactions',
    plaidCountryCodes: process.env.PLAID_COUNTRY_CODES || 'US',
    plaidClientName: process.env.PLAID_CLIENT_NAME || 'Underwriting Platform',
    plaidRedirectUri: process.env.PLAID_REDIRECT_URI || '',
    plaidWebhookUrl: process.env.PLAID_WEBHOOK_URL || '',
    plaidAndroidPackageName: process.env.PLAID_ANDROID_PACKAGE_NAME || '',
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    }
  }
})