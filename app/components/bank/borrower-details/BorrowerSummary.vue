<template>
  <div class="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 mb-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4 flex-1">
        <div class="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
          {{ getInitials(fullName) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ fullName || 'N/A' }}</h1>
          <p class="text-sm text-gray-600">{{ borrower.email }}</p>
        </div>
      </div>
      <div class="flex flex-col items-start sm:items-end space-y-1">
        <p class="text-xs uppercase tracking-wide text-gray-500">Estimated Net Worth</p>
        <div v-if="hasAssetReportForNetWorth">
          <p class="text-lg font-semibold text-indigo-600">
            {{ formatCurrency(netWorth) }}
          </p>
        </div>
        <div v-else class="text-right">
          <p class="text-sm text-gray-500 italic">
            Generate asset report to get the estimated net worth
          </p>
        </div>
      </div>
    </div>

    <!-- Info + Financial summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <!-- Contact / Meta -->
      <div class="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-4 lg:col-span-1">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Borrower Info</h2>
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-gray-500">First name</dt>
            <dd class="text-gray-900 font-medium">{{ borrower.firstName || 'N/A' }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Last name</dt>
            <dd class="text-gray-900 font-medium">{{ borrower.lastName || 'N/A' }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Role</dt>
            <dd class="text-gray-900 font-medium capitalize">{{ borrower.role || 'borrower' }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Created</dt>
            <dd class="text-gray-900">{{ formatDate(borrower.createdAt) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Connected accounts</dt>
            <dd class="text-gray-900">
              {{ accountsCount || borrower.financial_summary?.account_count || 0 }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Financial overview -->
      <div class="lg:col-span-2">
        <div class="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Financial Overview</h2>

          <div v-if="hasAssetReportForNetWorth" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-4">
                <p class="text-xs font-medium uppercase opacity-80 mb-1">Estimated Net Worth</p>
                <p class="text-2xl font-bold">{{ formatCurrency(netWorth) }}</p>
              </div>
              <div class="bg-white rounded-xl p-4 border border-gray-100">
                <p class="text-xs font-medium text-gray-500 uppercase mb-1">Total Assets</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ formatCurrency(totalAssetsFromAssetReport) }}
                </p>
              </div>
              <div class="bg-white rounded-xl p-4 border border-gray-100">
                <p class="text-xs font-medium text-gray-500 uppercase mb-1">Total Liabilities</p>
                <p class="text-xl font-semibold text-red-600">
                  {{ formatCurrency(totalLiabilitiesFromLiabilities) }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <svg class="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-700 font-medium mb-1">Generate asset report to get the estimated net worth</p>
            <p class="text-sm text-gray-600 mt-1">An asset report provides a comprehensive view of assets and liabilities for accurate net worth calculation.</p>
            <button
              :disabled="creatingAssetReport || loadingAssets"
              @click="$emit('create-asset-report')"
              class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center gap-2"
            >
              <svg v-if="!creatingAssetReport" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ creatingAssetReport ? 'Generating...' : 'Generate Asset Report' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBorrowerDetailsUtils } from '~/composables/useBorrowerDetails'

const props = defineProps<{
  borrower: any
  accountsCount?: number
  assetReport?: any | null
  liabilities?: any | null
  creatingAssetReport?: boolean
  loadingAssets?: boolean
}>()

defineEmits<{
  (e: 'create-asset-report'): void
}>()

const { formatCurrency, formatDate, getInitials } = useBorrowerDetailsUtils()

const fullName = computed(() => {
  if (!props.borrower) return ''
  return `${props.borrower.firstName || ''} ${props.borrower.lastName || ''}`.trim()
})

const totalAssetsFromAssetReport = computed(() => {
  if (!props.assetReport?.report?.items) return 0
  
  let total = 0
  props.assetReport.report.items.forEach((item: any) => {
    if (Array.isArray(item.accounts)) {
      item.accounts.forEach((acc: any) => {
        const balance = acc.balances?.current
        if (typeof balance === 'number') {
          total += balance
        }
      })
    }
  })
  return total
})

const totalLiabilitiesFromLiabilities = computed(() => {
  if (!props.liabilities) return 0
  
  let total = 0
  
  if (Array.isArray(props.liabilities.accounts)) {
    props.liabilities.accounts.forEach((acc: any) => {
      if (acc.type === 'credit' || acc.type === 'loan') {
        const balance = acc.balances?.current
        if (typeof balance === 'number' && balance !== null) {
          total += Math.abs(balance)
        }
      }
    })
  }
  
  if (props.liabilities.liabilities) {
    if (Array.isArray(props.liabilities.liabilities.credit)) {
      props.liabilities.liabilities.credit.forEach((credit: any) => {
        const account = props.liabilities.accounts?.find((acc: any) => acc.account_id === credit.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        } else if (credit.last_statement_balance) {
          total += credit.last_statement_balance
        }
      })
    }
    
    if (Array.isArray(props.liabilities.liabilities.mortgage)) {
      props.liabilities.liabilities.mortgage.forEach((mortgage: any) => {
        const account = props.liabilities.accounts?.find((acc: any) => acc.account_id === mortgage.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        }
      })
    }
    
    if (Array.isArray(props.liabilities.liabilities.student)) {
      props.liabilities.liabilities.student.forEach((student: any) => {
        const account = props.liabilities.accounts?.find((acc: any) => acc.account_id === student.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        }
      })
    }
  }
  
  return total
})

const hasAssetReportForNetWorth = computed(() => {
  return !!(props.assetReport?.report?.items && props.assetReport.report.items.length > 0)
})

const netWorth = computed(() => {
  if (!hasAssetReportForNetWorth.value) return 0
  
  const assets = totalAssetsFromAssetReport.value
  const liabilities = totalLiabilitiesFromLiabilities.value
  return assets - liabilities
})
</script>

