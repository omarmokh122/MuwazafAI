import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Muwaazaf | Autonomous AI Career Agent',
  description: 'An autonomous AI career agent for Lebanon\'s lost generation of graduates. Hunt, diagnose, train, and apply with visible reasoning.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
