<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <NuxtLink to="/bank" class="flex items-center gap-2">
            <div class="h-8 w-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Underwriting Portal
            </span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/bank"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="isActive('/bank') ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/bank/borrowers"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="isActive('/bank/borrowers') ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Borrowers
          </NuxtLink>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-4">
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const isActive = (path: string): boolean => {
  if (path === '/bank') {
    return route.path === '/bank' || route.path === '/bank/'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/auth/login')
  } catch (err) {
    console.error('Error during logout:', err)
    await navigateTo('/auth/login')
  }
}
</script>
