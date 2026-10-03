import { amount, lines, longDate, markOf, money, qty, totals } from '../lib/invoice'
import type { TemplateProps } from '../lib/types'

export function Editorial({ invoice, sender }: TemplateProps) {
  const t = totals(invoice)
  const contact = [
    ['Phone', sender.phone],
    ['Mail', sender.email],
    ['Web', sender.website],
  ].filter(([, v]) => v)

  return (
    <div className="paper ed">
      <div className="ed-top sans">
        <span>{sender.name}</span>
        <span>Invoice {invoice.number}</span>
        <span>{longDate(invoice.issued)}</span>
      </div>
      <dl className="ed-contact sans">
        {contact.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="ed-mark">
        {markOf(sender).map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>

      <div className="ed-billto sans">
        <span className="ed-label">Bill to</span>
        <div>
          <strong>{invoice.client.name}</strong>
          {lines(invoice.client.address).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.taxId && <div>{invoice.client.taxId}</div>}
        </div>
      </div>

      <table className="ed-table">
        <thead className="sans">
          <tr>
            <th>Description</th>
            <th className="num">Quantity</th>
            <th className="num">Unit price</th>
            <th className="num">Amount ({invoice.currency})</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="ed-item">{item.description}</div>
                {item.detail && <div className="ed-detail">{item.detail}</div>}
              </td>
              <td className="num">{qty(item.qty)}</td>
              <td className="num">{amount(item.price, invoice.currency)}</td>
              <td className="num">{amount(item.qty * item.price, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="ed-totals">
        {t.hasTax && (
          <>
            <div>
              <dt>Subtotal</dt>
              <dd>{amount(t.subtotal, invoice.currency)}</dd>
            </div>
            <div>
              <dt>
                {invoice.taxLabel} {invoice.taxRate}%
              </dt>
              <dd>{amount(t.tax, invoice.currency)}</dd>
            </div>
          </>
        )}
        <div className="ed-total">
          <dt>Total ({invoice.currency})</dt>
          <dd>{amount(t.total, invoice.currency)}</dd>
        </div>
      </dl>

      <div className="ed-bottom">
        <div className="ed-due">
          Due {longDate(invoice.due)} · {money(t.total, invoice.currency)}
        </div>
        <div className="ed-pay sans">
          <div>
            Please issue payment to:
            <br />
            {sender.name}
            {sender.taxId && (
              <>
                <br />
                {sender.taxId}
              </>
            )}
          </div>
          <div>
            {lines(sender.bank).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <div>
            {lines(sender.address).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
        {invoice.notes && <p className="ed-notes sans">{invoice.notes}</p>}
        <div className="ed-foot sans">
          <span>{sender.website || sender.email}</span>
          <span>1 (1)</span>
        </div>
      </div>
    </div>
  )
}
