import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export function generateInvoicePDF(invoiceData, outDir='tmp') {
  const doc = new PDFDocument({ margin: 50 })
  const name = `invoice-${Date.now()}.pdf`
  const file = path.join(outDir, name)
  fs.mkdirSync(outDir, { recursive: true })
  const stream = fs.createWriteStream(file)
  doc.pipe(stream)
  doc.fontSize(20).text('Invoice', { align: 'center' })
  doc.moveDown().fontSize(12).text(JSON.stringify(invoiceData, null, 2))
  doc.end()
  return new Promise((resolve) => stream.on('finish', () => resolve({ path: file, name })))
}
