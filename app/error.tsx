'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-el-white px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-el-light-gray">
        <TriangleAlert className="h-5 w-5 text-el-dark-gray" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-[26px] font-semibold tracking-[-0.02em] text-el-black">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-el-dark-gray">
        An unexpected error interrupted this page. Nothing in your saved workspace was affected.
      </p>
      {error.digest ? (
        <p className="mt-2 text-[11px] text-el-warm-gray">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={reset}
          className="h-11 rounded-xl bg-el-black px-5 text-[13px] font-semibold text-white shadow-none hover:bg-el-dark-gray"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-xl border-el-border-light bg-white px-5 text-[13px] font-medium text-el-black shadow-none hover:bg-el-near-white"
        >
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
