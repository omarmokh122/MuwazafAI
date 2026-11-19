import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-el-white px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-el-light-gray">
        <Compass className="h-5 w-5 text-el-dark-gray" aria-hidden="true" />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-el-warm-gray">
        404
      </p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-el-black">
        This page could not be found
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-el-dark-gray">
        The link may be outdated or the page may have moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-xl bg-el-black px-5 text-[13px] font-semibold text-white transition-colors hover:bg-el-dark-gray"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-el-border-light bg-white px-5 text-[13px] font-medium text-el-black transition-colors hover:bg-el-near-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
