import { amount, lines, money, qty, shortDate, totals } from '../lib/invoice'
import type { TemplateProps } from '../lib/types'

export function Mono({ invoice, sender }: TemplateProps) {
  const t = totals(invoice)
  const senderLine = [sender.name, ...lines(sender.address)].join(', ')

  return (
    <div className="paper mo">
      <div className="mo-head">
        <div>
          <div className="mo-sender">{senderLine}</div>
          <div className="m">
            <div>{invoice.client.name}</div>
            {lines(invoice.client.address).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            {invoice.client.taxId && <div>{invoice.client.taxId}</div>}
          </div>
        </div>
        {sender.logo && <img className="mo-logo" src={sender.logo} alt="" />}
      </div>

      <div className="mo-grid mo-meta">
        <div>
          <div className="mo-label">Date</div>
          <div className="m">{shortDate(invoice.issued)}</div>
        </div>
        <div>
          <div className="mo-label">Invoice-No.</div>
          <div className="m">{invoice.number}</div>
        </div>
        <div>
          <div className="mo-label">Due</div>
          <div className="m">{shortDate(invoice.due)}</div>
        </div>
        <div>
          <div className="mo-label">Page</div>
          <div className="m">1/1</div>
        </div>
      </div>

      <div className="mo-grid mo-thead">
        <div className="mo-label">Service</div>
        <div className="mo-label">Qty × Rate</div>
        <div />
        <div className="mo-label">Amount</div>
      </div>
      {invoice.items.map((item) => (
        <div className="mo-grid mo-row" key={item.id}>
          <div>
            <div className="m">{item.description}</div>
            {item.detail && <div className="mo-detail">{item.detail}</div>}
          </div>
          <div className="m">
            {qty(item.qty)} × {amount(item.price, invoice.currency)}
          </div>
          <div />
          <div className="m">{money(item.qty * item.price, invoice.currency)}</div>
        </div>
      ))}

      <div className="mo-totals">
        {t.hasTax && (
          <>
            <div className="mo-grid mo-trow">
              <div />
              <div />
              <div className="m">Subtotal</div>
              <div className="m">{money(t.subtotal, invoice.currency)}</div>
            </div>
            <div className="mo-grid mo-trow">
              <div />
              <div />
              <div className="m">
                {invoice.taxLabel} {invoice.taxRate}%
              </div>
              <div className="m">{money(t.tax, invoice.currency)}</div>
            </div>
          </>
        )}
        <div className="mo-grid mo-trow mo-total">
          <div />
          <div />
          <div className="m">TOTAL</div>
          <div className="m">{money(t.total, invoice.currency)}</div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mo-grid mo-notes">
          <div />
          <div className="mo-span">{invoice.notes}</div>
        </div>
      )}

      <div className="mo-grid mo-foot">
        <div>
          {sender.name.split(/\s+/).map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>
        <div>
          {lines(sender.address).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
          {sender.phone && <div>{sender.phone}</div>}
          {sender.email && <div>{sender.email}</div>}
          {sender.website && <div>{sender.website}</div>}
        </div>
        <div>
          {sender.taxId && <div>{sender.taxId}</div>}
          {lines(sender.bank).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
