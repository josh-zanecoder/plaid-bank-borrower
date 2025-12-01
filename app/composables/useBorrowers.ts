/**
 * Composable for fetching and managing borrowers
 * This centralizes the fetch logic without needing a store
 */
export const useBorrowers = () => {
  const borrowers = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchBorrowers = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await $fetch<{ success: boolean; data?: any[] }>('/api/bank/borrower/get.borrower')
      if (response.success) {
        borrowers.value = response.data || []
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || 'Failed to load borrowers'
      console.error('Error fetching borrowers:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    borrowers,
    loading,
    error,
    fetchBorrowers,
  }
}

