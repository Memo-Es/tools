import { useEffect, useRef, useState, type ReactNode } from 'react'

const PAPER_W = 794 // 210mm at 96dpi
const PAPER_H = 1123 // 297mm

// Scales the A4 page down so the whole sheet fits in the pane.
export function Preview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(1, width / PAPER_W, height / PAPER_H))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="preview-fit">
      <div className="paper-frame" style={{ width: PAPER_W * scale, height: PAPER_H * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  )
}
