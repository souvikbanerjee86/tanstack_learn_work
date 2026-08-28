/**
 * Utility functions for client-side data export (CSV and JSON)
 */

export function exportToCSV(data: Array<Record<string, any>>, filename: string) {
  if (!data || data.length === 0) {
    return
  }

  const headers = Object.keys(data[0])
  const csvRows: Array<string> = []

  // Header row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','))

  // Value rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header]
      if (val === null || val === undefined) {
        return '""'
      }
      if (typeof val === 'object') {
        return `"${JSON.stringify(val).replace(/"/g, '""')}"`
      }
      return `"${String(val).replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'))
  const link = document.createElement('a')
  link.setAttribute('href', csvContent)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any, filename: string) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2),
  )}`
  const link = document.createElement('a')
  link.setAttribute('href', jsonString)
  link.setAttribute('download', `${filename}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
