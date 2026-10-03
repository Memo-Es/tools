import { useEffect, type ReactNode } from 'react'
import {
  addDays,
  currencies,
  defaultSettings,
  invoiceNote,
  money,
  newInvoice,
  newItem,
  nextNumber,
  totals,
} from './lib/invoice'
import { receiptText } from './lib/receipt'
import { usePersisted } from './lib/store'
import type { Invoice, Item, Kind, Party, ReceiptFields, Sender, Settings } from './lib/types'
import { Preview } from './Preview'
import { templates } from './templates'
import { Receipt } from './templates/Receipt'

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span className="label">{label}:</span>
      {children}
    </label>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <div className="rule" />
      <h2>~ $ {title}</h2>
      <div className="rule" />
      {children}
    </section>
  )
}

export function App() {
  const [settings, setSettings] = usePersisted<Settings>('invoices.settings', () => defaultSettings)
  const [invoice, setInvoice] = usePersisted<Invoice>('invoices.draft', () => newInvoice(defaultSettings))
  const [clients, setClients] = usePersisted<Party[]>('invoices.clients', () => [])

  const sender = settings.sender
  const isReceipt = invoice.kind === 'receipt'
  const Template = isReceipt
    ? Receipt
    : (templates.find((t) => t.id === settings.template)?.component ?? templates[0].component)
  const t = totals(invoice)
  const upcoming = nextNumber(settings, invoice.kind)
  const receipt = invoice.receipt
  const words = receiptText[receipt.lang]

  const edit = (patch: Partial<Invoice>) => setInvoice((inv) => ({ ...inv, ...patch }))
  const editClient = (patch: Partial<Party>) => setInvoice((inv) => ({ ...inv, client: { ...inv.client, ...patch } }))
  const editSender = (patch: Partial<Sender>) => setSettings((s) => ({ ...s, sender: { ...s.sender, ...patch } }))
  const editReceipt = (patch: Partial<ReceiptFields>) =>
    setInvoice((inv) => ({ ...inv, receipt: { ...inv.receipt, ...patch } }))
  const editItem = (id: string, patch: Partial<Item>) =>
    setInvoice((inv) => ({ ...inv, items: inv.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))

  // Each kind keeps its own numbering, so switching takes the next number of the other one.
  const setKind = (kind: Kind) =>
    setInvoice((inv) => ({
      ...inv,
      kind,
      number: nextNumber(settings, kind),
      notes: kind === 'receipt' && inv.notes === invoiceNote ? '' : inv.notes,
    }))

  const pickClient = (name: string) => {
    const saved = clients.find((c) => c.name === name)
    editClient(saved ?? { name })
  }

  const loadLogo = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => editSender({ logo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  const savePdf = () => {
    // Advance the counter the first time this number is issued.
    if (invoice.number === upcoming) {
      setSettings((s) => (isReceipt ? { ...s, receiptNext: s.receiptNext + 1 } : { ...s, next: s.next + 1 }))
    }
    if (invoice.client.name.trim()) {
      setClients((list) => [invoice.client, ...list.filter((c) => c.name !== invoice.client.name)])
    }
    window.print()
  }

  // The PDF file name comes from the document title.
  useEffect(() => {
    const before = () => (document.title = [invoice.number, invoice.client.name].filter(Boolean).join(' '))
    const after = () => (document.title = 'invoices')
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [invoice.number, invoice.client.name])

  const paper = <Template invoice={invoice} sender={sender} />

  return (
    <>
      <div className="app">
        <header className="bar">
          <span className="dim">&gt;</span> <a className="crumb" href="/">TOOLS</a> <span className="dim">/</span> INVOICES{' '}
          <span className="dim">({invoice.number})</span>
          <span className="dots" />
          <nav className="switch">
            {(['invoice', 'receipt'] as const).map((k) => (
              <button key={k} className={invoice.kind === k ? 'on' : ''} onClick={() => setKind(k)}>
                [{k.toUpperCase()}]
              </button>
            ))}
          </nav>
          <nav className="switch">
            {isReceipt
              ? (['es', 'en'] as const).map((lang) => (
                  <button key={lang} className={receipt.lang === lang ? 'on' : ''} onClick={() => editReceipt({ lang })}>
                    [{lang.toUpperCase()}]
                  </button>
                ))
              : templates.map((tpl) => (
              <button
                key={tpl.id}
                className={tpl.id === settings.template ? 'on' : ''}
                onClick={() => setSettings((s) => ({ ...s, template: tpl.id }))}
              >
                    [{tpl.label.toUpperCase()}]
                  </button>
                ))}
          </nav>
          <button onClick={() => setInvoice(newInvoice(settings, invoice))}>[NEW]</button>
          <button className="primary" onClick={savePdf}>
            [SAVE_PDF ↓]
          </button>
        </header>

        <main className="panes">
          <div className="preview-pane">
            <Preview>{paper}</Preview>
          </div>

          <div className="form-pane">
            <Section title={!isReceipt ? 'BILL_TO' : receipt.role === 'payee' ? 'RECEIVED_FROM' : 'PAID_TO'}>
              {isReceipt && (
                <div className="chips first">
                  <span className="dim">I_AM:</span>
                  <button className={receipt.role === 'payee' ? 'on' : ''} onClick={() => editReceipt({ role: 'payee' })}>
                    [RECEIVING]
                  </button>
                  <button className={receipt.role === 'payer' ? 'on' : ''} onClick={() => editReceipt({ role: 'payer' })}>
                    [PAYING]
                  </button>
                  <span className="dim hint">
                    {receipt.role === 'payee' ? 'you sign it' : 'they sign it'}
                  </span>
                </div>
              )}
              <div className="grid">
                <Field label="NAME" wide>
                  <input
                    list="clients"
                    value={invoice.client.name}
                    placeholder={isReceipt ? 'find or add a person' : 'find or add a client'}
                    onChange={(e) => pickClient(e.target.value)}
                  />
                  <datalist id="clients">
                    {clients.map((c) => (
                      <option key={c.name} value={c.name} />
                    ))}
                  </datalist>
                </Field>
                <Field label="EMAIL">
                  <input value={invoice.client.email} onChange={(e) => editClient({ email: e.target.value })} />
                </Field>
                <Field label="TAX_ID">
                  <input value={invoice.client.taxId} onChange={(e) => editClient({ taxId: e.target.value })} />
                </Field>
                <Field label="ADDRESS" wide>
                  <textarea
                    rows={3}
                    value={invoice.client.address}
                    onChange={(e) => editClient({ address: e.target.value })}
                  />
                </Field>
              </div>
            </Section>

            <Section title={isReceipt ? 'RECEIPT' : 'INVOICE'}>
              <div className="grid">
                <Field label="NUMBER">
                  <input value={invoice.number} onChange={(e) => edit({ number: e.target.value })} />
                </Field>
                <Field label="CURRENCY">
                  <select value={invoice.currency} onChange={(e) => edit({ currency: e.target.value })}>
                    {currencies.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label={isReceipt ? 'DATE' : 'ISSUED'}>
                  <input type="date" value={invoice.issued} onChange={(e) => edit({ issued: e.target.value })} />
                </Field>
                {isReceipt ? (
                  <Field label="PLACE">
                    <input
                      value={receipt.place}
                      placeholder="Guadalajara, Jal."
                      onChange={(e) => editReceipt({ place: e.target.value })}
                    />
                  </Field>
                ) : (
                  <Field label="DUE">
                    <input type="date" value={invoice.due} onChange={(e) => edit({ due: e.target.value })} />
                  </Field>
                )}
                {isReceipt && (
                  <>
                    <Field label="TITLE">
                      <input
                        value={receipt.title}
                        placeholder={words.title}
                        onChange={(e) => editReceipt({ title: e.target.value })}
                      />
                    </Field>
                    <Field label="PAID_IN">
                      <input
                        value={receipt.method}
                        placeholder={words.methods.join(' / ')}
                        onChange={(e) => editReceipt({ method: e.target.value })}
                      />
                    </Field>
                    <Field label={receipt.lang === 'es' ? 'POR_CONCEPTO_DE' : 'FOR'} wide>
                      <textarea
                        rows={3}
                        value={receipt.concept}
                        placeholder={
                          receipt.lang === 'es'
                            ? 'renta del inmueble ubicado en …, correspondiente al periodo del … al …'
                            : 'rent of the apartment at …, for the period … to …'
                        }
                        onChange={(e) => editReceipt({ concept: e.target.value })}
                      />
                    </Field>
                  </>
                )}
              </div>
              {isReceipt ? (
                <div className="chips">
                  <span className="dim">PAID_IN:</span>
                  {words.methods.map((m) => (
                    <button key={m} className={receipt.method === m ? 'on' : ''} onClick={() => editReceipt({ method: m })}>
                      [{m.toUpperCase()}]
                    </button>
                  ))}
                </div>
              ) : (
              <div className="chips">
                <span className="dim">TERMS:</span>
                {[0, 7, 14, 30].map((d) => (
                  <button
                    key={d}
                    className={invoice.due === addDays(invoice.issued, d) ? 'on' : ''}
                    onClick={() => edit({ due: addDays(invoice.issued, d) })}
                  >
                    [{d === 0 ? 'NOW' : `${d}D`}]
                  </button>
                ))}
              </div>
              )}
            </Section>

            <Section title="ITEMS">
              {invoice.items.map((item, n) => (
                <div className="item" key={item.id}>
                  <div className="item-head">
                    <span className="dim">{String(n + 1).padStart(2, '0')}</span>
                    <input
                      className="strong"
                      value={item.description}
                      placeholder="description"
                      onChange={(e) => editItem(item.id, { description: e.target.value })}
                    />
                    <button
                      className="dim"
                      title="Remove item"
                      onClick={() => edit({ items: invoice.items.filter((i) => i.id !== item.id) })}
                    >
                      [x]
                    </button>
                  </div>
                  <input
                    className="detail"
                    value={item.detail}
                    placeholder="detail (optional)"
                    onChange={(e) => editItem(item.id, { detail: e.target.value })}
                  />
                  <div className="item-nums">
                    <Field label="QTY">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.qty}
                        onChange={(e) => editItem(item.id, { qty: e.target.valueAsNumber || 0 })}
                      />
                    </Field>
                    <Field label="PRICE">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.price || ''}
                        placeholder="0"
                        onChange={(e) => editItem(item.id, { price: e.target.valueAsNumber || 0 })}
                      />
                    </Field>
                    <span className="item-amount">= {money(item.qty * item.price, invoice.currency)}</span>
                  </div>
                </div>
              ))}
              <button className="add" onClick={() => edit({ items: [...invoice.items, newItem()] })}>
                [+ ADD_ITEM]
              </button>
            </Section>

            <Section title="TAX_AND_NOTES">
              <div className="grid">
                <Field label="TAX_LABEL">
                  <input value={invoice.taxLabel} onChange={(e) => edit({ taxLabel: e.target.value })} />
                </Field>
                <Field label="TAX_%">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoice.taxRate ?? ''}
                    placeholder="none"
                    onChange={(e) => edit({ taxRate: e.target.value === '' ? null : e.target.valueAsNumber })}
                  />
                </Field>
                <Field label="NOTES" wide>
                  <textarea rows={2} value={invoice.notes} onChange={(e) => edit({ notes: e.target.value })} />
                </Field>
              </div>
            </Section>

            <Section title="FROM">
              <details open={!sender.name}>
                <summary>
                  {sender.name || 'your details'} <span className="dim">(saved for every document)</span>
                </summary>
                <div className="grid">
                  <Field label="NAME" wide>
                    <input value={sender.name} onChange={(e) => editSender({ name: e.target.value })} />
                  </Field>
                  <Field label="EMAIL">
                    <input value={sender.email} onChange={(e) => editSender({ email: e.target.value })} />
                  </Field>
                  <Field label="PHONE">
                    <input value={sender.phone} onChange={(e) => editSender({ phone: e.target.value })} />
                  </Field>
                  <Field label="WEBSITE">
                    <input value={sender.website} onChange={(e) => editSender({ website: e.target.value })} />
                  </Field>
                  <Field label="TAX_ID">
                    <input value={sender.taxId} onChange={(e) => editSender({ taxId: e.target.value })} />
                  </Field>
                  <Field label="ADDRESS" wide>
                    <textarea rows={3} value={sender.address} onChange={(e) => editSender({ address: e.target.value })} />
                  </Field>
                  <Field label="BANK_DETAILS" wide>
                    <textarea
                      rows={4}
                      value={sender.bank}
                      placeholder={'Bank: …\nCLABE / IBAN: …\nSWIFT: …'}
                      onChange={(e) => editSender({ bank: e.target.value })}
                    />
                  </Field>
                  <Field label="MARK">
                    <input
                      value={sender.mark}
                      placeholder="W. F. D. (editorial)"
                      onChange={(e) => editSender({ mark: e.target.value })}
                    />
                  </Field>
                  <Field label="INVOICE_PREFIX">
                    <input
                      value={settings.prefix}
                      onChange={(e) => setSettings((s) => ({ ...s, prefix: e.target.value }))}
                    />
                  </Field>
                  <Field label="RECEIPT_PREFIX">
                    <input
                      value={settings.receiptPrefix}
                      onChange={(e) => setSettings((s) => ({ ...s, receiptPrefix: e.target.value }))}
                    />
                  </Field>
                  <Field label="LOGO (mono)" wide>
                    <div className="logo-row">
                      <input type="file" accept="image/*" onChange={(e) => loadLogo(e.target.files?.[0])} />
                      {sender.logo && (
                        <button className="dim" onClick={() => editSender({ logo: '' })}>
                          [REMOVE]
                        </button>
                      )}
                    </div>
                  </Field>
                </div>
              </details>
            </Section>

            <footer className="status">
              <div>
                TOTAL: <span className="hi">[{money(t.total, invoice.currency)}]</span>
              </div>
              <div>
                ITEMS: <span className="hi">[{invoice.items.length}]</span>
              </div>
              <div>
                NEXT_NO: <span className="hi">[{upcoming}]</span>
              </div>
              <div>
                SAVED_CLIENTS: <span className="hi">[{clients.length}]</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      <div className="print-root">{paper}</div>
    </>
  )
}
