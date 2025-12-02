import { ref, computed } from 'vue'

export const useBorrowerDetailsUtils = () => {
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

  return {
    formatCurrency,
    formatDate,
    getInitials,
  }
}

