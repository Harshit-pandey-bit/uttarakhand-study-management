'use client'

import React, { useState, useEffect } from 'react'

interface Notification {
  id: number
  message: string
  read: boolean
  timestamp: Date
}

export const NotificationBell: React.FC<{ notifications?: Notification[] }> = ({ notifications = [] }) => {
  const [notifList, setNotifList] = useState(notifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifList.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifList(nlist => nlist.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    // Example: Add new notifications every 30 seconds (simulate live)
    const interval = setInterval(() => {
      setNotifList(nlist => [
        ...nlist,
        {
          id: nlist.length + 1,
          message: 'This is update #${nlist.length + 1}',
          read: false,
          timestamp: new Date()
        }
      ])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative inline-block">
      <button
        className="relative p-2 rounded-full hover:bg-gray-200"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.64 5.36 6 7.929 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-block w-3 h-3 rounded-full bg-red-600 border-2 border-white"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50">
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="font-semibold text-sm">Notifications</span>
            <button onClick={markAllRead} className="text-xs underline text-blue-600 hover:text-blue-800">Mark all read</button>
          </div>
          <ul className="max-h-64 overflow-auto">
            {notifList.length === 0 && <li className="p-3 text-gray-500 text-sm">No notifications</li>}
            {notifList.map(n => (
              <li key={n.id} className={`px-4 py-2 border-b cursor-pointer ${n.read ? 'bg-white' : 'bg-blue-50 font-medium'}`}>
                {n.message}
                <div className="text-xs text-gray-400">{n.timestamp.toLocaleTimeString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}