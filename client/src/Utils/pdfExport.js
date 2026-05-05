import jsPDF from "jspdf"
import "jspdf-autotable"

export function exportToPdf(data, filename = "data.pdf") {
  if (!data || !data.length) {
    console.error("No data to export")
    return
  }

  const doc = new jsPDF()
  const headers = Object.keys(data[0])
  const rows = data.map((item) => headers.map((h) => item[h]))

  doc.text("Report Export", 14, 16)
  doc.autoTable({
    startY: 20,
    head: [headers],
    body: rows,
  })

  doc.save(filename)
}
