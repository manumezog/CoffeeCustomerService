'use client'

import { useState, useEffect, useCallback } from 'react'

interface Escalation {
  id: string
  channel: 'voice' | 'chat' | 'email'
  customerName?: string
  customerEmail?: string
  orderId?: string
  reason: string
  sentiment: number
  transcript: string
  recommendedAction: string
  status: 'open' | 'claimed' | 'resolved'
  createdAt: string
}

const CHANNEL_ICON: Record<string, string> = {
  voice: '📞',
  chat: '💬',
  email: '✉️',
}

const SENTIMENT_COLOR = (s: number) => {
  if (s < 0.3) return 'text-red-600'
  if (s < 0.5) return 'text-amber-600'
  return 'text-green-600'
}

export default function AdminPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchEscalations = useCallback(async () => {
    try {
      const res = await fetch('/api/cs/escalation')
      const json = await res.json()
      if (json.data) setEscalations(json.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEscalations()
    const interval = setInterval(fetchEscalations, 30000)
    return () => clearInterval(interval)
  }, [fetchEscalations])

  const updateStatus = async (id: string, status: 'claimed' | 'resolved') => {
    setUpdating(id)
    try {
      await fetch('/api/cs/escalation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setEscalations(prev => prev.filter(e => e.id !== id))
    } finally {
      setUpdating(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-roast font-heading">Escalation Dashboard</h1>
            <p className="text-gray-500 mt-1">Open escalations requiring human attention</p>
          </div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-lg">
            {escalations.length} open
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading escalations...</div>
        ) : escalations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-xl text-gray-600 font-medium">All clear — no open escalations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {escalations.map(e => (
              <div key={e.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{CHANNEL_ICON[e.channel]}</span>
                        <span className="font-semibold text-roast">
                          {e.customerName ?? 'Unknown Customer'}
                        </span>
                        {e.orderId && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-mono">
                            {e.orderId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{e.reason}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(e.createdAt).toLocaleString()}
                        {e.customerEmail && ` · ${e.customerEmail}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-semibold ${SENTIMENT_COLOR(e.sentiment)}`}>
                        Sentiment: {(e.sentiment * 100).toFixed(0)}%
                      </span>
                      <button
                        onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                        className="text-sm text-amber-700 hover:underline"
                      >
                        {expanded === e.id ? 'Hide' : 'View'} transcript
                      </button>
                      <button
                        onClick={() => updateStatus(e.id, 'claimed')}
                        disabled={updating === e.id}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded transition disabled:opacity-50"
                      >
                        Claim
                      </button>
                      <button
                        onClick={() => updateStatus(e.id, 'resolved')}
                        disabled={updating === e.id}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded transition disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-900">
                    <strong>Recommended action:</strong> {e.recommendedAction}
                  </div>
                </div>

                {expanded === e.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Conversation Transcript</h3>
                    <div className="space-y-2">
                      {e.transcript.split('\n').map((line, i) => {
                        const isAgent = line.startsWith('agent:')
                        return (
                          <div key={i} className={`text-sm px-3 py-1.5 rounded ${isAgent ? 'bg-amber-50 text-amber-900' : 'bg-white text-gray-800 border border-gray-200'}`}>
                            <span className="font-semibold capitalize">{line.split(':')[0]}:</span>
                            {line.slice(line.indexOf(':') + 1)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
