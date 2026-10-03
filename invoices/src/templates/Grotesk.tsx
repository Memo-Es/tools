import { amount, lines, longDate, money, totals } from '../lib/invoice'
import type { Party, TemplateProps } from '../lib/types'

function PartyBlock({ title, party }: { title: string; party: Party }) {
  const rows = [
    ['Name', party.name],
    ['Email', party.email],
    ['Tax ID', party.taxId],
    ['Address', party.address],
  ].filter(([, v]) => v)
  return (
    <div>
      <div className="gr-head">{title}</div>
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

export function Grotesk({ invoice, sender }: TemplateProps) {
  const t = totals(invoice)
  const n = invoice.number.match(/\d+$/)?.[0] ?? invoice.number

  return (
    <div className="paper gr">
      <div className="gr-2 gr-big">
        <span>{sender.name}</span>
        <span>Invoice</span>
      </div>

      <div className="gr-2 gr-parties">
        <PartyBlock title="From" party={sender} />
        <PartyBlock title="To" party={invoice.client} />
      </div>

      <div className="gr-big gr-services">Services</div>
      {invoice.items.map((item) => (
        <div className="gr-2 gr-item" key={item.id}>
          <div>
            <div>
              {item.description}
              {item.qty !== 1 && (
                <span className="gr-dim">
                  {' '}
                  — {item.qty} × {amount(item.price, invoice.currency)}
                </span>
              )}
            </div>
            {item.detail && <div>{item.detail}</div>}
          </div>
          <dl className="gr-kv">
            <div>
              <dt />
              <dd>{amount(item.qty * item.price, invoice.currency)}</dd>
            </div>
          </dl>
        </div>
      ))}

      <div className="gr-2 gr-totals">
        <div />
        <dl className="gr-kv">
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
          <div className="gr-total">
            <dt>Total {invoice.currency}</dt>
            <dd>{money(t.total, invoice.currency)}</dd>
          </div>
        </dl>
      </div>

      <div className="gr-2 gr-number">
        <div className="gr-num">#{n}</div>
        <dl className="gr-kv gr-tiny">
          <div>
            <dt>Invoice Number</dt>
            <dd>{invoice.number}</dd>
          </div>
          <div>
            <dt>Invoice Date</dt>
            <dd>{longDate(invoice.issued)}</dd>
          </div>
        </dl>
      </div>

      <div className="gr-2 gr-pay">
        <div>
          <div className="gr-head">Bank Details</div>
          <div>
            {lines(sender.bank).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="gr-head">Terms</div>
          <dl className="gr-kv">
            <div>
              <dt>Due Date</dt>
              <dd>{longDate(invoice.due)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="gr-2 gr-foot">
        <span>{invoice.notes}</span>
        <span>Page 1/1</span>
      </div>
    </div>
  )
}
