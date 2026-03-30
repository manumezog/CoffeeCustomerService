'use client'

import { useState } from 'react'
import type { Order, OrderItem } from '@/lib/firestore'

export default function OrdersPage() {
  const [searchId, setSearchId] = useState('')
  const [foundOrder, setFoundOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async () => {
    if (!searchId.trim()) return
    setLoading(true)
    setNotFound(false)
    setFoundOrder(null)

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchId.trim())}`)
      const json = (await res.json()) as { data: Order | null; error: string | null }

      if (res.ok && json.data) {
        setFoundOrder(json.data)
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'roasting':
        return 'bg-amber-100 text-amber-800'
      case 'return_requested':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'return_requested':
        return 'Return Requested'
      case 'roasting':
        return 'Roasting'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-roast font-heading">Track Your Order</h1>
        <p className="text-gray-600 mb-8">Enter your order ID to see the status</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="e.g., ER-10042"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              className="flex-1 px-4 py-2 border border-amber-300 rounded"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-ember hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-2 rounded transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {foundOrder && (
          <div className="border border-gray-300 rounded-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-roast font-heading">Order {foundOrder.id}</h2>
                <p className="text-gray-600">{foundOrder.customerName}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(foundOrder.status)}`}>
                {getStatusLabel(foundOrder.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-roast mb-2">Order Date</h3>
                <p className="text-gray-700">{new Date(foundOrder.createdAt).toLocaleDateString()}</p>
              </div>
              {foundOrder.estimatedDelivery && (
                <div>
                  <h3 className="font-semibold text-roast mb-2">Estimated Delivery</h3>
                  <p className="text-gray-700">{new Date(foundOrder.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
              {foundOrder.trackingNumber && (
                <div>
                  <h3 className="font-semibold text-roast mb-2">Tracking Number</h3>
                  <p className="text-gray-700 font-mono">{foundOrder.trackingNumber}</p>
                </div>
              )}
              {foundOrder.carrier && (
                <div>
                  <h3 className="font-semibold text-roast mb-2">Carrier</h3>
                  <p className="text-gray-700">{foundOrder.carrier}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-roast mb-3">Items</h3>
              {foundOrder.items.map((item: OrderItem, idx: number) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                  <span>{item.productName} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="font-semibold text-roast">Total</span>
                <span className="font-bold text-lg text-ember">${foundOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {foundOrder.notes && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900"><strong>Note:</strong> {foundOrder.notes}</p>
              </div>
            )}
          </div>
        )}

        {notFound && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <p className="text-amber-900">
              We couldn&apos;t find that order. Double-check the format — it should look like ER-10042. If you need help, ask our AI barista.
            </p>
            <a href="/" className="inline-block mt-3 text-ember hover:underline text-sm">
              Ask our AI barista →
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
