import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

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
      <body className={`${inter.variable} ${spaceMono.variable} font-sans min-h-screen bg-el-white text-el-black antialiased tracking-[0.01em]`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
