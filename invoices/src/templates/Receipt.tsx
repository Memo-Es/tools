import { amount, lines, money, qty, totals } from '../lib/invoice'
import { amountInWords, placeAndDate, receiptSentence, receiptText } from '../lib/receipt'
import type { Party, TemplateProps } from '../lib/types'

type Text = (typeof receiptText)[keyof typeof receiptText]

function PartyBlock({ title, party, text }: { title: string; party: Party; text: Text }) {
  const rows = [
    [text.name, party.name],
    [text.taxId, party.taxId],
    [text.address, party.address],
  ].filter(([, v]) => v)
  return (
    <div>
      <div className="gr-head gr-dim">{title}</div>
      <dl className="gr-kv">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>
              {lines(v).map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// One layout, in the Grotesk family, because a receipt is signed and kept
// rather than branded. The person who received the money is the one who signs.
export function Receipt({ invoice, sender }: TemplateProps) {
  const r = invoice.receipt
  const text = receiptText[r.lang]
  const t = totals(invoice)
  const n = invoice.number.match(/\d+$/)?.[0] ?? invoice.number
  const payee = r.role === 'payee' ? sender : invoice.client
  const payer = r.role === 'payee' ? invoice.client : sender
  const concept = r.concept.trim() || invoice.items.map((i) => i.description).filter(Boolean).join(', ')

  return (
    <div className="paper gr rc">
      <div className="gr-big">{r.title.trim() || text.title}</div>

      <div className="gr-2 gr-parties">
        <PartyBlock title={text.payee} party={payee} text={text} />
        <PartyBlock title={text.payer} party={payer} text={text} />
      </div>

      <p className="rc-body">
        {receiptSentence(r.lang, {
          payer: payer.name || '—',
          total: money(t.total, invoice.currency),
          words: amountInWords(t.total, invoice.currency, r.lang),
          concept,
          method: r.method.trim(),
        })}
      </p>

      <div className="rc-table">
        <div className="rc-row rc-th gr-dim">
          <div>{text.description}</div>
          <div className="rc-num">{text.qty}</div>
          <div className="rc-num">{text.price}</div>
          <div className="rc-num">{text.amount}</div>
        </div>
        {invoice.items.map((item) => (
          <div className="rc-row" key={item.id}>
            <div>
              <div>{item.description}</div>
              {item.detail && <div className="gr-dim">{item.detail}</div>}
            </div>
            <div className="rc-num">{qty(item.qty)}</div>
            <div className="rc-num">{amount(item.price, invoice.currency)}</div>
            <div className="rc-num">{amount(item.qty * item.price, invoice.currency)}</div>
          </div>
        ))}
        {t.hasTax && (
          <>
            <div className="rc-row rc-sub">
              <div>{text.subtotal}</div>
              <div />
              <div />
              <div className="rc-num">{amount(t.subtotal, invoice.currency)}</div>
            </div>
            <div className="rc-row rc-sub">
              <div>
                {invoice.taxLabel} {invoice.taxRate}%
              </div>
              <div />
              <div />
              <div className="rc-num">{amount(t.tax, invoice.currency)}</div>
            </div>
          </>
        )}
        <div className="rc-row rc-total">
          <div>
            {text.total} ({invoice.currency})
          </div>
          <div />
          <div />
          <div className="rc-num">{amount(t.total, invoice.currency)}</div>
        </div>
      </div>

      <div className="gr-2 rc-sign">
        <div>
          <div className="gr-num">#{n}</div>
          <div className="gr-dim rc-place">{placeAndDate(r.lang, r.place.trim(), invoice.issued)}</div>
        </div>
        <div className="rc-line">
          <div>{payee.name}</div>
          <div className="gr-dim">{text.signature}</div>
        </div>
      </div>

      {invoice.notes.trim() && <div className="gr-foot rc-notes">{invoice.notes}</div>}
    </div>
  )
}
