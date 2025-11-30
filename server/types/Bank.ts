export interface IBank {
  _id?: string
  name: string
  email: string
  role: 'bank'
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Bank = IBank

export interface CreateBankInput {
  name: string
  email: string
  userId?: string
}

