'use client'

import React, { useState, useEffect, useCallback } from 'react'

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

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  voice: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>Voice</title>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
    </svg>
  ),
  webchat: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>Webchat</title>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>Email</title>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  chat: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>Webchat</title>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
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
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-4 animate-pulse h-24" />
            <div className="bg-amber-50 rounded-xl p-4 animate-pulse h-24" />
            <div className="bg-amber-50 rounded-xl p-4 animate-pulse h-24" />
          </div>
        ) : escalations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-success" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <title>All clear</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
              </svg>
            </div>
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
