import { connectMongoDB } from '../lib/mongodb'
import mongoose, { Schema } from 'mongoose'

export type UserRole = 'bank' | 'borrower' | 'admin'

export interface UserAddress {
  street?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
}

export interface IUser {
  _id?: string
  email: string
  name: string
  firebaseUid?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  dateOfBirth?: string
  ssnLast4?: string
  address?: UserAddress
  role?: UserRole
  user_token?: string
  createdAt?: Date
  updatedAt?: Date
}

const UserAddressSchema = new Schema({
  street: String,
  city: String,
  region: String,
  postalCode: String,
  country: String,
}, { _id: false })

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  dateOfBirth: String,
  ssnLast4: String,
  address: UserAddressSchema,
  role: {
    type: String,
    enum: ['bank', 'borrower', 'admin'],
    default: 'borrower',
  },
  user_token: String,
}, {
  timestamps: true,
})

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export async function getUserModel() {
  await connectMongoDB()
  return User
}

export async function createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
  const UserModel = await getUserModel()
  
  const existingUser = await UserModel.findOne({ email: userData.email.toLowerCase().trim() })
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const newUser = new UserModel({
    ...userData,
    role: userData.role || 'borrower',
    email: userData.email.toLowerCase().trim(),
  })

  return await newUser.save()
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const UserModel = await getUserModel()
  return await UserModel.findOne({ email: email.toLowerCase().trim() }).lean()
}

export async function findUserById(userId: string): Promise<IUser | null> {
  const UserModel = await getUserModel()
  return await UserModel.findById(userId).lean()
}

export async function findUserByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
  const UserModel = await getUserModel()
  return await UserModel.findOne({ firebaseUid }).lean()
}

export async function updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
  const UserModel = await getUserModel()
  return await UserModel.findByIdAndUpdate(
    userId,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  ).lean()
}

export async function deleteUser(userId: string): Promise<boolean> {
  const UserModel = await getUserModel()
  const result = await UserModel.findByIdAndDelete(userId)
  return !!result
}

export { User }
export type User = IUser

