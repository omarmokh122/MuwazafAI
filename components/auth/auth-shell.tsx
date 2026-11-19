'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

type AuthShellProps = {
  eyebrow: string
  title: string
  subtitle: string
  bullets: string[]
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  bullets,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-el-white lg:grid lg:grid-cols-[minmax(0,460px)_1fr]">
      <aside className="relative hidden overflow-hidden bg-el-black px-12 py-14 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg text-white/90 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="h-9 w-9 overflow-hidden rounded-[10px]">
              <Logo />
            </span>
            <span className="text-[17px] font-medium tracking-tight">Muwaazaf</span>
          </Link>

          <div className="mt-20 max-w-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-[40px] font-light leading-[1.08] tracking-[-0.02em]">
              {title}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">{subtitle}</p>
          </div>

          <ul className="mt-12 space-y-4">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-[14px] text-white/70">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Check className="h-3 w-3 text-white" aria-hidden="true" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-12">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-[12px] leading-relaxed text-white/55">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden="true" />
              <p>
                Sessions are signed server-side, transmitted over HTTPS, and your CV stays in
                your browser workspace unless you choose to export it.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="h-8 w-8 overflow-hidden rounded-lg">
                <Logo />
              </span>
              <span className="text-[16px] font-medium tracking-tight">Muwaazaf</span>
            </Link>
          </div>

          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-el-dark-gray transition-colors hover:text-el-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-black/20 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-el-black">
              {title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-el-dark-gray">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-8">{footer}</div> : null}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
