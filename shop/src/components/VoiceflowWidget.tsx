'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: Record<string, unknown>) => void
        open: () => void
      }
    }
  }
}

export default function VoiceflowWidget() {
  const projectId = process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID

  useEffect(() => {
    if (!projectId) return

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => {
      window.voiceflow?.chat.load({
        verify: { projectID: projectId },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        assistant: {
          title: 'Ember & Roast Support',
          description: 'Ask me anything about your orders, returns, or our coffee.',
          color: '#c2410c',
        },
      })
    }
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs'
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [projectId])

  return null
}
