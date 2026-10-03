export type TemplateId = 'editorial' | 'mono' | 'grotesk'
export type Kind = 'invoice' | 'receipt'
export type Lang = 'es' | 'en'

export interface Party {
  name: string
  email: string
  address: string
  taxId: string
}

export interface Sender extends Party {
  mark: string
  phone: string
  website: string
  logo: string
  bank: string
}

export interface Item {
  id: string
  description: string
  detail: string
  qty: number
  price: number
}

// A receipt is signed by whoever received the money. That can be you
// (a client paid you) or the other party (you paid rent).
export interface ReceiptFields {
  role: 'payee' | 'payer'
  lang: Lang
  title: string
  concept: string
  method: string
  place: string
}

export interface Invoice {
  kind: Kind
  receipt: ReceiptFields
  number: string
  issued: string
  due: string
  currency: string
  client: Party
  items: Item[]
  taxLabel: string
  taxRate: number | null
  notes: string
}

export interface Settings {
  prefix: string
  next: number
  receiptPrefix: string
  receiptNext: number
  template: TemplateId
  sender: Sender
}

export interface TemplateProps {
  invoice: Invoice
  sender: Sender
}
