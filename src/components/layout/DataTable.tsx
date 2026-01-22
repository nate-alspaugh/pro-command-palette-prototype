import React from 'react'

interface DataTableItem {
  label: string
  value: string
  colorClass?: string
}

interface DataTableProps {
  items: DataTableItem[]
}

export default function DataTable({ items }: DataTableProps) {
  return (
    <div className="data-list">
      {items.map((item, index) => (
        <div key={index} className="data-row">
          <span>{item.label}</span>
          <strong className={`tabular-nums ${item.colorClass || ''}`}>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}
