'use client'

import { useState, useEffect } from 'react'
import { RetellWebClient } from 'retell-client-js-sdk'

type CallState = 'idle' | 'connecting' | 'active' | 'ending'

export default function CallButton() {
  const [state, setState] = useState<CallState>('idle')
  const [client, setClient] = useState<RetellWebClient | null>(null)
  const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID

  useEffect(() => {
    if (!agentId) return
    const retell = new RetellWebClient()

    retell.on('call_started', () => setState('active'))
    retell.on('call_ended', () => setState('idle'))
    retell.on('error', () => setState('idle'))

    setClient(retell)
    return () => { retell.stopCall() }
  }, [agentId])

  const startCall = async () => {
    if (!client || !agentId) return
    setState('connecting')
    try {
      const res = await fetch('/api/retell/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })
      const { data } = await res.json()
      await client.startCall({ accessToken: data.accessToken })
    } catch {
      setState('idle')
    }
  }

  const endCall = () => {
    setState('ending')
    client?.stopCall()
  }

  if (!agentId) return null

  if (state === 'active') {
    return (
      <button
        onClick={endCall}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-semibold transition animate-pulse"
      >
        <span className="w-2.5 h-2.5 bg-white rounded-full" />
        End Call
      </button>
    )
  }

  return (
    <button
      onClick={startCall}
      disabled={state === 'connecting' || state === 'ending'}
      className="flex items-center gap-2 bg-ember hover:bg-orange-700 text-white px-5 py-3 rounded-full font-semibold transition disabled:opacity-60"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
      {state === 'connecting' ? 'Connecting…' : 'Call Us'}
    </button>
  )
}
