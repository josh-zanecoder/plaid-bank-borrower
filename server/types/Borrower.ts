export interface IBorrower {
  _id?: string
  firstName: string
  lastName: string
  email: string
  role: 'borrower'
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Borrower = IBorrower

export interface CreateBorrowerInput {
  firstName: string
  lastName: string
  email: string
  userId?: string
}

