<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Navbar -->
    <BankHeader />

    <!-- Main Content -->
    <div class="pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Portfolio Value -->
        <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Portfolio</span>
          </div>
          <p class="text-sm font-medium opacity-90 mb-1">Total Portfolio Value</p>
          <p class="text-3xl font-bold">{{ formatCurrency(totalPortfolioValue) }}</p>
          <p class="text-xs opacity-75 mt-2">{{ borrowersWithAccounts }} borrowers connected</p>
        </div>

        <!-- Total Borrowers -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Total Borrowers</p>
          <p class="text-3xl font-bold text-gray-900">{{ borrowers.length }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ connectedCount }} with accounts</p>
        </div>

        <!-- Average Net Worth -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Avg. Net Worth</p>
          <p class="text-3xl font-bold text-gray-900">{{ averageNetWorth > 0 ? formatCurrency(averageNetWorth) : 'N/A' }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ borrowersWithAccounts > 0 ? `Across ${borrowersWithAccounts} connected` : 'No data yet' }}</p>
        </div>

        <!-- Connected Accounts -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Connected Accounts</p>
          <p class="text-3xl font-bold text-gray-900">{{ totalAccounts }}</p>
          <p class="text-xs text-gray-500 mt-2">Active connections</p>
        </div>
      </div>

      <!-- Charts and Insights Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Portfolio Distribution -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900">Portfolio Overview</h3>
            <button
              @click="fetchBorrowers"
              :disabled="loading"
              class="p-2 text-gray-400 hover:text-gray-600 transition"
            >
              <svg v-if="!loading" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          <div v-if="totalAssets > 0 || totalLiabilities > 0" class="space-y-4">
            <!-- Assets vs Liabilities -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600">Total Assets</span>
                <span class="text-sm font-bold text-gray-900">{{ formatCurrency(totalAssets) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all" 
                  :style="{ width: `${Math.min(100, (totalAssets / (totalAssets + totalLiabilities || 1)) * 100)}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600">Total Liabilities</span>
                <span class="text-sm font-bold text-gray-900">{{ formatCurrency(totalLiabilities) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all" 
                  :style="{ width: `${Math.min(100, (totalLiabilities / (totalAssets + totalLiabilities || 1)) * 100)}%` }"
                ></div>
              </div>
            </div>
            <div class="pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Net Worth</span>
                <span class="text-lg font-bold text-indigo-600">{{ formatCurrency(totalAssets - totalLiabilities) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-sm text-gray-500">Financial data will appear here once borrowers connect their accounts</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
          <div class="space-y-5">
            <div v-if="totalAssets > 0 || totalLiabilities > 0" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Risk Level</p>
                  <p class="text-sm font-semibold text-gray-900">{{ riskLevel }}</p>
                </div>
              </div>
            </div>
            <div v-if="borrowersWithAccounts > 0" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Connected</p>
                  <p class="text-sm font-semibold text-gray-900">{{ borrowersWithAccounts }} of {{ borrowers.length }}</p>
                </div>
              </div>
            </div>
            <div class="pt-4 border-t border-gray-200">
              <NuxtLink
                to="/bank/borrowers"
                class="block w-full px-4 py-2.5 text-sm font-medium text-center text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
              >
                View All Borrowers →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Borrowers with Financial Insights -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Recent Borrowers</h3>
            <NuxtLink
              to="/bank/borrowers"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </NuxtLink>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && borrowers.length === 0" class="px-6 py-12 text-center">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-gray-600">Loading borrowers...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && borrowers.length === 0" class="px-6 py-12 text-center">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-600 font-medium">No borrowers found</p>
          <p class="text-sm text-gray-500 mt-1">Borrowers will appear here once they register and connect accounts.</p>
        </div>

        <!-- Borrowers List -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="borrower in displayedBorrowers"
            :key="borrower._id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewBorrower(borrower)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white font-semibold text-sm">
                    {{ getInitials(borrower.name || `${borrower.firstName || ''} ${borrower.lastName || ''}`.trim()) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h4 class="text-sm font-bold text-gray-900 truncate">
                      {{ borrower.name || `${borrower.firstName || ''} ${borrower.lastName || ''}`.trim() || 'N/A' }}
                    </h4>
                    <span
                      v-if="borrower.financial_summary?.has_connected_accounts"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      Connected
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      Pending
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ borrower.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-6 ml-4">
                <div class="text-right">
                  <p class="text-xs text-gray-500 mb-0.5">Net Worth</p>
                  <p class="text-sm font-bold text-gray-900">
                    {{ formatCurrency(getBorrowerNetWorth(borrower)) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500 mb-0.5">Accounts</p>
                  <p class="text-sm font-semibold text-gray-700">
                    {{ borrower.financial_summary?.account_count || 0 }}
                  </p>
                </div>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BankHeader from '../../components/bank/BankHeader.vue'
import { useBorrowersStore } from '../../stores/borrowers'

definePageMeta({
  title: 'Bank Dashboard',
  layout: false,
  middleware: 'bank',
})

// Use Pinia store
const borrowersStore = useBorrowersStore()
const { borrowers, loading, error } = storeToRefs(borrowersStore)

// Use store getters for computed metrics
const borrowersWithAccounts = computed(() => borrowersStore.connectedCount) // Use count, not array
const connectedCount = computed(() => borrowersStore.connectedCount)
const totalPortfolioValue = computed(() => borrowersStore.totalPortfolioValue)
const averageNetWorth = computed(() => borrowersStore.averageNetWorth)
const totalAssets = computed(() => borrowersStore.totalAssets)
const totalLiabilities = computed(() => borrowersStore.totalLiabilities)
const totalAccounts = computed(() => borrowersStore.totalAccounts)
const riskLevel = computed(() => borrowersStore.riskLevel)

const displayedBorrowers = computed(() => {
  return borrowers.value.slice(0, 5)
})

// Helper function for calculating net worth (used in template)
const getBorrowerNetWorth = (borrower: any): number => {
  if (!borrower.financial_summary) return 0
  const assets = (borrower.financial_summary.total_assets || 0) + (borrower.financial_summary.total_investments || 0)
  const liabilities = borrower.financial_summary.total_liabilities || 0
  return Math.max(0, assets - liabilities)
}

// Fetch borrowers using the store
const fetchBorrowers = async () => {
  await borrowersStore.fetchBorrowers(true) // Force refresh
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

const getInitials = (name: string): string => {
  if (!name || name.trim() === '') return '?'
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || '?'
    const last = parts[parts.length - 1]?.[0] || '?'
    return `${first}${last}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const viewBorrower = (borrower: any) => {
  navigateTo(`/bank/borrowers`)
}

onMounted(() => {
  borrowersStore.fetchBorrowers() // Will use cache if available
})
</script>
