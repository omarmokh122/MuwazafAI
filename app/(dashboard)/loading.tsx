export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12" aria-busy="true" aria-live="polite">
      <div className="space-y-3 border-b border-el-border-light pb-7">
        <div className="h-3 w-32 animate-pulse rounded-full bg-el-light-gray" />
        <div className="h-8 w-64 animate-pulse rounded-lg bg-el-light-gray" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-el-near-white" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="rounded-2xl border border-el-border-light bg-white p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-el-light-gray" />
            <div className="mt-4 h-7 w-16 animate-pulse rounded-lg bg-el-near-white" />
            <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-el-near-white" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="h-[360px] animate-pulse rounded-2xl border border-el-border-light bg-white lg:col-span-3" />
        <div className="h-[360px] animate-pulse rounded-2xl border border-el-border-light bg-white lg:col-span-2" />
      </div>
      <span className="sr-only">Loading your workspace…</span>
    </div>
  )
}
