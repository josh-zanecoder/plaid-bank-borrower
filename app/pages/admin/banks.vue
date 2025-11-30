<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Banks</p>
              <p class="text-3xl font-bold text-gray-900">{{ banks.length }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Active Banks</p>
              <p class="text-3xl font-bold text-gray-900">{{ banks.length }}</p>
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
              <p class="text-sm font-medium text-gray-600 mb-1">Registered This Month</p>
              <p class="text-3xl font-bold text-gray-900">{{ newThisMonth }}</p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Banks Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">All Banks</h2>
            <div class="flex items-center gap-3">
              <button
                @click="showAddBankModal = true"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                <span class="flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Bank
                </span>
              </button>
              <button
                @click="fetchBanks"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
              <span v-if="!loading" class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && banks.length === 0" class="px-6 py-12 text-center">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-gray-600">Loading banks...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && banks.length === 0" class="px-6 py-12 text-center">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="text-gray-600 font-medium">No banks found</p>
          <p class="text-sm text-gray-500 mt-1">Banks will appear here once they register.</p>
        </div>

        <!-- Banks Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
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
                v-for="bank in banks"
                :key="bank._id || bank.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span class="text-blue-600 font-semibold text-sm">
                        {{ getInitials(bank.name || bank.email) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ bank.name || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">{{ bank.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ bank.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(bank.createdAt) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-3">
                    <button
                      @click="editBank(bank)"
                      class="text-indigo-600 hover:text-indigo-900 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDeleteBank(bank)"
                      class="text-red-600 hover:text-red-900 transition cursor-pointer"
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

      <!-- Add Bank Modal -->
      <AddOrCreateBank
        :isOpen="showAddBankModal"
        :bank="null"
        @close="showAddBankModal = false"
        @created="handleBankCreated"
      />

      <!-- Edit Bank Modal -->
      <AddOrCreateBank
        :isOpen="showEditBankModal"
        :bank="selectedBank"
        @close="showEditBankModal = false; selectedBank = null"
        @updated="handleBankUpdated"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmDeleteModal
        :isOpen="isDeleteModalOpen"
        :loading="deletingBankId !== null"
        :title="`Delete ${deleteBankData?.name || deleteBankData?.email}?`"
        :message="`Are you sure you want to delete ${deleteBankData?.name || deleteBankData?.email}? This action cannot be undone.`"
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AddOrCreateBank from '../../components/admin/AddOrEditBank.vue'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal.vue'

definePageMeta({
  title: 'Banks - Admin Dashboard',
  layout: false,
})

const loading = ref(false)
const banks = ref<any[]>([])
const showAddBankModal = ref(false)
const showEditBankModal = ref(false)
const selectedBank = ref<any>(null)
const deletingBankId = ref<string | null>(null)
const isDeleteModalOpen = ref(false)
const deleteBankData = ref<any | null>(null)

const newThisMonth = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return banks.value.filter(bank => {
    if (!bank.createdAt) return false
    const createdAt = new Date(bank.createdAt)
    return createdAt >= startOfMonth
  }).length
})

const fetchBanks = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; banks?: any[] }>('/api/admin/bank/get.bank')
    if (response.success) {
      banks.value = response.banks || []
    }
  } catch (err: any) {
    console.error('Error fetching banks:', err)
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

const viewBank = (bank: any) => {
  console.log('View bank:', bank)
}

const editBank = (bank: any) => {
  selectedBank.value = bank
  showEditBankModal.value = true
}

const confirmDeleteBank = (bank: any) => {
  deleteBankData.value = bank
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  if (deletingBankId.value === null) {
    isDeleteModalOpen.value = false
    deleteBankData.value = null
  }
}

const handleDeleteConfirm = async () => {
  if (!deleteBankData.value) return

  deletingBankId.value = deleteBankData.value._id || deleteBankData.value.id

  try {
    const response = await $fetch<{ success: boolean; message?: string }>(`/api/admin/bank/${deleteBankData.value._id || deleteBankData.value.id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      isDeleteModalOpen.value = false
      deleteBankData.value = null
      await fetchBanks()
      
      showToast('Bank deleted successfully', 'success')
    }
  } catch (err: any) {
    console.error('Error deleting bank:', err)
    showToast(err.data?.statusMessage || err.message || 'Failed to delete bank', 'error')
  } finally {
    deletingBankId.value = null
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
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

const handleBankCreated = () => {
  fetchBanks()
}

const handleBankUpdated = () => {
  fetchBanks()
}

onMounted(() => {
  fetchBanks()
})
</script>

