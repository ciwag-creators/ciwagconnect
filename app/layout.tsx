import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VTU Platform',
  description: 'Fast & reliable VTU services'
}

export default function RootLayout({
  children
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