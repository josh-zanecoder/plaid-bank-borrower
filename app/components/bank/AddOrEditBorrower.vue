<template>
  <!-- Modal -->
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-[9999] overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay with blur -->
      <div
        class="fixed inset-0 backdrop-blur-sm transition-opacity"
        @click="close"
        style="background-color: rgba(0, 0, 0, 0.1);"
      ></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
        <div class="bg-white px-6 pt-6 pb-6 sm:p-8">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900" id="modal-title">
              {{ isEditMode ? 'Edit Borrower' : 'Create New Borrower' }}
            </h3>
            <button
              @click="close"
              type="button"
              class="text-gray-400 hover:text-gray-500 transition focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- First Name Input -->
            <div class="w-full">
              <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-900 bg-white"
                placeholder="Enter first name"
              />
            </div>

            <!-- Last Name Input -->
            <div class="w-full">
              <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-900 bg-white"
                placeholder="Enter last name"
              />
            </div>

            <!-- Email Input -->
            <div class="w-full">
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-900 bg-white"
                placeholder="borrower@example.com"
              />
            </div>

            <!-- Password Input (only for create mode) -->
            <div v-if="!isEditMode" class="w-full">
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  class="block w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-900 bg-white"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>

            <!-- Plaid Connection Types Multi-Select -->
            <div class="w-full">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Plaid Connection Types
              </label>
              <div class="space-y-3 p-4 border-2 border-gray-300 rounded-lg bg-white">
                <label
                  v-for="option in plaidConnectionOptions"
                  :key="option.value"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                >
                  <input
                    type="checkbox"
                    :value="option.value"
                    v-model="form.plaidConnectionTypes"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                  <div class="ml-3 flex-1">
                    <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
                    <p class="text-xs text-gray-500 mt-0.5">{{ option.description }}</p>
                  </div>
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-500">Select one or more connection types required for this borrower</p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4">
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

            <!-- Success Message -->
            <div v-if="success" class="rounded-lg bg-green-50 border border-green-200 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{{ success }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                @click="close"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span v-if="!loading">{{ isEditMode ? 'Update Borrower' : 'Create Borrower' }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isEditMode ? 'Updating...' : 'Creating...' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

interface Props {
  isOpen: boolean
  borrower?: any | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditMode = computed(() => !!props.borrower)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  plaidConnectionTypes: ['bank_account'] as string[],
})

const plaidConnectionOptions = [
  {
    value: 'bank_account',
    label: 'Bank Account',
    description: 'Connect bank accounts to view balances and transactions',
  },
  {
    value: 'income_verification',
    label: 'Income Verification',
    description: 'Verify income through payroll or bank income data',
  },
  {
    value: 'consumer_report',
    label: 'Consumer Report',
    description: 'Access consumer credit reports and financial history',
  },
]

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const resetForm = () => {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.password = ''
  form.plaidConnectionTypes = ['bank_account']
  error.value = ''
  success.value = ''
  showPassword.value = false
}

const close = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    if (isEditMode.value) {
      const response = await $fetch<{ success: boolean; message?: string; data?: any }>(`/api/bank/borrower/${props.borrower?.id || props.borrower?._id}`, {
        method: 'PUT',
        body: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          plaidConnectionTypes: form.plaidConnectionTypes,
        }
      })

      if (response.success) {
        success.value = response.message || 'Borrower updated successfully!'
        setTimeout(() => {
          resetForm()
          emit('updated')
          emit('close')
        }, 1500)
      }
    } else {
      const response = await $fetch<{ success: boolean; message?: string; data?: any }>('/api/bank/borrower/create', {
        method: 'POST',
        body: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          plaidConnectionTypes: form.plaidConnectionTypes,
        }
      })

      if (response.success) {
        success.value = response.message || 'Borrower created successfully!'
        setTimeout(() => {
          resetForm()
          emit('created')
          emit('close')
        }, 1500)
      }
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || (isEditMode.value ? 'Failed to update borrower. Please try again.' : 'Failed to create borrower. Please try again.')
  } finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue && props.borrower) {
    form.firstName = props.borrower.firstName || ''
    form.lastName = props.borrower.lastName || ''
    form.email = props.borrower.email || ''
    form.password = ''
    form.plaidConnectionTypes = props.borrower.plaidConnectionTypes || ['bank_account']
  } else if (!newValue) {
    resetForm()
  }
})

watch(() => props.borrower, (newBorrower) => {
  if (newBorrower && props.isOpen) {
    form.firstName = newBorrower.firstName || ''
    form.lastName = newBorrower.lastName || ''
    form.email = newBorrower.email || ''
    form.password = ''
    form.plaidConnectionTypes = newBorrower.plaidConnectionTypes || ['bank_account']
  }
})
</script>

