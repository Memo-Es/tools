import { defaultSettings, newInvoice } from './invoice'
import type { Invoice, Settings, TemplateId } from './types'

// Dev only: open /?demo=mono (or editorial, grotesk, receipt) to fill the app with sample data.
// Every name, address and number here is made up.
export function seedDemo(template: string) {
  const settings: Settings = {
    ...defaultSettings,
    next: 2,
    template: (['editorial', 'mono', 'grotesk'].includes(template) ? template : 'grotesk') as TemplateId,
    sender: {
      name: 'Thomas Anderson',
      mark: '',
      email: 'thomas@example.com',
      phone: '+52 33 1234 5678',
      website: 'example.com',
      taxId: 'RFC XAXX010101000',
      address: 'Calle Ficticia 101\n44100 Guadalajara, Jal.\nMexico',
      bank: 'Bank: Example Bank\nCLABE: 0000 0000 0000 0000 00\nSWIFT: EXAMPLEXX',
      logo: '',
    },
  }
  const invoice: Invoice = {
    ...newInvoice(settings),
    number: 'INV-0002',
    issued: '2026-10-01',
    due: '2026-10-15',
    currency: 'USD',
    client: {
      name: 'Company, Inc.',
      email: 'billing@company.com',
      taxId: '',
      address: '1235 McAllister St, #438\nSan Francisco, CA 94114\nUnited States',
    },
    items: [
      { id: 'a', description: 'Website design', detail: 'Homepage and 6 inner pages', qty: 1, price: 6500 },
      { id: 'b', description: 'Design system', detail: 'Tokens, components, documentation', qty: 1, price: 3200 },
      { id: 'c', description: 'Revisions', detail: 'Hourly, after the second round', qty: 6, price: 85 },
    ],
    taxLabel: 'IVA',
    taxRate: null,
    notes: 'Payment due within 14 days. Thank you.',
  }
  // A year of rent, paid in cash to a landlord who signs for it.
  const receipt: Invoice = {
    ...invoice,
    kind: 'receipt',
    receipt: {
      role: 'payer',
      lang: 'es',
      title: 'Recibo de arrendamiento',
      concept:
        'renta del inmueble ubicado en Calle Ficticia 101, Int. 2, C.P. 44100, Guadalajara, Jal., correspondiente al periodo del 1 de noviembre de 2025 al 31 de octubre de 2026',
      method: 'efectivo',
      place: 'Guadalajara, Jal.',
    },
    number: 'REC-0001',
    currency: 'MXN',
    client: { name: 'Niobe Ramírez Castañeda', email: '', taxId: '', address: '' },
    items: [{ id: 'r', description: 'Renta mensual', detail: 'Noviembre 2025 – octubre 2026', qty: 12, price: 16209 }],
    notes: '',
  }
  localStorage.setItem('invoices.settings', JSON.stringify(settings))
  localStorage.setItem('invoices.draft', JSON.stringify(template === 'receipt' ? receipt : invoice))
}
