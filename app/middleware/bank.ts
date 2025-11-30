export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    return
  }

  try {
    const response = await $fetch<{ success: boolean; user?: { role?: string } }>('/api/auth/user', {
      credentials: 'include'
    })
    
    if (!response.success || !response.user) {
      return navigateTo('/auth/login')
    }

    const userRole = response.user.role || 'borrower'
    
    if (userRole !== 'bank') {
      if (userRole === 'admin') {
        return navigateTo('/admin')
      } else {
        return navigateTo('/')
      }
    }
  } catch (error) {
    return navigateTo('/auth/login')
  }
})

