export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/auth/login') {
    return
  }

  if (process.server) {
    return
  }

  try {
    const response = await $fetch<{ success: boolean; user?: any }>('/api/auth/user', {
      credentials: 'include'
    })
    
    if (!response.success || !response.user) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    return navigateTo('/auth/login')
  }
})

