import mongoose from 'mongoose'

let isConnected = false
let connectionPromise: Promise<typeof mongoose> | null = null

export async function connectMongoDB(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (connectionPromise) {
    return connectionPromise
  }

  const config = useRuntimeConfig()
  const uri = config.mongodbUri || process.env.MONGODB_URI

  if (!uri) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Set it in your .env file or nuxt.config.ts runtimeConfig'
    )
  }

  connectionPromise = mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 30000,
    retryWrites: true,
    retryReads: true,
  })

  try {
    const mongooseInstance = await connectionPromise

    mongoose.connection.on('connected', () => {
      isConnected = true
      console.log('MongoDB connected successfully via Mongoose')
    })

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error)
      isConnected = false
      connectionPromise = null
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
      isConnected = false
      connectionPromise = null
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed due to application termination')
      process.exit(0)
    })

    if (mongoose.connection.readyState === 1) {
      isConnected = true
    }

    return mongooseInstance
  } catch (error) {
    connectionPromise = null
    isConnected = false
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1
}

export function getMongoose(): typeof mongoose {
  if (!isMongoConnected()) {
    throw new Error('MongoDB is not connected. Call connectMongoDB() first.')
  }
  return mongoose
}

export async function closeMongoConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
    isConnected = false
    connectionPromise = null
    console.log('MongoDB connection closed')
  }
}

export function getDatabaseName(): string | null {
  if (!isMongoConnected()) {
    return null
  }
  return mongoose.connection.db?.databaseName || null
}

if (import.meta.server) {
  connectMongoDB().catch((error) => {
    console.error('Failed to auto-connect to MongoDB:', error)
  })
}
