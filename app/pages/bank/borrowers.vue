<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/bank"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Borrowers</h1>
              <p class="text-sm text-gray-600 mt-1">Manage and review all borrowers</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Borrowers</p>
              <p class="text-3xl font-bold text-gray-900">{{ borrowers.length }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">With Accounts</p>
              <p class="text-3xl font-bold text-gray-900">{{ connectedCount }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
              <p class="text-3xl font-bold text-gray-900">{{ pendingCount }}</p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Approved</p>
              <p class="text-3xl font-bold text-gray-900">{{ approvedCount }}</p>
            </div>
            <div class="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, or phone..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status"
              v-model="statusFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="connected">With Accounts</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="no_accounts">No Accounts</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="fetchBorrowers"
              :disabled="loading"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!loading" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
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

      <!-- Borrowers Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading && borrowers.length === 0" class="px-6 py-12 text-center">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-gray-600">Loading borrowers...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && filteredBorrowers.length === 0" class="px-6 py-12 text-center">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-600 font-medium">No borrowers found</p>
          <p class="text-sm text-gray-500 mt-1">{{ searchQuery || statusFilter ? 'Try adjusting your filters.' : 'Borrowers will appear here once they register.' }}</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="borrower in filteredBorrowers"
                :key="borrower._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span class="text-indigo-600 font-semibold text-sm">
                        {{ getInitials(borrower.name || `${borrower.firstName || ''} ${borrower.lastName || ''}`.trim()) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ borrower.name || `${borrower.firstName || ''} ${borrower.lastName || ''}`.trim() || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">{{ borrower.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ borrower.phoneNumber || 'N/A' }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ borrower.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="borrower.financial_summary?.has_connected_accounts"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Connected
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    No Accounts
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(borrower.createdAt) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewBorrower(borrower)"
                    class="text-indigo-600 hover:text-indigo-900 transition font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Borrower Details Modal -->
    <div
      v-if="selectedBorrower"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>

        <!-- Center modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <span class="text-indigo-600 font-semibold text-lg">
                    {{ getInitials(selectedBorrower.name || `${selectedBorrower.firstName || ''} ${selectedBorrower.lastName || ''}`.trim()) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-900" id="modal-title">
                    {{ selectedBorrower.name || `${selectedBorrower.firstName || ''} ${selectedBorrower.lastName || ''}`.trim() || 'N/A' }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">{{ selectedBorrower.email }}</p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500 transition"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Borrower Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="text-gray-500">Phone:</span>
                    <span class="ml-2 text-gray-900">{{ selectedBorrower.phoneNumber || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Email:</span>
                    <span class="ml-2 text-gray-900">{{ selectedBorrower.email }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Registered:</span>
                    <span class="ml-2 text-gray-900">{{ formatDate(selectedBorrower.createdAt) }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                <div class="text-sm text-gray-900">
                  <div>{{ selectedBorrower.address?.street || 'N/A' }}</div>
                  <div>
                    {{ selectedBorrower.address?.city || '' }}{{ selectedBorrower.address?.region ? `, ${selectedBorrower.address.region}` : '' }} {{ selectedBorrower.address?.postalCode || '' }}
                  </div>
                  <div>{{ selectedBorrower.address?.country || 'US' }}</div>
                </div>
              </div>
            </div>

            <!-- Financial Overview -->
            <div v-if="selectedBorrower.financial_summary?.has_connected_accounts">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h4>
              
              <!-- Net Worth Highlight -->
              <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
                <p class="text-sm font-medium opacity-90 mb-1">Net Worth</p>
                <p class="text-4xl font-bold">
                  {{ formatCurrency(selectedBorrower.financial_summary?.net_worth || 0, selectedBorrower.financial_summary?.currency || 'USD') }}
                </p>
                <p class="text-xs opacity-75 mt-1">(Assets + Investments) - Liabilities</p>
              </div>

              <!-- Financial Metrics Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Assets</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ formatCurrency(selectedBorrower.financial_summary?.total_assets || 0, selectedBorrower.financial_summary?.currency || 'USD') }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Deposit & investment accounts</p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Investments</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ formatCurrency(selectedBorrower.financial_summary?.total_investments || 0, selectedBorrower.financial_summary?.currency || 'USD') }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Investment holdings value</p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Liabilities</p>
                  <p class="text-2xl font-bold text-red-600">
                    {{ formatCurrency(selectedBorrower.financial_summary?.total_liabilities || 0, selectedBorrower.financial_summary?.currency || 'USD') }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Credit cards, loans, mortgages</p>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Connected Accounts</span>
                  <span class="text-sm font-semibold text-gray-900">
                    {{ selectedBorrower.financial_summary?.account_count || 0 }} account{{ (selectedBorrower.financial_summary?.account_count || 0) !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- No Accounts Connected -->
            <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-600 font-medium">No accounts connected</p>
              <p class="text-sm text-gray-500 mt-1">This borrower has not connected any bank accounts yet.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="closeModal"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition"
            >
              Close
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
  title: 'Borrowers - Bank Dashboard',
  layout: false,
})

const loading = ref(false)
const error = ref('')
const borrowers = ref<any[]>([])
const selectedBorrower = ref<any>(null)
const searchQuery = ref('')
const statusFilter = ref('')

const connectedCount = computed(() => {
  return borrowers.value.filter(b => b.financial_summary?.has_connected_accounts).length
})

const pendingCount = computed(() => {
  return borrowers.value.filter(b => !b.financial_summary?.has_connected_accounts).length
})

const approvedCount = computed(() => {
  return 0
})

const filteredBorrowers = computed(() => {
  let filtered = borrowers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b => {
      const name = (b.name || `${b.firstName || ''} ${b.lastName || ''}`.trim()).toLowerCase()
      const email = (b.email || '').toLowerCase()
      const phone = (b.phoneNumber || '').toLowerCase()
      return name.includes(query) || email.includes(query) || phone.includes(query)
    })
  }

  if (statusFilter.value) {
    if (statusFilter.value === 'connected') {
      filtered = filtered.filter(b => b.financial_summary?.has_connected_accounts)
    } else if (statusFilter.value === 'no_accounts') {
      filtered = filtered.filter(b => !b.financial_summary?.has_connected_accounts)
    }
  }

  return filtered
})


const fetchBorrowers = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{ success: boolean; borrowers?: any[] }>('/api/bank/borrowers')
    if (response.success) {
      borrowers.value = response.borrowers || []
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || 'Failed to load borrowers'
    console.error('Error fetching borrowers:', err)
  } finally {
    loading.value = false
  }
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

const formatDate = (dateString: Date | string | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return 'N/A'
  }
}

const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(amount)
}

const viewBorrower = (borrower: any) => {
  selectedBorrower.value = borrower
}

const closeModal = () => {
  selectedBorrower.value = null
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

onMounted(() => {
  fetchBorrowers()
})
</script>

