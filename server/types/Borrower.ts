export enum PlaidConnectionType {
  BANK_ACCOUNT = 'bank_account',
  INCOME_VERIFICATION = 'income_verification',
  CONSUMER_REPORT = 'consumer_report',
}

export interface IBorrower {
  _id?: string
  firstName: string
  lastName: string
  email: string
  role: 'borrower'
  userId?: string
  bankId?: string
  addedBy?: string
  plaidConnectionTypes?: PlaidConnectionType[]
  accessToken?: string
  userToken?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Borrower = IBorrower

export interface CreateBorrowerInput {
  firstName: string
  lastName: string
  email: string
  userId?: string
  bankId?: string
  addedBy?: string
  plaidConnectionTypes?: PlaidConnectionType[]
}

