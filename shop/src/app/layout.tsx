import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
