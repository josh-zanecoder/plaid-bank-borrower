<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
    <!-- Back button -->
    <button
      type="button"
      class="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
      @click="$emit('close')"
    >
      <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Borrowers
    </button>

    <div v-if="!borrower" class="text-center py-8">
      <p class="text-gray-700 font-medium">Borrower not found.</p>
      <p class="text-sm text-gray-500 mt-1">They may have been removed or the data is unavailable.</p>
    </div>

    <div v-else class="space-y-6">
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
                {{ accounts.length || borrower.financial_summary?.account_count || 0 }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Financial overview + accounts + assets + liabilities + transactions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Financial overview -->
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
                @click="createAssetReportForBorrower()"
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

          <!-- Accounts Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Connected Accounts</h2>
              <button
                v-if="!loadingAccounts && accounts.length > 0"
                @click="fetchAccounts()"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div v-if="loadingAccounts" class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-600">Loading accounts...</p>
            </div>

            <div v-else-if="accountsError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-yellow-800">Unable to load accounts</p>
                  <p class="text-sm text-yellow-700 mt-1">{{ accountsError }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="accounts.length > 0" class="space-y-3 max-h-72 overflow-y-auto">
              <div
                v-for="account in accounts"
                :key="account.account_id"
                class="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ account.name || 'Account' }} <span v-if="account.mask" class="text-gray-400">••{{ account.mask }}</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ account.official_name || account.subtype || account.type || 'Bank account' }}
                  </p>
                </div>
                <div class="ml-4 text-right">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ formatCurrency(account.balances?.current || account.balances?.available || 0, account.balances?.iso_currency_code || 'USD') }}
                  </p>
                  <p v-if="account.balances?.available != null" class="text-xs text-gray-500 mt-1">
                    Available: {{ formatCurrency(account.balances.available, account.balances?.iso_currency_code || 'USD') }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
              <p class="text-gray-600 font-medium">No accounts found</p>
              <p class="text-sm text-gray-500 mt-1">This borrower has no connected accounts.</p>
            </div>
          </div>

          <!-- Assets (Asset Report) Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Assets</h2>
              <div class="flex items-center gap-2">
                <button
                  v-if="assetReport"
                  :disabled="loadingAssets"
                  @click="refreshAssetReport()"
                  class="text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer flex items-center gap-1"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  :disabled="creatingAssetReport || loadingAssets"
                  @click="createAssetReportForBorrower()"
                  class="text-xs px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                >
                  <span v-if="!creatingAssetReport">Generate Asset Report</span>
                  <span v-else>Generating...</span>
                </button>
              </div>
            </div>

            <div v-if="loadingAssets" class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-600">
                {{ creatingAssetReport ? 'Creating asset report...' : 'Loading asset report...' }}
              </p>
            </div>

            <div v-else-if="assetsError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-yellow-800">Unable to load asset report</p>
                  <p class="text-sm text-yellow-700 mt-1">{{ assetsError }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="assetReport && assetReport.report?.items?.length">
              <div
                v-for="(item, idx) in assetReport.report.items"
                :key="idx"
                class="space-y-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ item.institution_name || 'Asset Report' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Generated {{ formatDate(assetReport.report.date_generated) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Accounts</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ item.accounts?.length || 0 }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div
                    v-for="acc in item.accounts || []"
                    :key="acc.account_id"
                    class="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ acc.name || acc.official_name || 'Account' }}
                        <span v-if="acc.mask" class="text-gray-400">••{{ acc.mask }}</span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ acc.type }} <span v-if="acc.subtype">• {{ acc.subtype }}</span>
                      </p>
                    </div>
                    <div class="ml-4 text-right">
                      <p class="text-xs text-gray-500">Current</p>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ formatCurrency(acc.balances?.current || 0, acc.balances?.iso_currency_code || 'USD') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
              <p class="text-gray-600 font-medium">No asset report yet</p>
              <p class="text-sm text-gray-500 mt-1">
                Generate an asset report to see a consolidated view of this borrower's assets.
              </p>
            </div>
          </div>

          <!-- Liabilities Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Liabilities</h2>
              <button
                v-if="!loadingLiabilities"
                @click="fetchLiabilities()"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div v-if="loadingLiabilities" class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-600">Loading liabilities...</p>
            </div>

            <div v-else-if="liabilitiesError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-yellow-800">Unable to load liabilities</p>
                  <p class="text-sm text-yellow-700 mt-1">{{ liabilitiesError }}</p>
                </div>
              </div>
            </div>

            <div
              v-else-if="
                liabilities &&
                (Array.isArray(liabilities.liabilities?.credit) && liabilities.liabilities.credit.length > 0 ||
                 Array.isArray(liabilities.liabilities?.mortgage) && liabilities.liabilities.mortgage.length > 0 ||
                 Array.isArray(liabilities.liabilities?.student) && liabilities.liabilities.student.length > 0)
              "
              class="space-y-4"
            >
              <!-- Credit cards -->
              <div v-if="Array.isArray(liabilities.liabilities?.credit) && liabilities.liabilities.credit.length > 0">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Credit Cards</h3>
                <div class="space-y-3">
                  <div
                    v-for="credit in liabilities.liabilities.credit"
                    :key="credit.account_id"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ getAccountName(credit.account_id) || 'Credit Account' }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Last payment
                        <span class="font-medium text-gray-900">
                          {{ formatCurrency(credit.last_payment_amount || 0) }}
                        </span>
                        on
                        <span class="font-medium text-gray-900">
                          {{ formatDate(credit.last_payment_date) }}
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Min payment:
                        <span class="font-medium text-gray-900">
                          {{ formatCurrency(credit.minimum_payment_amount || 0) }}
                        </span>
                        • Next due:
                        <span class="font-medium text-gray-900">
                          {{ formatDate(credit.next_payment_due_date) }}
                        </span>
                      </p>
                      <p
                        v-if="Array.isArray(credit.aprs)"
                        class="text-xs text-gray-500 mt-1"
                      >
                        APRs:
                        <span
                          v-for="(apr, idx) in credit.aprs"
                          :key="idx"
                          class="inline-block mr-1"
                        >
                          <span class="font-medium text-gray-900">{{ (apr.apr_percentage || 0).toFixed(2) }}%</span>
                          <span class="text-gray-400">({{ apr.apr_type }})</span>
                          <span v-if="idx < credit.aprs.length - 1">,</span>
                        </span>
                      </p>
                    </div>
                    <div class="text-right sm:text-right">
                      <p class="text-xs text-gray-500">Last statement balance</p>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ formatCurrency(credit.last_statement_balance || 0) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Overdue:
                        <span
                          :class="credit.is_overdue ? 'text-red-600 font-semibold' : 'text-gray-900 font-medium'"
                        >
                          {{ credit.is_overdue ? 'Yes' : 'No' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mortgage -->
              <div v-if="Array.isArray(liabilities.liabilities?.mortgage) && liabilities.liabilities.mortgage.length > 0">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2 mb-2">Mortgages</h3>
                <div class="space-y-3">
                  <div
                    v-for="mort in liabilities.liabilities.mortgage"
                    :key="mort.account_id"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ getAccountName(mort.account_id) || 'Mortgage' }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Property:
                        <span class="font-medium text-gray-900">
                          {{ mort.property_address?.street }},
                          {{ mort.property_address?.city }},
                          {{ mort.property_address?.region }}
                          {{ mort.property_address?.postal_code }}
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Rate:
                        <span class="font-medium text-gray-900">
                          {{ mort.interest_rate?.percentage }}% {{ mort.interest_rate?.type }}
                        </span>
                        • Term:
                        <span class="font-medium text-gray-900">
                          {{ mort.loan_term }}
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Next payment:
                        <span class="font-medium text-gray-900">
                          {{ formatCurrency(mort.next_monthly_payment || 0) }}
                        </span>
                        on
                        <span class="font-medium text-gray-900">
                          {{ formatDate(mort.next_payment_due_date) }}
                        </span>
                      </p>
                    </div>
                    <div class="text-right sm:text-right">
                      <p class="text-xs text-gray-500">Origination principal</p>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ formatCurrency(mort.origination_principal_amount || 0) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Past due:
                        <span class="font-medium text-red-600">
                          {{ formatCurrency(mort.past_due_amount || 0) }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Student loans -->
              <div v-if="Array.isArray(liabilities.liabilities?.student) && liabilities.liabilities.student.length > 0">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2 mb-2">Student Loans</h3>
                <div class="space-y-3">
                  <div
                    v-for="stud in liabilities.liabilities.student"
                    :key="stud.account_id"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ getAccountName(stud.account_id) || stud.loan_name || 'Student Loan' }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Status:
                        <span class="font-medium text-gray-900">
                          {{ stud.loan_status?.type }}
                        </span>
                        • Rate:
                        <span class="font-medium text-gray-900">
                          {{ (stud.interest_rate_percentage || 0).toFixed(2) }}%
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Next payment:
                        <span class="font-medium text-gray-900">
                          {{ formatCurrency(stud.minimum_payment_amount || 0) }}
                        </span>
                        on
                        <span class="font-medium text-gray-900">
                          {{ formatDate(stud.next_payment_due_date) }}
                        </span>
                      </p>
                    </div>
                    <div class="text-right sm:text-right">
                      <p class="text-xs text-gray-500">Origination principal</p>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ formatCurrency(stud.origination_principal_amount || 0) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Outstanding interest:
                        <span class="font-medium text-gray-900">
                          {{ formatCurrency(stud.outstanding_interest_amount || 0) }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-gray-50 rounded-lg p-6 text-center"
            >
              <p class="text-gray-600 font-medium">No liabilities found</p>
              <p class="text-sm text-gray-500 mt-1">
                This borrower has no reported credit, mortgage, or student loan liabilities.
              </p>
            </div>
          </div>

          <!-- Payroll Income Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Payroll Income</h2>
              <button
                v-if="!loadingPayrollIncome"
                @click="fetchPayrollIncome()"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div v-if="loadingPayrollIncome" class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-600">Loading payroll income...</p>
            </div>

            <div v-else-if="payrollIncomeError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg class="h-12 w-12 text-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-yellow-800 font-medium">Payroll Income Not Available</p>
              <p class="text-sm text-yellow-700 mt-1">
                {{ payrollIncomeError }}
              </p>
            </div>

            <div
              v-else-if="payrollIncome && payrollIncome.items && Array.isArray(payrollIncome.items) && payrollIncome.items.length > 0"
              class="space-y-4"
            >
              <div
                v-for="(item, itemIndex) in payrollIncome.items"
                :key="itemIndex"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4"
              >
                <div v-if="item.institution_name" class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900">{{ item.institution_name }}</h3>
                  <span
                    v-if="item.status"
                    :class="{
                      'px-2 py-1 rounded text-xs font-medium': true,
                      'bg-green-100 text-green-800': item.status.processing_status === 'PROCESSING_COMPLETE',
                      'bg-yellow-100 text-yellow-800': item.status.processing_status === 'PROCESSING',
                      'bg-red-100 text-red-800': item.status.processing_status === 'FAILED',
                    }"
                  >
                    {{ item.status.processing_status }}
                  </span>
                </div>

                <!-- Payroll Income Items -->
                <div
                  v-if="item.payroll_income && Array.isArray(item.payroll_income) && item.payroll_income.length > 0"
                  class="space-y-3"
                >
                  <div
                    v-for="(payroll, payrollIndex) in item.payroll_income"
                    :key="payrollIndex"
                    class="bg-white rounded-lg p-4 border border-gray-100"
                  >
                    <!-- Summary -->
                    <div v-if="payroll.pay_stubs && payroll.pay_stubs.length > 0" class="mb-4">
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p class="text-xs text-gray-500 mb-1">Latest Pay Period</p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ formatDate(payroll.pay_stubs[0]?.pay_period_details?.start_date) }} - {{ formatDate(payroll.pay_stubs[0]?.pay_period_details?.end_date) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 mb-1">Gross Earnings</p>
                          <p class="text-sm font-semibold text-green-700">
                            {{ formatCurrency(payroll.pay_stubs[0]?.pay_period_details?.gross_earnings || 0) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 mb-1">Net Pay</p>
                          <p class="text-sm font-semibold text-blue-700">
                            {{ formatCurrency(payroll.pay_stubs[0]?.pay_period_details?.pay_amount || 0) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 mb-1">YTD Net</p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ formatCurrency(payroll.pay_stubs[0]?.net_pay?.ytd_amount || 0) }}
                          </p>
                        </div>
                      </div>
                      <div class="mt-3 pt-3 border-t border-gray-200">
                        <p class="text-xs text-gray-500">
                          Pay Stubs: {{ payroll.pay_stubs.length }} | 
                          Employer: {{ payroll.pay_stubs[0]?.employer?.name || 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
              <p class="text-gray-600 font-medium">No payroll income found</p>
              <p class="text-sm text-gray-500 mt-1">
                This borrower has not completed income verification or payroll data is not available yet.
              </p>
            </div>
          </div>

          <!-- CRA Base Report Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Consumer Report (CRA)</h2>
              <button
                v-if="!loadingCraReport"
                @click="fetchCraReport()"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div v-if="loadingCraReport" class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-600">Loading consumer report...</p>
            </div>

            <div v-else-if="craReportError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg class="h-12 w-12 text-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-yellow-800 font-medium">Consumer Report Not Available</p>
              <p class="text-sm text-yellow-700 mt-1">
                {{ craReportError }}
              </p>
            </div>

            <div v-else-if="craReport && craReport.report" class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Report Details</h3>
                  <span
                    v-if="craReport.report.status"
                    :class="{
                      'px-2 py-1 rounded text-xs font-medium': true,
                      'bg-green-100 text-green-800': craReport.report.status === 'COMPLETE',
                      'bg-yellow-100 text-yellow-800': craReport.report.status === 'PROCESSING',
                      'bg-red-100 text-red-800': craReport.report.status === 'FAILED',
                    }"
                  >
                    {{ craReport.report.status }}
                  </span>
                </div>

                <div v-if="craReport.report.request_id" class="mb-3">
                  <p class="text-xs text-gray-500">Request ID</p>
                  <p class="text-sm font-medium text-gray-900">{{ craReport.report.request_id }}</p>
                </div>

                <div v-if="craReport.report.date_generated" class="mb-3">
                  <p class="text-xs text-gray-500">Generated Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(craReport.report.date_generated) }}</p>
                </div>

                <div v-if="craReport.report.days_requested" class="mb-3">
                  <p class="text-xs text-gray-500">Days Requested</p>
                  <p class="text-sm font-medium text-gray-900">{{ craReport.report.days_requested }}</p>
                </div>

                <!-- Report Items -->
                <div v-if="craReport.report.items && Array.isArray(craReport.report.items) && craReport.report.items.length > 0" class="mt-4 space-y-3">
                  <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Report Items</h4>
                  <div
                    v-for="(item, idx) in craReport.report.items"
                    :key="idx"
                    class="bg-white rounded-lg p-3 border border-gray-100"
                  >
                    <p v-if="item.institution_id" class="text-xs text-gray-500">Institution ID</p>
                    <p v-if="item.institution_id" class="text-sm font-medium text-gray-900 mb-2">{{ item.institution_id }}</p>
                    <p v-if="item.institution_name" class="text-xs text-gray-500">Institution Name</p>
                    <p v-if="item.institution_name" class="text-sm font-medium text-gray-900">{{ item.institution_name }}</p>
                  </div>
                </div>

                <!-- PDF Download -->
                <div v-if="craReport.pdf" class="mt-4 pt-4 border-t border-gray-200">
                  <a
                    :href="`data:application/pdf;base64,${craReport.pdf}`"
                    download="cra-base-report.pdf"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Report
                  </a>
                </div>
              </div>
            </div>

            <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg class="h-12 w-12 text-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-yellow-800 font-medium">Consumer Report Not Available</p>
              <p class="text-sm text-yellow-700 mt-1">
                This borrower needs to share their consumer report. Please ask them to complete the consumer report setup in their borrower portal.
              </p>
            </div>
          </div>

          <!-- Transactions Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Transactions</h2>
              <button
                v-if="!loadingTransactions && transactions.length > 0"
                @click="fetchTransactions()"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1"
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
            <div v-else-if="transactions.length > 0" class="space-y-3 max-h-80 overflow-y-auto">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  borrower: any | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

const transactions = ref<any[]>([])
const loadingTransactions = ref(false)
const transactionsError = ref('')

const accounts = ref<any[]>([])
const loadingAccounts = ref(false)
const accountsError = ref('')

const assetReport = ref<any | null>(null)
const lastAssetReportToken = ref<string | null>(null)
const loadingAssets = ref(false)
const creatingAssetReport = ref(false)
const assetsError = ref('')
const assetPollAttempts = ref(0)

const liabilities = ref<any | null>(null)
const loadingLiabilities = ref(false)
const liabilitiesError = ref('')

const payrollIncome = ref<any | null>(null)
const loadingPayrollIncome = ref(false)
const payrollIncomeError = ref('')

const craReport = ref<any | null>(null)
const loadingCraReport = ref(false)
const craReportError = ref('')

const fullName = computed(() => {
  if (!props.borrower) return ''
  return `${props.borrower.firstName || ''} ${props.borrower.lastName || ''}`.trim()
})

const hasFinancialData = computed(() => {
  const fs = props.borrower?.financial_summary
  const hasAssetReport = assetReport.value?.report?.items?.length > 0
  const hasLiabilitiesData = liabilities.value && (
    (Array.isArray(liabilities.value.liabilities?.credit) && liabilities.value.liabilities.credit.length > 0) ||
    (Array.isArray(liabilities.value.liabilities?.mortgage) && liabilities.value.liabilities.mortgage.length > 0) ||
    (Array.isArray(liabilities.value.liabilities?.student) && liabilities.value.liabilities.student.length > 0) ||
    (Array.isArray(liabilities.value.accounts) && liabilities.value.accounts.length > 0)
  )
  
  if (hasAssetReport || hasLiabilitiesData) return true
  if (!fs) return false
  return !!(fs.total_assets || fs.total_investments || fs.total_liabilities)
})

const totalAssetsFromAccounts = computed(() => {
  if (!accounts.value || accounts.value.length === 0) return 0
  
  let total = 0
  accounts.value.forEach((acc: any) => {
    if (acc.type === 'depository' || acc.type === 'investment') {
      const balance = acc.balances?.current || acc.balances?.available
      if (typeof balance === 'number' && balance > 0) {
        total += balance
      }
    }
  })
  return total
})

const totalAssetsFromAssetReport = computed(() => {
  if (!assetReport.value?.report?.items) return 0
  
  let total = 0
  assetReport.value.report.items.forEach((item: any) => {
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
  if (!liabilities.value) return 0
  
  let total = 0
  
  if (Array.isArray(liabilities.value.accounts)) {
    liabilities.value.accounts.forEach((acc: any) => {
      if (acc.type === 'credit' || acc.type === 'loan') {
        const balance = acc.balances?.current
        if (typeof balance === 'number' && balance !== null) {
          total += Math.abs(balance)
        }
      }
    })
  }
  
  if (liabilities.value.liabilities) {
    if (Array.isArray(liabilities.value.liabilities.credit)) {
      liabilities.value.liabilities.credit.forEach((credit: any) => {
        const account = liabilities.value.accounts?.find((acc: any) => acc.account_id === credit.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        } else if (credit.last_statement_balance) {
          total += credit.last_statement_balance
        }
      })
    }
    
    if (Array.isArray(liabilities.value.liabilities.mortgage)) {
      liabilities.value.liabilities.mortgage.forEach((mortgage: any) => {
        const account = liabilities.value.accounts?.find((acc: any) => acc.account_id === mortgage.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        }
      })
    }
    
    if (Array.isArray(liabilities.value.liabilities.student)) {
      liabilities.value.liabilities.student.forEach((student: any) => {
        const account = liabilities.value.accounts?.find((acc: any) => acc.account_id === student.account_id)
        if (account?.balances?.current) {
          total += Math.abs(account.balances.current)
        }
      })
    }
  }
  
  return total
})

const totalAssets = computed(() => {
  if (totalAssetsFromAssetReport.value > 0) {
    return totalAssetsFromAssetReport.value
  }
  
  if (totalAssetsFromAccounts.value > 0) {
    return totalAssetsFromAccounts.value
  }
  
  const fs = props.borrower?.financial_summary
  if (!fs) return 0
  return (fs.total_assets || 0) + (fs.total_investments || 0)
})

const totalLiabilities = computed(() => {
  if (totalLiabilitiesFromLiabilities.value > 0) {
    return totalLiabilitiesFromLiabilities.value
  }
  
  const fs = props.borrower?.financial_summary
  if (!fs) return 0
  return fs.total_liabilities || 0
})

const hasAssetReportForNetWorth = computed(() => {
  return !!(assetReport.value?.report?.items && assetReport.value.report.items.length > 0)
})

const netWorth = computed(() => {
  if (!hasAssetReportForNetWorth.value) return 0
  
  const assets = totalAssetsFromAssetReport.value
  const liabilities = totalLiabilitiesFromLiabilities.value
  return assets - liabilities
})

const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(amount || 0)
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

const getAccountName = (accountId: string | undefined): string | null => {
  if (!accountId) return null
  const account = accounts.value.find(acc => acc.account_id === accountId)
  if (!account) return null
  return account.name || account.official_name || `${account.subtype || account.type || ''}`.trim() || null
}

const fetchTransactions = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  loadingTransactions.value = true
  transactionsError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      transactions?: any[]
      count?: number
      message?: string
    }>(`/api/plaid/transactions/transactions?borrower_id=${borrowerId}`)

    if (response.success) {
      transactions.value = Array.isArray(response.transactions) ? response.transactions : []
    }
  } catch (err: any) {
    console.error('Error fetching transactions:', err)
    transactionsError.value = err.data?.statusMessage || err.message || 'Failed to fetch transactions'
  } finally {
    loadingTransactions.value = false
  }
}

const fetchAccounts = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  loadingAccounts.value = true
  accountsError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      accounts?: any[]
      message?: string
    }>(`/api/plaid/accounts/accounts?borrower_id=${borrowerId}`)

    if (response.success) {
      accounts.value = Array.isArray(response.accounts) ? response.accounts : []
    }
  } catch (err: any) {
    console.error('Error fetching accounts:', err)
    accountsError.value = err.data?.statusMessage || err.message || 'Failed to fetch accounts'
  } finally {
    loadingAccounts.value = false
  }
}

const createAssetReportForBorrower = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  creatingAssetReport.value = true
  assetsError.value = ''
  assetPollAttempts.value = 0

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      asset_report_token?: string
      asset_report_id?: string
      message?: string
      status?: string
    }>('/api/plaid/assets/create_asset_report', {
      method: 'POST',
      body: {
        borrower_id: borrowerId,
      },
    })

    if (response.success && response.asset_report_token) {
      lastAssetReportToken.value = response.asset_report_token
      await fetchAssetReport(response.asset_report_token)
    } else if (!response.success && response.message) {
      assetsError.value = response.message
    }
  } catch (err: any) {
    console.error('Error creating asset report:', err)
    assetsError.value = err.data?.statusMessage || err.message || 'Failed to create asset report'
  } finally {
    creatingAssetReport.value = false
  }
}

const fetchAssetReport = async (token?: string) => {
  if (!props.borrower?._id && !props.borrower?.id) return

  const tokenToUse = token || lastAssetReportToken.value
  if (!tokenToUse) return

  loadingAssets.value = true
  assetsError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      report?: any
      request_id?: string
      status?: string
      message?: string
    }>(`/api/plaid/assets/get_assets_report?borrower_id=${borrowerId}&asset_report_token=${encodeURIComponent(tokenToUse)}`)

    if (response.success && response.report) {
      assetReport.value = response
      assetPollAttempts.value = 0
    } else if (response.status === 'creating') {
      assetReport.value = null
      assetsError.value =
        response.message || 'Asset report is still being generated. We will refresh it shortly.'

      if (assetPollAttempts.value < 20) {
        assetPollAttempts.value += 1
        setTimeout(() => {
          // Re-use the same token and keep polling until ready or attempts exhausted
          fetchAssetReport(tokenToUse)
        }, 1500)
      }
    }
  } catch (err: any) {
    console.error('Error fetching asset report:', err)
    assetsError.value = err.data?.statusMessage || err.message || 'Failed to fetch asset report'
  } finally {
    loadingAssets.value = false
  }
}

const refreshAssetReport = async () => {
  await fetchAssetReport()
}

const fetchLiabilities = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  loadingLiabilities.value = true
  liabilitiesError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      accounts?: any[]
      liabilities?: any
      message?: string
    }>(`/api/plaid/liabilities/liabilities?borrower_id=${borrowerId}`)

    if (response.success) {
      liabilities.value = response
    }
  } catch (err: any) {
    console.error('Error fetching liabilities:', err)
    liabilitiesError.value = err.data?.statusMessage || err.message || 'Failed to fetch liabilities'
  } finally {
    loadingLiabilities.value = false
  }
}

const fetchPayrollIncome = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  loadingPayrollIncome.value = true
  payrollIncomeError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      credit_payroll_income?: any
      message?: string
    }>(`/api/plaid/credit/payroll_income?borrower_id=${borrowerId}`)

    if (response.success) {
      if (response.credit_payroll_income && response.credit_payroll_income.items && Array.isArray(response.credit_payroll_income.items) && response.credit_payroll_income.items.length > 0) {
        payrollIncome.value = response.credit_payroll_income
        payrollIncomeError.value = ''
      } else {
        // No payroll income data available - check if there's a specific message
        payrollIncome.value = null
        if (response.message && (response.message.toLowerCase().includes('not completed') || response.message.toLowerCase().includes('has not completed'))) {
          payrollIncomeError.value = 'This borrower needs to verify their income. Please ask them to complete income verification in their borrower portal.'
        } else {
          payrollIncomeError.value = 'This borrower needs to verify their income. Please ask them to complete income verification in their borrower portal.'
        }
      }
    }
  } catch (err: any) {
    console.error('Error fetching payroll income:', err)
    const errorMessage = err.data?.statusMessage || err.message || 'Failed to fetch payroll income'
    
    // Check if error indicates borrower needs to verify income
    const errorLower = errorMessage.toLowerCase()
    if (errorLower.includes('not found') ||
        errorLower.includes('data was not found') ||
        errorLower.includes('unable to load') ||
        errorLower.includes('user token not found') ||
        errorLower.includes('has not completed income verification') ||
        errorLower.includes('no payroll income') ||
        errorLower.includes('please check the id supplied')) {
      payrollIncomeError.value = 'This borrower needs to verify their income. Please ask them to complete income verification in their borrower portal.'
    } else {
      payrollIncomeError.value = errorMessage
    }
  } finally {
    loadingPayrollIncome.value = false
  }
}

const fetchCraReport = async () => {
  if (!props.borrower?._id && !props.borrower?.id) return

  loadingCraReport.value = true
  craReportError.value = ''

  try {
    const borrowerId = props.borrower.id || props.borrower._id
    const response = await $fetch<{
      success: boolean
      report?: any
      pdf?: string | null
      request_id?: string
      message?: string
    }>(`/api/plaid/consumer_report/cra_base_report?borrower_id=${borrowerId}`)

    if (response.success && response.report) {
      craReport.value = {
        report: response.report,
        pdf: response.pdf,
        request_id: response.request_id,
      }
    } else if (response.success === false) {
      // Report not ready yet or not available
      craReport.value = null
    }
  } catch (err: any) {
    console.error('Error fetching CRA base report:', err)
    const errorMessage = err.data?.statusMessage || err.message || 'Failed to fetch CRA base report'
    
    // Check if error indicates user needs to share consumer report
    const errorLower = errorMessage.toLowerCase()
    if (errorLower.includes('consumer report identity') || 
        errorLower.includes('does not have consumer report') ||
        errorLower.includes('consumer report setup') ||
        errorLower.includes('user does not have') ||
        errorLower.includes('user/update')) {
      craReportError.value = 'This borrower needs to share their consumer report. Please ask them to complete the consumer report setup in their borrower portal.'
    } else {
      craReportError.value = errorMessage
    }
  } finally {
    loadingCraReport.value = false
  }
}

onMounted(() => {
  fetchAccounts()
  fetchTransactions()
  fetchLiabilities()
  fetchPayrollIncome()
  fetchCraReport()
})
</script>



