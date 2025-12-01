import { connectMongoDB } from '../lib/mongodb'
import mongoose, { Schema } from 'mongoose'
import type { IBank } from '../types/Bank'

const BankSchema = new Schema<IBank>({
  name: {
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
    enum: ['bank'],
    default: 'bank',
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

BankSchema.index({ userId: 1 })

const Bank = mongoose.models.Bank || mongoose.model<IBank>('Bank', BankSchema)

export async function getBankModel() {
  await connectMongoDB()
  return Bank
}

export async function createBank(bankData: {
  name: string
  email: string
  userId?: string
}): Promise<IBank> {
  const BankModel = await getBankModel()
  
  const existingBank = await BankModel.findOne({ 
    email: bankData.email.toLowerCase().trim()
  })
  
  if (existingBank) {
    throw new Error('Bank with this email already exists')
  }

  const newBank = new BankModel({
    ...bankData,
    role: 'bank',
    email: bankData.email.toLowerCase().trim(),
  })

  return await newBank.save()
}

export async function findBankByEmail(email: string): Promise<IBank | null> {
  const BankModel = await getBankModel()
  return await BankModel.findOne({ email: email.toLowerCase().trim() })
    .populate('userId')
    .lean()
}

export async function findBankByUserId(userId: string): Promise<IBank | null> {
  const BankModel = await getBankModel()
  return await BankModel.findOne({ userId })
    .populate('userId')
    .lean()
}

export async function findBankById(bankId: string): Promise<IBank | null> {
  const BankModel = await getBankModel()
  return await BankModel.findById(bankId)
    .populate('userId')
    .lean()
}

export async function findAllBanks(): Promise<IBank[]> {
  const BankModel = await getBankModel()
  return await BankModel.find()
    .populate('userId')
    .lean()
    .sort({ createdAt: -1 })
}

export async function updateBank(bankId: string, updateData: Partial<IBank>): Promise<IBank | null> {
  const BankModel = await getBankModel()
  return await BankModel.findByIdAndUpdate(
    bankId,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  )
    .populate('userId')
    .lean()
}

export async function deleteBank(bankId: string): Promise<boolean> {
  const BankModel = await getBankModel()
  const result = await BankModel.findByIdAndDelete(bankId)
  return !!result
}

export async function linkBankToUser(bankId: string, userId: string): Promise<IBank | null> {
  const BankModel = await getBankModel()
  return await BankModel.findByIdAndUpdate(
    bankId,
    { userId },
    { new: true }
  )
    .populate('userId')
    .lean()
}

export { Bank }
export type Bank = IBank

