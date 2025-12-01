import { defineStore } from 'pinia'

export interface Borrower {
  _id?: string
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  name?: string
  phoneNumber?: string
  financial_summary?: {
    has_connected_accounts?: boolean
    net_worth?: number
    total_assets?: number
    total_investments?: number
    total_liabilities?: number
    account_count?: number
    currency?: string
  }
  createdAt?: Date | string
  [key: string]: any
}

export const useBorrowersStore = defineStore('borrowers', {
  state: () => ({
    borrowers: [] as Borrower[],
    loading: false,
    error: '',
    lastFetched: null as Date | null,
  }),

  getters: {
    borrowersWithAccounts: (state) => {
      return state.borrowers.filter(b => b.financial_summary?.has_connected_accounts)
    },

    connectedCount: (state) => {
      return state.borrowers.filter(b => b.financial_summary?.has_connected_accounts).length
    },

    totalPortfolioValue: (state) => {
      return state.borrowers.reduce((sum, borrower) => {
        const netWorth = getBorrowerNetWorth(borrower)
        return sum + netWorth
      }, 0)
    },

    averageNetWorth: (state) => {
      const connectedBorrowers = state.borrowers.filter(b => b.financial_summary?.has_connected_accounts)
      if (connectedBorrowers.length === 0) return 0
      const total = connectedBorrowers.reduce((sum, borrower) => sum + getBorrowerNetWorth(borrower), 0)
      return total / connectedBorrowers.length
    },

    totalAssets: (state) => {
      return state.borrowers.reduce((sum, borrower) => {
        return sum + (borrower.financial_summary?.total_assets || 0) + (borrower.financial_summary?.total_investments || 0)
      }, 0)
    },

    totalLiabilities: (state) => {
      return state.borrowers.reduce((sum, borrower) => {
        return sum + (borrower.financial_summary?.total_liabilities || 0)
      }, 0)
    },

    totalAccounts: (state) => {
      return state.borrowers.reduce((sum, borrower) => {
        return sum + (borrower.financial_summary?.account_count || 0)
      }, 0)
    },

    riskLevel: (state) => {
      const totalAssets = state.borrowers.reduce((sum, borrower) => {
        return sum + (borrower.financial_summary?.total_assets || 0) + (borrower.financial_summary?.total_investments || 0)
      }, 0)
      const totalLiabilities = state.borrowers.reduce((sum, borrower) => {
        return sum + (borrower.financial_summary?.total_liabilities || 0)
      }, 0)
      
      if (totalAssets === 0 && totalLiabilities === 0) return 'N/A'
      const ratio = totalLiabilities / (totalAssets || 1)
      if (ratio > 0.7) return 'High'
      if (ratio > 0.4) return 'Medium'
      return 'Low'
    },

    getBorrowerById: (state) => {
      return (id: string) => {
        return state.borrowers.find(b => b._id === id || b.id === id)
      }
    },
  },

  actions: {
    async fetchBorrowers(force = false) {
      // If we have recent data and not forcing refresh, skip fetch
      if (!force && this.lastFetched && this.borrowers.length > 0) {
        const timeSinceLastFetch = Date.now() - this.lastFetched.getTime()
        // Cache for 30 seconds
        if (timeSinceLastFetch < 30000) {
          return
        }
      }

      this.loading = true
      this.error = ''

      try {
        const response = await $fetch<{ success: boolean; data?: Borrower[] }>('/api/bank/borrower/get.borrower')
        if (response.success) {
          this.borrowers = response.data || []
          this.lastFetched = new Date()
        }
      } catch (err: any) {
        this.error = err.data?.statusMessage || err.message || 'Failed to load borrowers'
        console.error('Error fetching borrowers:', err)
      } finally {
        this.loading = false
      }
    },

    updateBorrower(borrowerId: string, updates: Partial<Borrower>) {
      const index = this.borrowers.findIndex(b => b._id === borrowerId || b.id === borrowerId)
      if (index !== -1) {
        this.borrowers[index] = { ...this.borrowers[index], ...updates }
      }
    },

    removeBorrower(borrowerId: string) {
      this.borrowers = this.borrowers.filter(b => b._id !== borrowerId && b.id !== borrowerId)
    },

    addBorrower(borrower: Borrower) {
      this.borrowers.unshift(borrower)
    },
  },
})

// Helper function for calculating net worth
function getBorrowerNetWorth(borrower: Borrower): number {
  if (!borrower.financial_summary) return 0
  const assets = (borrower.financial_summary.total_assets || 0) + (borrower.financial_summary.total_investments || 0)
  const liabilities = borrower.financial_summary.total_liabilities || 0
  return Math.max(0, assets - liabilities)
}

