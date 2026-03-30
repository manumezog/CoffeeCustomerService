import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import VoiceflowWidget from '@/components/VoiceflowWidget'

export const metadata: Metadata = {
  title: 'Ember & Roast - Specialty Coffee',
  description: 'Premium specialty coffee roaster with multi-channel customer service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <VoiceflowWidget />
      </body>
    </html>
  )
}
