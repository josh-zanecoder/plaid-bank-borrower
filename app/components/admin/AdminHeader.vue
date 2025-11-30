<template>
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top Header -->
      <div class="flex items-center justify-between py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-sm text-gray-600 mt-1">Manage banks and borrowers</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex space-x-8 border-t border-gray-200">
        <NuxtLink
          to="/admin"
          :class="[
            isActive('/admin')
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition'
          ]"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/banks"
          :class="[
            isActive('/admin/banks')
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition'
          ]"
        >
          Banks
        </NuxtLink>
        <NuxtLink
          to="/admin/borrowers"
          :class="[
            isActive('/admin/borrowers')
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition'
          ]"
        >
          Borrowers
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path === path
}

const handleLogout = async () => {
  try {
    await navigateTo('/auth/login')
  } catch (err) {
    console.error('Error during logout:', err)
    await navigateTo('/auth/login')
  }
}
</script>

