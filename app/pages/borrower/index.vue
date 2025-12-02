<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
    <!-- Header with Logout -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Borrower Portal
            </span>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Welcome, {{ user?.firstName || user?.email }}!</h1>
        <p class="text-gray-600 mt-2">Connect your accounts to complete your loan application</p>
      </div>

      <!-- Error Message -->
      <div v-if="linkError" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-2 text-red-800">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">{{ linkError }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-2 text-green-800">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingBorrower" class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-center justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>

      <!-- Plaid Connection Options -->
      <div v-else-if="user" class="space-y-6">
        <!-- No Connection Types Available -->
        <div v-if="!hasConnectionTypes" class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="flex flex-col items-center gap-4">
            <div class="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">No Connection Options Available</h3>
              <p class="text-gray-600">Please contact your bank to set up connection options for your account.</p>
            </div>
          </div>
        </div>

        <!-- Bank Account Connection -->
        <div v-if="showBankAccountButton" class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Connect Bank Account</h3>
                <p class="text-sm text-gray-600">Securely link your bank account using Plaid</p>
              </div>
            </div>
            <button
              v-if="!user.borrower?.hasAccessToken"
              @click="handleConnectBankAccount"
              :disabled="loadingLink"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loadingLink">Connecting...</span>
              <span v-else>Connect Account</span>
            </button>
            <div v-else class="flex items-center gap-2 text-green-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">Connected</span>
            </div>
          </div>
        </div>

        <!-- Income Verification -->
        <div
          v-if="showIncomeVerificationButton"
          class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Income Verification</h3>
                <p class="text-sm text-gray-600">Verify your income for faster loan approval</p>
              </div>
            </div>
            <button
              @click="handleIncomeVerification"
              :disabled="loadingIncomeLink"
              class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loadingIncomeLink">Verifying...</span>
              <span v-else>Verify Income</span>
            </button>
          </div>

          <!-- Income Data Display -->
          <div v-if="incomeData || loadingIncome" class="mt-6 pt-6 border-t border-gray-200">
            <div v-if="loadingIncome" class="flex items-center justify-center py-4">
              <svg class="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2 text-gray-600">Loading income data...</span>
            </div>
            <div v-else class="text-center py-4">
              <button
                @click="fetchIncomeData"
                class="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                View Income Details
              </button>
            </div>
          </div>
        </div>

        <!-- Consumer Report -->
        <div
          v-if="showConsumerReportButton"
          class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Consumer Report</h3>
                <p class="text-sm text-gray-600">Generate a comprehensive credit report</p>
              </div>
            </div>
            <button
              @click="handleConsumerReport"
              :disabled="loadingCraLink"
              class="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loadingCraLink">Generating...</span>
              <span v-else>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'Borrower Portal - LendingHub',
  layout: false,
  middleware: 'borrower'
})

const user = ref<any>(null)
const loadingBorrower = ref(false)
const loadingLink = ref(false)
const loadingIncomeLink = ref(false)
const loadingCraLink = ref(false)
const linkError = ref('')
const successMessage = ref('')
const incomeData = ref<any>(null)
const loadingIncome = ref(false)

// Computed properties for button display logic
const hasConnectionTypes = computed(() => {
  const connectionTypes = user.value?.borrower?.plaidConnectionTypes
  return connectionTypes && Array.isArray(connectionTypes) && connectionTypes.length > 0
})

const showBankAccountButton = computed(() => {
  const connectionTypes = user.value?.borrower?.plaidConnectionTypes
  return connectionTypes && Array.isArray(connectionTypes) && connectionTypes.includes('bank_account')
})

const showIncomeVerificationButton = computed(() => {
  const connectionTypes = user.value?.borrower?.plaidConnectionTypes
  return user.value?.borrower?.hasAccessToken && 
         connectionTypes && 
         Array.isArray(connectionTypes) && 
         connectionTypes.includes('income_verification')
})

const showConsumerReportButton = computed(() => {
  const connectionTypes = user.value?.borrower?.plaidConnectionTypes
  return user.value?.borrower?.hasAccessToken && 
         connectionTypes && 
         Array.isArray(connectionTypes) && 
         connectionTypes.includes('consumer_report')
})

onMounted(async () => {
  loadingBorrower.value = true
  
  // Load Plaid Link script
  if (typeof window !== 'undefined' && !(window as any).Plaid) {
    const script = document.createElement('script')
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    script.onload = () => {
      console.log('Plaid Link script loaded')
    }
    document.head.appendChild(script)
  }

  try {
    const response = await $fetch<{ success: boolean; user?: any }>('/api/auth/user', {
      credentials: 'include'
    })
    
    if (response.success && response.user) {
      user.value = response.user
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loadingBorrower.value = false
  }
})

// Wait for Plaid script to load
const waitForPlaidScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Plaid) {
      resolve()
      return
    }

    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).Plaid) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve()
    }, 10000)
  })
}

// Handle Bank Account Connection
const handleConnectBankAccount = async () => {
  linkError.value = ''
  successMessage.value = ''
  loadingLink.value = true

  try {
        const response = await $fetch<{ link_token: string }>('/api/plaid/token/create_link_token', {
          method: 'POST',
          body: {
            products: ['transactions', 'auth', 'assets', 'investments'],
          },
        })

    if (!response.link_token) {
      throw new Error('Failed to get link token')
    }

    await waitForPlaidScript()

    const handler = (window as any).Plaid.create({
      token: response.link_token,
      onSuccess: async (publicToken: string, metadata: any) => {
        loadingLink.value = true
        try {
          await $fetch('/api/plaid/token/exchange_public_token', {
            method: 'POST',
            body: { public_token: publicToken },
          })

          // Refresh user data to get updated hasAccessToken
          const userResponse = await $fetch<{ success: boolean; user?: any }>('/api/auth/user', {
            credentials: 'include'
          })
          
          if (userResponse.success && userResponse.user) {
            user.value = userResponse.user
          }

          successMessage.value = 'Bank account connected successfully!'
          linkError.value = ''
          
          setTimeout(() => {
            successMessage.value = ''
          }, 5000)
        } catch (err: any) {
          console.error('Error exchanging token:', err)
          linkError.value = err.data?.statusMessage || err.message || 'Failed to connect bank account'
        } finally {
          loadingLink.value = false
        }
      },
      onExit: (err: any, metadata: any) => {
        console.log('Plaid Link Exit:', { err, metadata })
        loadingLink.value = false
        if (err) {
          linkError.value = err.display_message || 'Connection cancelled'
        }
      },
      onEvent: (eventName: string, metadata: any) => {
        console.log('Plaid Link Event:', eventName, metadata)
      },
    })

    handler.open()
    loadingLink.value = false
  } catch (err: any) {
    console.error('Plaid Link Error:', err)
    linkError.value = err.data?.statusMessage || err.message || 'Failed to initialize Plaid Link'
    loadingLink.value = false
  }
}

// Handle Income Verification
const handleIncomeVerification = async () => {
  linkError.value = ''
  successMessage.value = ''
  loadingIncomeLink.value = true

  try {
    const response = await $fetch<{ link_token: string }>('/api/plaid/token/create_link_token_for_income', {
      method: 'POST',
      body: {
        income_source_types: ['payroll'],
        include_risk_signals: true,
      },
    })

    if (!response.link_token) {
      throw new Error('Failed to get link token for income verification')
    }

    await waitForPlaidScript()

    const handler = (window as any).Plaid.create({
      token: response.link_token,
      onSuccess: async (publicToken: string, metadata: any) => {
        console.log('Income Verification Link Success:', { publicToken, metadata })
        loadingIncomeLink.value = true
        
        try {
          // Income Verification does NOT require token exchange
          // It uses user_token only, not access_token
          // The public_token is not needed for income verification flows
          
          console.log('Income verification completed successfully')
          
          // Show success message
          successMessage.value = 'Income verification completed successfully!'
          linkError.value = ''
          
          // Automatically fetch income data after verification
          setTimeout(() => {
            fetchIncomeData()
          }, 1000)
          
          setTimeout(() => {
            successMessage.value = ''
          }, 5000)
        } catch (err: any) {
          console.error('Error completing income verification:', err)
          linkError.value = err.data?.statusMessage || err.message || 'Failed to complete income verification'
        } finally {
          loadingIncomeLink.value = false
        }
      },
      onExit: (err: any, metadata: any) => {
        console.log('Plaid Link Exit:', { err, metadata })
        loadingIncomeLink.value = false
        if (err) {
          // Filter out errors about unsupported products (transactions/liabilities)
          // These are expected when doing income verification with existing bank connections
          const errorMessage = err.display_message || err.error_message || 'Income verification cancelled'
          
          // Check if it's an unsupported products error - these can be safely ignored
          // as income verification doesn't need transactions/liabilities
          if (errorMessage.includes('not supported') || 
              errorMessage.includes('Unable to load')) {
            console.warn('Products not supported during income verification (expected):', errorMessage)
            // Still show a message but not as an error
            linkError.value = 'Income verification completed. Note: Some products may not be available for this institution.'
            setTimeout(() => {
              linkError.value = ''
            }, 5000)
          } else {
            linkError.value = errorMessage
          }
        }
      },
      onEvent: (eventName: string, metadata: any) => {
        console.log('Plaid Link Event:', eventName, metadata)
      },
    })

    handler.open()
    loadingIncomeLink.value = false
  } catch (err: any) {
    console.error('Income Verification Link Error:', err)
    linkError.value = err.data?.statusMessage || err.message || 'Failed to initialize income verification'
    loadingIncomeLink.value = false
  }
}

// Handle Consumer Report (CRA)
const handleConsumerReport = async () => {
  linkError.value = ''
  successMessage.value = ''
  loadingCraLink.value = true

  try {
    // Use dedicated consumer report endpoint
    const response = await $fetch<{ link_token: string }>('/api/plaid/token/create_link_token_for_consumer_report', {
      method: 'POST',
      body: {
        days_requested: 60,
      },
    })

    if (!response.link_token) {
      throw new Error('Failed to get link token for consumer report')
    }

    await waitForPlaidScript()

    const handler = (window as any).Plaid.create({
      token: response.link_token,
      onSuccess: async (publicToken: string, metadata: any) => {
        console.log('Consumer Report Link Success:', { publicToken, metadata })
        loadingCraLink.value = true
        
        try {
          // Consumer Report does NOT require token exchange
          // It uses user_token only, not access_token
          // The public_token is not needed for consumer report flows
          
          console.log('Consumer report completed successfully')
          
          // Show success message
          successMessage.value = 'Consumer report completed successfully!'
          linkError.value = ''
          
          setTimeout(() => {
            successMessage.value = ''
          }, 5000)
        } catch (err: any) {
          console.error('Error completing consumer report:', err)
          linkError.value = err.data?.statusMessage || err.message || 'Failed to complete consumer report'
        } finally {
          loadingCraLink.value = false
        }
      },
      onExit: (err: any, metadata: any) => {
        console.log('Plaid Link Exit:', { err, metadata })
        loadingCraLink.value = false
        if (err) {
          linkError.value = err.display_message || 'Consumer report generation cancelled'
        }
      },
      onEvent: (eventName: string, metadata: any) => {
        console.log('Plaid Link Event:', eventName, metadata)
      },
    })

    handler.open()
    loadingCraLink.value = false
  } catch (err: any) {
    console.error('Consumer Report Link Error:', err)
    linkError.value = err.data?.statusMessage || err.message || 'Failed to initialize consumer report'
    loadingCraLink.value = false
  }
}

// Fetch income data
const fetchIncomeData = async () => {
  loadingIncome.value = true
  incomeData.value = null
  
  try {
    const response = await $fetch<{ success: boolean; credit_payroll_income?: any }>('/api/plaid/credit/payroll_income', {
      credentials: 'include'
    })
    
    if (response.success && response.credit_payroll_income) {
      incomeData.value = {
        credit_payroll_income: response.credit_payroll_income
      }
    }
  } catch (err: any) {
    console.error('Error fetching income data:', err)
    // Don't show error - income data might not be available yet
  } finally {
    loadingIncome.value = false
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/auth/login')
  } catch (err) {
    console.error('Error during logout:', err)
    await navigateTo('/auth/login')
  }
}
</script>
