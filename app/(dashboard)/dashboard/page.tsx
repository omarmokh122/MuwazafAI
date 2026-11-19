'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileSearch,
  GraduationCap,
  ListTodo,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserProfile } from '@/lib/store/user-profile'
import { useInterviewStore } from '@/lib/store/interview-store'

type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

type JobApplication = {
  id: string
  company: string
  title: string
  location: string
  status: JobStatus
  date: string
}

const STATUS_ORDER: JobStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected']
const STATUS_COLORS: Record<JobStatus, string> = {
  Saved: '#94a3b8',
  Applied: '#3b82f6',
  Interviewing: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
}

function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === 'string' && STATUS_ORDER.includes(value as JobStatus)
}

function readJobs(): JobApplication[] {
  try {
    const raw = window.localStorage.getItem('muwaazaf_tracker_jobs')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (job): job is JobApplication =>
        job &&
        typeof job.id === 'string' &&
        typeof job.company === 'string' &&
        typeof job.title === 'string' &&
        isJobStatus(job.status)
    )
  } catch {
    return []
  }
}

function daysSince(value: string): number {
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return 0
  return Math.floor((Date.now() - time) / 86_400_000)
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const subscribeToNothing = () => () => {}

export default function DashboardHome() {
  const { fullName, targetRole, field, cvText } = useUserProfile()
  const { matching, gaps } = useInterviewStore()
  const isLoaded = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
  const jobs = useMemo(() => (isLoaded ? readJobs() : []), [isLoaded])

  const stats = useMemo(() => {
    const byStatus = STATUS_ORDER.map((status) => ({
      status,
      count: jobs.filter((job) => job.status === status).length,
    }))
    const interviews = jobs.filter((job) => job.status === 'Interviewing').length
    const offers = jobs.filter((job) => job.status === 'Offer').length
    const stale = jobs.filter(
      (job) => job.status === 'Applied' && daysSince(job.date) >= 14
    ).length
    return { byStatus, interviews, offers, stale, total: jobs.length }
  }, [jobs])

  const firstName = (fullName || '').trim().split(/\s+/)[0]
  const hasCv = Boolean(cvText.trim())

  const nextActions = [
    {
      title: hasCv ? 'Run a CV match' : 'Add your CV',
      description: hasCv
        ? 'Score your CV against a live job description.'
        : 'Upload or paste your CV to unlock every AI tool.',
      href: hasCv ? '/scout' : '/profile',
      icon: hasCv ? FileSearch : Sparkles,
      done: hasCv,
    },
    {
      title: jobs.length ? 'Review your pipeline' : 'Track your first application',
      description: jobs.length
        ? `${jobs.length} role${jobs.length === 1 ? '' : 's'} in your tracker.`
        : 'Keep every application and its status in one board.',
      href: '/tracker',
      icon: ListTodo,
      done: jobs.length > 0,
    },
    {
      title: matching.length || gaps.length ? 'Practice your gaps' : 'Prep an interview',
      description:
        matching.length || gaps.length
          ? `${gaps.length} gap${gaps.length === 1 ? '' : 's'} identified from your last analysis.`
          : 'Generate a tailored prep guide for a target role.',
      href: '/interview-prep',
      icon: GraduationCap,
      done: matching.length > 0 && gaps.length === 0,
    },
  ]

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <section className="flex flex-col gap-5 border-b border-el-border-light pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-el-warm-gray">
            {isLoaded
              ? new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Workspace overview'}
          </p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-el-black md:text-[34px]">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}.
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-el-dark-gray">
            {targetRole
              ? `Your workspace is tuned for ${targetRole}${field ? ` roles in ${field}` : ''}.`
              : 'Tell us your target role in your profile so the AI can tailor every result.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="h-11 rounded-xl bg-el-black px-5 text-[13px] font-semibold text-white shadow-none hover:bg-el-dark-gray"
          >
            <Link href="/scout">
              Match a job <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-el-border-light bg-white px-5 text-[13px] font-medium text-el-black shadow-none hover:bg-el-near-white"
          >
            <Link href="/profile">Update profile</Link>
          </Button>
        </div>
      </section>

      <section aria-label="Pipeline summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Tracked roles',
            value: stats.total,
            hint: stats.total ? 'Across all stages' : 'Add your first role',
            icon: Briefcase,
          },
          {
            label: 'Active interviews',
            value: stats.interviews,
            hint: stats.interviews ? 'In progress now' : 'None scheduled yet',
            icon: CheckCircle2,
          },
          {
            label: 'Offers',
            value: stats.offers,
            hint: stats.offers ? 'Congratulations' : 'Keep going',
            icon: Target,
          },
          {
            label: 'Needs follow-up',
            value: stats.stale,
            hint: stats.stale ? 'Applied 14+ days ago' : 'Pipeline is fresh',
            icon: Clock,
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-el-border-light bg-white shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-el-warm-gray">
                  {stat.label}
                </p>
                <stat.icon className="h-4 w-4 text-el-warm-gray" aria-hidden="true" />
              </div>
              <p className="mt-3 text-[28px] font-semibold leading-none text-el-black">
                {isLoaded ? stat.value : '—'}
              </p>
              <p className="mt-2 text-[12px] text-el-dark-gray">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-el-border-light bg-white shadow-none lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-[16px] font-semibold text-el-black">
              Application pipeline
            </CardTitle>
            <CardDescription className="text-[13px] text-el-dark-gray">
              Distribution of the roles in your tracker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded && stats.total === 0 ? (
              <div className="flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-el-border-light bg-el-near-white/60 px-6 text-center">
                <Briefcase className="h-6 w-6 text-el-warm-gray" aria-hidden="true" />
                <p className="mt-3 text-[14px] font-medium text-el-black">No applications yet</p>
                <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-el-dark-gray">
                  Add a role you are targeting and move it through the stages as you hear back.
                </p>
                <Button
                  asChild
                  className="mt-4 h-9 rounded-lg bg-el-black px-4 text-[12px] font-semibold text-white shadow-none hover:bg-el-dark-gray"
                >
                  <Link href="/tracker">Open tracker</Link>
                </Button>
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byStatus} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                    <XAxis
                      dataKey="status"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      dy={8}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#a8a29e', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#fafaf9' }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e7e5e4',
                        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.15)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Roles" radius={[6, 6, 0, 0]} barSize={34}>
                      {stats.byStatus.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-el-border-light bg-white shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-[16px] font-semibold text-el-black">Next best actions</CardTitle>
            <CardDescription className="text-[13px] text-el-dark-gray">
              Small steps that keep your search moving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-el-border-light hover:bg-el-near-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-black/20"
              >
                <span
                  className={
                    action.done
                      ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'
                      : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-el-light-gray text-el-dark-gray'
                  }
                >
                  <action.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-el-black">{action.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-el-warm-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-el-dark-gray">
                    {action.description}
                  </span>
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-el-border-light bg-white shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] font-semibold text-el-black">Skill readiness</CardTitle>
          <CardDescription className="text-[13px] text-el-dark-gray">
            Based on your latest CV match and interview prep analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matching.length === 0 && gaps.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-xl bg-el-near-white/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <TriangleAlert className="h-5 w-5 text-el-warm-gray" aria-hidden="true" />
                <p className="text-[13px] text-el-dark-gray">
                  Run a job match to see which skills align and where to focus next.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-9 rounded-lg border-el-border-light bg-white px-4 text-[12px] font-medium text-el-black shadow-none hover:bg-el-near-white"
              >
                <Link href="/scout">Start a match</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  Matching strengths
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {matching.length ? (
                    matching.slice(0, 10).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-el-warm-gray">None recorded yet.</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Skill gaps
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {gaps.length ? (
                    gaps.slice(0, 10).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-el-warm-gray">No gaps recorded.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
