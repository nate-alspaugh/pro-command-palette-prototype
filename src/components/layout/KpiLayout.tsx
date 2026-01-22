import React from 'react'
import DataTable from './DataTable'

interface KpiItem {
  label: string
  value: string
  colorClass?: string
}

interface DataTableItem {
  label: string
  value: string
  colorClass?: string
}

interface KpiLayoutProps {
  kpis: KpiItem[]
  tableItems: DataTableItem[]
}

export default function KpiLayout({ kpis, tableItems }: KpiLayoutProps) {
  return (
    <div className="momentum-layout">
      <div className="momentum-boxes">
        {kpis.map((kpi, index) => (
          <div key={index} className="stat-box">
            <span className={`stat-val tabular-nums ${kpi.colorClass || ''}`}>{kpi.value}</span>
            <span className="stat-lbl">{kpi.label}</span>
          </div>
        ))}
      </div>
      <DataTable items={tableItems} />
    </div>
  )
}
