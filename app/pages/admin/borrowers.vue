<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
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
              <p class="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div class="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Borrowers Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">All Borrowers</h2>
            <div class="flex items-center gap-3">
              <button
                @click="openAddModal"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                <span class="flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Borrower
                </span>
              </button>
              <button
                @click="fetchBorrowers"
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
          <p class="text-sm text-gray-500 mt-1">Borrowers will appear here once they register.</p>
        </div>

        <!-- Borrowers Table -->
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
                v-for="borrower in borrowers"
                :key="borrower._id || borrower.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span class="text-green-600 font-semibold text-sm">
                        {{ getInitials(borrower.name || `${borrower.firstName || ''} ${borrower.lastName || ''}`.trim() || borrower.email) }}
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
                  <div class="flex items-center justify-end gap-3">
                    <button
                      @click="editBorrower(borrower)"
                      class="text-indigo-600 hover:text-indigo-900 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDeleteBorrower(borrower)"
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

      <!-- Add/Edit Borrower Modal -->
      <AddOrEditBorrower
        :isOpen="isModalOpen"
        :borrower="selectedBorrower"
        @close="closeModal"
        @created="handleBorrowerCreated"
        @updated="handleBorrowerUpdated"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmDeleteModal
        :isOpen="isDeleteModalOpen"
        :loading="deletingBorrower"
        :title="`Delete ${deleteBorrowerData?.firstName} ${deleteBorrowerData?.lastName}?`"
        :message="`Are you sure you want to delete ${deleteBorrowerData?.firstName} ${deleteBorrowerData?.lastName}? This action cannot be undone.`"
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AddOrEditBorrower from '../../components/admin/AddOrEditBorrower.vue'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal.vue'

definePageMeta({
  title: 'Borrowers - Admin Dashboard',
  layout: false,
})

const loading = ref(false)
const borrowers = ref<any[]>([])
const isModalOpen = ref(false)
const selectedBorrower = ref<any | null>(null)
const isDeleteModalOpen = ref(false)
const deleteBorrowerData = ref<any | null>(null)
const deletingBorrower = ref(false)

const connectedCount = computed(() => {
  return borrowers.value.filter(b => b.financial_summary?.has_connected_accounts).length
})

const pendingCount = computed(() => {
  return borrowers.value.filter(b => !b.financial_summary?.has_connected_accounts).length
})

const fetchBorrowers = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data?: any[] }>('/api/admin/borrower/get.borrower')
    if (response.success && response.data) {
      borrowers.value = response.data
    }
  } catch (err: any) {
    console.error('Error fetching borrowers:', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  selectedBorrower.value = null
  isModalOpen.value = true
}

const editBorrower = (borrower: any) => {
  selectedBorrower.value = borrower
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedBorrower.value = null
}

const handleBorrowerCreated = () => {
  fetchBorrowers()
}

const handleBorrowerUpdated = () => {
  fetchBorrowers()
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
    const response = await $fetch<{ success: boolean; message?: string }>(`/api/admin/borrower/${deleteBorrowerData.value.id || deleteBorrowerData.value._id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      isDeleteModalOpen.value = false
      deleteBorrowerData.value = null
      await fetchBorrowers()
      
      // Show success toast (you can replace this with a proper toast component)
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
  // Simple toast implementation - you can replace this with a proper toast library
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

onMounted(() => {
  fetchBorrowers()
})
</script>

