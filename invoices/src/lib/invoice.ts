import type { Invoice, Item, Kind, Party, ReceiptFields, Sender, Settings } from './types'

export const emptyParty: Party = { name: '', email: '', address: '', taxId: '' }

export const emptySender: Sender = {
  ...emptyParty,
  mark: '',
  phone: '',
  website: '',
  logo: '',
  bank: '',
}

export const defaultSettings: Settings = {
  prefix: 'INV-',
  next: 1,
  receiptPrefix: 'REC-',
  receiptNext: 1,
  template: 'grotesk',
  sender: emptySender,
}

export function formatNumber(prefix: string, n: number) {
  return prefix + String(n).padStart(4, '0')
}

export function nextNumber(settings: Settings, kind: Kind) {
  return kind === 'receipt'
    ? formatNumber(settings.receiptPrefix, settings.receiptNext)
    : formatNumber(settings.prefix, settings.next)
}

export const invoiceNote = 'Payment due within 14 days. Thank you.'

export const defaultReceipt: ReceiptFields = {
  role: 'payee',
  lang: 'es',
  title: '',
  concept: '',
  method: '',
  place: '',
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function newItem(): Item {
  return { id: crypto.randomUUID(), description: '', detail: '', qty: 1, price: 0 }
}

export function newInvoice(settings: Settings, previous?: Invoice): Invoice {
  const issued = today()
  const kind = previous?.kind ?? 'invoice'
  return {
    kind,
    // Receipts tend to repeat (the same rent every month), so a new one keeps all of it.
    receipt: { ...defaultReceipt, ...previous?.receipt },
    number: nextNumber(settings, kind),
    issued,
    due: addDays(issued, 14),
    currency: previous?.currency ?? 'MXN',
    client: emptyParty,
    items: [newItem()],
    taxLabel: previous?.taxLabel ?? 'IVA',
    taxRate: previous?.taxRate ?? null,
    notes: previous?.notes ?? invoiceNote,
  }
}

export function totals(invoice: Invoice) {
  const subtotal = invoice.items.reduce((sum, i) => sum + i.qty * i.price, 0)
  const tax = invoice.taxRate ? (subtotal * invoice.taxRate) / 100 : 0
  return { subtotal, tax, total: subtotal + tax, hasTax: invoice.taxRate !== null }
}

export function amount(n: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
    })
      .format(n)
      .replace(/[A-Z]{3}\s?/, '')
      .trim()
  } catch {
    return n.toFixed(2)
  }
}

export function money(n: number, currency: string) {
  return `${currency} ${amount(n, currency)}`
}

export function qty(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export function longDate(iso: string) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function shortDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

// "Writing for Design" -> "W. F. D." unless the sender typed their own mark.
export function markOf(sender: Sender) {
  if (sender.mark.trim()) return sender.mark.trim().split(/\s+/)
  const words = sender.name.split(/\s+/).filter((w) => /^[\p{L}]/u.test(w))
  return words.slice(0, 4).map((w) => w[0].toUpperCase() + '.')
}

export function lines(text: string) {
  return text.split('\n').filter((l) => l.trim() !== '')
}

const common = ['MXN', 'USD', 'EUR', 'GBP', 'CAD']
export const currencies = [
  ...common,
  ...Intl.supportedValuesOf('currency').filter((c) => !common.includes(c)),
]
