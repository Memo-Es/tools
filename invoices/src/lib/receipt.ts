import type { Lang } from './types'

// Everything a receipt prints, in both languages it can be issued in.
export const receiptText = {
  es: {
    title: 'Recibo',
    payee: 'Recibe',
    payer: 'Paga',
    name: 'Nombre',
    taxId: 'RFC',
    address: 'Domicilio',
    description: 'Concepto',
    qty: 'Cantidad',
    price: 'Precio',
    amount: 'Importe',
    subtotal: 'Subtotal',
    total: 'Total recibido',
    signature: 'Firma de quien recibe',
    methods: ['efectivo', 'transferencia', 'cheque'],
  },
  en: {
    title: 'Receipt',
    payee: 'Received by',
    payer: 'Received from',
    name: 'Name',
    taxId: 'Tax ID',
    address: 'Address',
    description: 'Description',
    qty: 'Qty',
    price: 'Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    total: 'Total received',
    signature: 'Signature of recipient',
    methods: ['cash', 'bank transfer', 'cheque'],
  },
} as const

// The sentence the receipt is built around: who paid, how much, for what.
export function receiptSentence(
  lang: Lang,
  p: { payer: string; total: string; words: string; concept: string; method: string },
) {
  if (lang === 'es') {
    let s = `Recibí de ${p.payer} la cantidad de ${p.total} (${p.words})`
    if (p.concept) s += ` por concepto de ${p.concept}`
    if (p.method) s += /^efectivo$/i.test(p.method) ? ', pagado en efectivo' : `, pagado mediante ${p.method}`
    return s + '.'
  }
  let s = `Received from ${p.payer} the sum of ${p.total} (${p.words})`
  if (p.concept) s += ` for ${p.concept}`
  if (p.method) s += /^cash$/i.test(p.method) ? ', paid in cash' : `, paid by ${p.method}`
  return s + '.'
}

export function placeAndDate(lang: Lang, place: string, iso: string) {
  if (!iso) return place
  const date = new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (!place) return date
  return lang === 'es' ? `${place}, a ${date}` : `${place}, ${date}`
}

// ---------- Amount in words ----------
// Mexican receipts write the total out in words, with cents as a fraction:
// CIENTO NOVENTA Y CUATRO MIL QUINIENTOS OCHO PESOS 00/100 M.N.

const esUnits = [
  '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]
const esTens = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const esHundreds = [
  '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos',
]

// Before a noun a final "uno" shortens: "veintiún mil", "treinta y un pesos".
function apocope(w: string) {
  return w.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un')
}

// 1–999.
function esBelow1000(n: number, shorten: boolean): string {
  if (n === 100) return 'cien'
  const h = Math.floor(n / 100)
  const r = n % 100
  const parts: string[] = []
  if (h) parts.push(esHundreds[h])
  if (r) {
    let w: string
    if (r < 30) w = esUnits[r]
    else w = esTens[Math.floor(r / 10)] + (r % 10 ? ' y ' + esUnits[r % 10] : '')
    if (shorten) w = apocope(w)
    parts.push(w)
  }
  return parts.join(' ')
}

function esWords(n: number): string {
  if (n === 0) return 'cero'
  const millions = Math.floor(n / 1_000_000)
  const thousands = Math.floor((n % 1_000_000) / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (millions) parts.push(millions === 1 ? 'un millón' : `${esBelow1000(millions, true)} millones`)
  if (thousands) parts.push(thousands === 1 ? 'mil' : `${esBelow1000(thousands, true)} mil`)
  if (rest) parts.push(esBelow1000(rest, false))
  return parts.join(' ')
}

const enUnits = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
]
const enTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function enBelow1000(n: number): string {
  const h = Math.floor(n / 100)
  const r = n % 100
  const parts: string[] = []
  if (h) parts.push(`${enUnits[h]} hundred`)
  if (r) parts.push(r < 20 ? enUnits[r] : enTens[Math.floor(r / 10)] + (r % 10 ? '-' + enUnits[r % 10] : ''))
  return parts.join(' ')
}

function enWords(n: number): string {
  if (n === 0) return 'zero'
  const scales = ['', ' thousand', ' million', ' billion']
  const parts: string[] = []
  for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) {
    const chunk = n % 1000
    if (chunk) parts.unshift(enBelow1000(chunk) + scales[i])
  }
  return parts.join(' ')
}

const esCurrency: Record<string, [string, string, string]> = {
  // singular, plural, suffix
  MXN: ['peso', 'pesos', 'M.N.'],
  USD: ['dólar', 'dólares', 'USD'],
  EUR: ['euro', 'euros', 'EUR'],
}

export function amountInWords(total: number, currency: string, lang: Lang) {
  const all = Math.round(total * 100)
  const whole = Math.floor(all / 100)
  const cents = String(all % 100).padStart(2, '0')
  if (lang === 'es') {
    const [one, many, suffix] = esCurrency[currency] ?? [currency, currency, '']
    let words = esWords(whole)
    // "un millón de pesos", "dos millones de pesos"
    if (whole >= 1_000_000 && whole % 1_000_000 === 0) words += ' de'
    words = apocope(words)
    const unit = whole === 1 ? one : many
    return [words, unit, `${cents}/100`, suffix].filter(Boolean).join(' ').toUpperCase()
  }
  return `${enWords(whole)} and ${cents}/100 ${currency}`.toUpperCase()
}
