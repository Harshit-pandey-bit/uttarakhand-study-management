'use client'

import React from 'react'

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  sortable?: boolean
  filterable?: boolean
  pagination?: boolean
  pageSize?: number
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  className
}: DataTableProps<T>) {
  // Minimal client-side table for MVP; add filter/sort/pagination as needed
  const [page, setPage] = React.useState(0)
  const paginated = pagination ? data.slice(page * pageSize, (page + 1) * pageSize) : data

  return (
    <div className={className}>
      <table className="min-w-full border divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, idx) => (
            <tr key={idx} className="border-b">
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-2 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex justify-end items-center space-x-2 mt-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            disabled={page === 0}
          >Prev</button>
          <span className="text-xs">{page + 1} / {Math.ceil(data.length / pageSize)}</span>
          <button
            onClick={() => setPage(p => Math.min(Math.ceil(data.length / pageSize) - 1, p + 1))}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            disabled={page + 1 === Math.ceil(data.length / pageSize)}
          >Next</button>
        </div>
      )}
    </div>
  )
}