<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Value Proposition for Borrowers -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>
      
      <!-- Subtle Pattern -->
      <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <div class="relative z-10 flex flex-col justify-between p-12 text-white">
        <!-- Logo/Brand Section -->
        <div>
          <div class="flex items-center space-x-3 mb-8">
            <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold">LendingHub</h1>
              <p class="text-sm text-white/90">Smart Loan Applications</p>
            </div>
          </div>
        </div>

        <!-- Value Proposition for Borrowers -->
        <div class="space-y-8 max-w-md">
          <div>
            <h2 class="text-4xl font-bold mb-4 leading-tight">
              Get Your Loan <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">Faster</span>
            </h2>
            <p class="text-lg text-white/95 leading-relaxed font-medium">
              Connect your bank account securely to get instant financial insights and faster loan approval.
            </p>
          </div>

          <!-- Benefits for Borrowers -->
          <div class="space-y-5">
            <div class="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="mt-1 h-6 w-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-lg mb-1">Faster Approval</p>
                <p class="text-sm text-white/80">Skip manual paperwork. Automated verification gets you approved in minutes, not days.</p>
              </div>
            </div>

            <div class="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="mt-1 h-6 w-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-lg mb-1">Better Rates</p>
                <p class="text-sm text-white/80">Get personalized rates based on your complete financial picture, not just credit score.</p>
              </div>
            </div>

            <div class="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="mt-1 h-6 w-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-lg mb-1">100% Secure</p>
                <p class="text-sm text-white/80">Bank-level encryption. Your credentials are never stored. We use Plaid, trusted by millions.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="font-medium">PCI Compliant</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="font-medium">256-bit SSL</span>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed">
            <strong>Your privacy matters:</strong> We only access the financial information necessary for your loan application. You can revoke access anytime. We never see or store your bank login credentials.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo & Value Prop -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center space-x-3 mb-4">
            <div class="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="text-left">
              <h1 class="text-xl font-bold text-gray-900">LendingHub</h1>
              <p class="text-xs text-gray-600">Smart Loan Applications</p>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Get Your Loan Faster</h2>
          <p class="text-sm text-gray-600">Sign in to connect your bank account securely</p>
        </div>

        <!-- Welcome Section -->
        <div class="text-center lg:text-left mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p class="text-gray-600">
            Sign in to continue your loan application
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  class="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
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
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <NuxtLink class="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">
                Forgot password?
              </NuxtLink>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4">
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

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span v-if="!loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                  <svg class="h-5 w-5 text-emerald-300 group-hover:text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-if="!loading">Sign In to Continue</span>
                <span v-else class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              </button>
            </div>
          </form>

          <!-- Next Steps Info -->
          <div class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div class="flex items-start space-x-3">
              <svg class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm">
                <p class="font-semibold text-emerald-900 mb-1">What happens next?</p>
                <p class="text-emerald-700">After signing in, you'll securely connect your bank account using Plaid. This takes less than 2 minutes and helps us verify your financial status for faster loan approval.</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="mt-6 mb-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">New to LendingHub?</span>
              </div>
            </div>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <NuxtLink   
              class="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              Start Your Application
            </NuxtLink>
          </div>
        </div>

        <!-- Security & Privacy Notice -->
        <div class="mt-6 text-center space-y-2">
          <div class="inline-flex items-center space-x-2 text-xs text-gray-500">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Bank-level encryption & security</span>
          </div>
          <p class="text-xs text-gray-500 max-w-sm mx-auto">
            Powered by <strong>Plaid</strong> - trusted by millions of users. Your bank credentials are never stored or accessible to us.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Meta tags for SEO
definePageMeta({
  title: 'Login - LendingHub',
  layout: false,
})

// Form state
const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Handle form submission
const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!form.email.trim()) {
      error.value = 'Email is required'
      loading.value = false
      return
    }

    if (!form.password.trim()) {
      error.value = 'Password is required'
      loading.value = false
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      error.value = 'Please enter a valid email address'
      loading.value = false
      return
    }

    const { login } = useFirebase()
    const user = await login(form.email, form.password)
    const idToken = await user.getIdToken()

    const response = await $fetch<{ success: boolean; user?: { role?: string } }>('/api/auth/login', {
      method: 'POST',
      body: { idToken },
      credentials: 'include'
    })

    if (response.success && response.user) {
      // Redirect based on user role
      const role = response.user.role || 'borrower'
      
      if (role === 'admin') {
        await navigateTo('/admin')
      } else if (role === 'bank') {
        await navigateTo('/bank')
      } else if (role === 'borrower') {
        await navigateTo('/borrower')
      } else {
        // Default to home page
        await navigateTo('/')
      }
    }
  } catch (err: any) {
    error.value = err?.message || err.data?.statusMessage || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>