<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <BankHeader />

    <!-- Main Content -->
    <div class="pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Search and Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex-1 w-full sm:max-w-md">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="openAddModal"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Borrower
              </button>
              <button
                @click="fetchBorrowers"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <svg v-if="!loading" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refresh
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">Borrowers</h2>
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
          <div v-else-if="!loading && filteredBorrowers.length === 0" class="px-6 py-12 text-center">
            <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-600 font-medium">No borrowers found</p>
            <p class="text-sm text-gray-500 mt-1">{{ searchQuery ? 'Try adjusting your search.' : 'Borrowers will appear here once they register.' }}</p>
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
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-semibold text-sm">
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
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="borrower.financial_summary?.has_connected_accounts"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      Connected
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      Pending
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ formatDate(borrower.createdAt) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-3">
                      <button
                        @click="viewBorrower(borrower)"
                        class="text-indigo-600 hover:text-indigo-900 transition font-medium cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        @click="editBorrower(borrower)"
                        class="text-blue-600 hover:text-blue-900 transition font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDeleteBorrower(borrower)"
                        class="text-red-600 hover:text-red-900 transition font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          @click="closeViewModal"
        ></div>

        <!-- Center modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center flex-shrink-0 mr-4">
                  <span class="text-white font-semibold text-lg">
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
                @click="closeViewModal"
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

            <!-- Divider -->
            <div class="border-t border-gray-200 my-6"></div>

            <!-- Transactions Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-gray-900">Recent Transactions</h4>
                <button
                  v-if="!loadingTransactions && transactions.length > 0"
                  @click="fetchTransactions(selectedBorrower.id || selectedBorrower._id)"
                  class="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <!-- Loading Transactions -->
              <div v-if="loadingTransactions" class="bg-gray-50 rounded-lg p-6 text-center">
                <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Loading transactions...</p>
              </div>

              <!-- Transactions Error -->
              <div v-else-if="transactionsError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-yellow-800">Unable to load transactions</p>
                    <p class="text-sm text-yellow-700 mt-1">{{ transactionsError }}</p>
                  </div>
                </div>
              </div>

              <!-- Transactions List -->
              <div v-else-if="transactions.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="transaction in transactions.slice(0, 20)"
                  :key="transaction.transaction_id"
                  class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <div class="flex-shrink-0">
                          <div
                            :class="[
                              'h-10 w-10 rounded-full flex items-center justify-center',
                              transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                            ]"
                          >
                            <svg
                              :class="[
                                'h-5 w-5',
                                transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                              ]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                v-if="transaction.amount < 0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                              <path
                                v-else
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ transaction.name || transaction.merchant_name || 'Unknown Transaction' }}
                          </p>
                          <div class="flex items-center gap-2 mt-1">
                            <p class="text-xs text-gray-500">
                              {{ formatDate(transaction.date || transaction.authorized_date) }}
                            </p>
                            <span v-if="transaction.category" class="text-xs text-gray-400">•</span>
                            <p v-if="transaction.category" class="text-xs text-gray-500">
                              {{ Array.isArray(transaction.category) ? transaction.category.join(', ') : transaction.category }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex-shrink-0 ml-4 text-right">
                      <p
                        :class="[
                          'text-sm font-semibold',
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        ]"
                      >
                        {{ formatCurrency(Math.abs(transaction.amount), transaction.iso_currency_code || 'USD') }}
                      </p>
                      <p v-if="transaction.pending" class="text-xs text-gray-500 mt-1">Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Transactions -->
              <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
                <svg class="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-gray-600 font-medium">No transactions found</p>
                <p class="text-sm text-gray-500 mt-1">This borrower has no recent transactions.</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="closeViewModal"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Borrower Modal -->
    <AddOrEditBorrower
      :is-open="isModalOpen"
      :borrower="selectedBorrowerForEdit"
      @close="closeModal"
      @created="handleBorrowerCreated"
      @updated="handleBorrowerUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :is-open="isDeleteModalOpen"
      :loading="deletingBorrower"
      title="Delete Borrower"
      :message="`Are you sure you want to delete ${deleteBorrowerData?.firstName} ${deleteBorrowerData?.lastName}? This action cannot be undone.`"
      @close="closeDeleteModal"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BankHeader from '../../components/bank/BankHeader.vue'
import AddOrEditBorrower from '../../components/bank/AddOrEditBorrower.vue'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal.vue'
import { useBorrowersStore } from '../../stores/borrowers'

definePageMeta({
  title: 'Borrowers - Bank Dashboard',
  layout: false,
  middleware: 'bank',
})

// Use Pinia store
const borrowersStore = useBorrowersStore()
const { borrowers, loading, error } = storeToRefs(borrowersStore)

const selectedBorrower = ref<any>(null)
const searchQuery = ref('')
const isModalOpen = ref(false)
const showAddModal = ref(false)
const selectedBorrowerForEdit = ref<any | null>(null)
const isDeleteModalOpen = ref(false)
const deleteBorrowerData = ref<any | null>(null)
const deletingBorrower = ref(false)
const transactions = ref<any[]>([])
const loadingTransactions = ref(false)
const transactionsError = ref('')

const filteredBorrowers = computed(() => {
  let filtered = borrowers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((b: any) => {
      const name = (b.name || `${b.firstName || ''} ${b.lastName || ''}`.trim()).toLowerCase()
      const email = (b.email || '').toLowerCase()
      const phone = (b.phoneNumber || '').toLowerCase()
      return name.includes(query) || email.includes(query) || phone.includes(query)
    })
  }

  return filtered
})

// Fetch borrowers using the store
const fetchBorrowers = async () => {
  await borrowersStore.fetchBorrowers(true) // Force refresh
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

const viewBorrower = async (borrower: any) => {
  selectedBorrower.value = borrower
  transactions.value = []
  transactionsError.value = ''
  
  // Fetch transactions for this borrower
  await fetchTransactions(borrower.id || borrower._id)
}

const fetchTransactions = async (borrowerId: string) => {
  if (!borrowerId) return
  
  loadingTransactions.value = true
  transactionsError.value = ''
  
  try {
    const response = await $fetch<{
      success: boolean
      transactions?: any[]
      count?: number
      message?: string
    }>(`/api/plaid/transactions/transactions?borrower_id=${borrowerId}`)
    
    if (response.success) {
      // Set transactions array (can be empty if no connected account or no transactions)
      transactions.value = Array.isArray(response.transactions) ? response.transactions : []
    }
  } catch (err: any) {
    console.error('Error fetching transactions:', err)
    transactionsError.value = err.data?.statusMessage || err.message || 'Failed to fetch transactions'
  } finally {
    loadingTransactions.value = false
  }
}

const closeViewModal = () => {
  selectedBorrower.value = null
  transactions.value = []
  transactionsError.value = ''
}

const openAddModal = () => {
  selectedBorrowerForEdit.value = null
  isModalOpen.value = true
}

const editBorrower = (borrower: any) => {
  selectedBorrowerForEdit.value = borrower
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedBorrowerForEdit.value = null
}

const handleBorrowerCreated = () => {
  borrowersStore.fetchBorrowers(true) // Force refresh after creation
}

const handleBorrowerUpdated = () => {
  borrowersStore.fetchBorrowers(true) // Force refresh after update
}

const confirmDeleteBorrower = (borrower: any) => {
  deleteBorrowerData.value = borrower
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  if (!deletingBorrower.value) {
    isDeleteModalOpen.value = false
    deleteBorrowerData.value = null
  }
}

const handleDeleteConfirm = async () => {
  if (!deleteBorrowerData.value) return

  deletingBorrower.value = true

  try {
    const response = await $fetch<{ success: boolean; message?: string }>(`/api/bank/borrower/${deleteBorrowerData.value.id || deleteBorrowerData.value._id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      borrowersStore.removeBorrower(deleteBorrowerData.value.id || deleteBorrowerData.value._id)
      isDeleteModalOpen.value = false
      deleteBorrowerData.value = null
      showToast('Borrower deleted successfully', 'success')
    }
  } catch (err: any) {
    console.error('Error deleting borrower:', err)
    showToast(err.data?.statusMessage || err.message || 'Failed to delete borrower', 'error')
  } finally {
    deletingBorrower.value = false
  }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-[10000] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform translate-x-0 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)'
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

watch(() => showAddModal.value, (newValue) => {
  if (newValue) {
    openAddModal()
    showAddModal.value = false
  }
})

onMounted(() => {
  borrowersStore.fetchBorrowers() // Will use cache if available
})
</script>
