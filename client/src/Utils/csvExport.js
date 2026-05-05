export function exportToCsv(data, filename = "data.csv") {
  if (!data || !data.length) {
    console.error("No data to export")
    return
  }

  const csvRows = []
  const headers = Object.keys(data[0])
  csvRows.push(headers.join(","))

  for (const row of data) {
    const values = headers.map((h) => JSON.stringify(row[h] ?? ""))
    csvRows.push(values.join(","))
  }

  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" })
  const url = window.URL.createObjectURL(csvData)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
