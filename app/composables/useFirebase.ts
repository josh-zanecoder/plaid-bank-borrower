import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { Auth, User } from 'firebase/auth'

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null

function initializeFirebase(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp
  }

  const existingApps = getApps()
  if (existingApps.length > 0 && existingApps[0]) {
    firebaseApp = existingApps[0]
    auth = getAuth(firebaseApp)
    return firebaseApp
  }

  const config = useRuntimeConfig()
  
  const firebaseConfig: FirebaseOptions = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    throw new Error(
      'Firebase Client SDK configuration is missing. Set FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, and FIREBASE_PROJECT_ID in your .env file or nuxt.config.ts runtimeConfig.public'
    )
  }

  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth(firebaseApp)
  
  return firebaseApp
}

function getAuthInstance(): Auth {
  if (!auth) {
    initializeFirebase()
  }
  if (!auth) {
    throw new Error('Failed to initialize Firebase Auth')
  }
  return auth
}

export function useFirebase() {
  const login = async (email: string, password: string): Promise<User> => {
    const authInstance = getAuthInstance()
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
    return userCredential.user
  }

  return {
    login,
  }
}

