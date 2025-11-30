import { connectMongoDB } from '../lib/mongodb'
import mongoose, { Schema } from 'mongoose'
import type { IBorrower } from '../types/Borrower'

const BorrowerSchema = new Schema<IBorrower>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['borrower'],
    default: 'borrower',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  timestamps: true,
})

BorrowerSchema.index({ userId: 1 })

const Borrower = mongoose.models.Borrower || mongoose.model<IBorrower>('Borrower', BorrowerSchema)

export async function getBorrowerModel() {
  await connectMongoDB()
  return Borrower
}

export async function createBorrower(borrowerData: {
  firstName: string
  lastName: string
  email: string
  userId?: string
}): Promise<IBorrower> {
  const BorrowerModel = await getBorrowerModel()
  
  const existingBorrower = await BorrowerModel.findOne({ 
    email: borrowerData.email.toLowerCase().trim()
  })
  
  if (existingBorrower) {
    throw new Error('Borrower with this email already exists')
  }

  const newBorrower = new BorrowerModel({
    ...borrowerData,
    role: 'borrower',
    email: borrowerData.email.toLowerCase().trim(),
  })

  return await newBorrower.save()
}

export async function findBorrowerByEmail(email: string): Promise<IBorrower | null> {
  const BorrowerModel = await getBorrowerModel()
  return await BorrowerModel.findOne({ email: email.toLowerCase().trim() })
    .populate('userId')
    .lean()
}

export async function findBorrowerById(borrowerId: string): Promise<IBorrower | null> {
  const BorrowerModel = await getBorrowerModel()
  return await BorrowerModel.findById(borrowerId)
    .populate('userId')
    .lean()
}

export async function findAllBorrowers(): Promise<IBorrower[]> {
  const BorrowerModel = await getBorrowerModel()
  return await BorrowerModel.find()
    .populate('userId')
    .lean()
    .sort({ createdAt: -1 })
}

export async function updateBorrower(borrowerId: string, updateData: Partial<IBorrower>): Promise<IBorrower | null> {
  const BorrowerModel = await getBorrowerModel()
  return await BorrowerModel.findByIdAndUpdate(
    borrowerId,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  )
    .populate('userId')
    .lean()
}

export async function deleteBorrower(borrowerId: string): Promise<boolean> {
  const BorrowerModel = await getBorrowerModel()
  const result = await BorrowerModel.findByIdAndDelete(borrowerId)
  return !!result
}

export { Borrower }
export type Borrower = IBorrower

