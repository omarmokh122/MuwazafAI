'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  ListTodo,
  Menu,
  MessageSquareText,
  MoveRight,
  Search,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type FocusMode = {
  key: string
  label: string
  title: string
  description: string
  bullets: string[]
  note: string
  icon: LucideIcon
}

type FeatureCard = {
  title: string
  description: string
  icon: LucideIcon
  href: string
  accent: string
}

const focusModes: FocusMode[] = [
  {
    key: 'cv',
    label: 'CV matcher',
    title: 'See what to fix before you apply',
    description:
      'Upload your CV and a job description, then get a clear summary of what matches, what is missing, and what to improve next.',
    bullets: [
      'Clear match score and plain-language feedback',
      'Save job descriptions for future reuse',
      'Open the result inline without losing your place',
    ],
    note: 'Best for the first review',
    icon: FileText,
  },
  {
    key: 'tracker',
    label: 'Job tracker',
    title: 'Keep every application moving',
    description:
      'Track each role in a clean list view, move items by drag and drop, and add the job description directly from the tracker when needed.',
    bullets: [
      'Drag and drop across stages',
      'Add notes, deadlines, and follow-up dates',
      'Open the matcher with an existing job description',
    ],
    note: 'Made for daily use',
    icon: ListTodo,
  },
  {
    key: 'interview',
    label: 'Interview prep',
    title: 'Practice answers that feel natural',
    description:
      'Short tips, focused quizzes, and a clearer layout help job seekers prepare with confidence instead of stress.',
    bullets: [
      'Guided practice that stays focused',
      'Tips written in simple, direct language',
      'Interactive quizzes that feel lightweight',
    ],
    note: 'Good for quick sessions',
    icon: MessageSquareText,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    title: 'A visual home base for your job search',
    description:
      'Bring the most important actions forward with visual modules, direct entry points, and a dashboard that actually helps the next step stand out.',
    bullets: [
      'Representative modules, not just static cards',
      'Fast access to every feature from one place',
      'Clear hierarchy so the next action is obvious',
    ],
    note: 'Designed for orientation',
    icon: LayoutDashboard,
  },
]

const featureCards: FeatureCard[] = [
  {
    title: 'A landing page that speaks to job seekers',
    description:
      'A stronger opening that says exactly what the product does: help people tailor CVs, prepare for interviews, and stay on track.',
    icon: Briefcase,
    href: '#features',
    accent: 'from-amber-100 to-orange-50',
  },
  {
    title: 'A dashboard that feels useful at a glance',
    description:
      'The home screen should show progress, shortcuts, and the next best action instead of repeating the same card layout.',
    icon: BarChart3,
    href: '#dashboard',
    accent: 'from-sky-100 to-cyan-50',
  },
  {
    title: 'Matcher results that are easy to understand',
    description:
      'Results should appear inline with a comfortable layout, so the user can review feedback without losing context.',
    icon: ClipboardList,
    href: '#matcher',
    accent: 'from-emerald-100 to-lime-50',
  },
  {
    title: 'Tracker and prep that feel job-focused',
    description:
      'A better list view, drag and drop, optional job-description entry, and interview practice that feels helpful and human.',
    icon: ShieldCheck,
    href: '#tracker',
    accent: 'from-stone-100 to-slate-50',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Lead with the outcome',
    description:
      'Show job seekers why the app matters right away: better CVs, smarter prep, and less application chaos.',
  },
  {
    step: '02',
    title: 'Make every screen useful',
    description:
      'Dashboard, matcher, tracker, and prep should feel like parts of one clear journey, not separate tools.',
  },
  {
    step: '03',
    title: 'Keep it clear and human',
    description:
      'Use plain language, reduce noise, and make the experience feel welcoming for real people looking for work.',
  },
]

function MiniStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
        {description}
      </p>
    </div>
  )
}

export default function LandingPage() {
  const [selectedMode, setSelectedMode] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const currentMode = focusModes[selectedMode]

  const handleDemoLogin = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    window.location.href = '/dashboard'
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfaf7] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_30%),radial-gradient(circle_at_right,_rgba(251,191,36,0.08),_transparent_35%),linear-gradient(to_bottom,_#fbfaf7,_#f8fafc_72%,_#ffffff)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[-9rem] top-[30rem] h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-slate-950">
                Muwaazaf
              </div>
              <div className="text-xs text-slate-500">Career tools with clarity</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a className="text-sm text-slate-600 transition hover:text-slate-950" href="#features">
              Features
            </a>
            <a className="text-sm text-slate-600 transition hover:text-slate-950" href="#dashboard">
              Dashboard
            </a>
            <a className="text-sm text-slate-600 transition hover:text-slate-950" href="#process">
              Process
            </a>
            <a className="text-sm text-slate-600 transition hover:text-slate-950" href="#tracker">
              Tracker
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" className="rounded-full text-slate-700 hover:bg-slate-100" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Try demo
            </Button>
            <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800" asChild>
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="border-t border-slate-200 bg-white md:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
                <a className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#features">
                  Features
                </a>
                <a className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#dashboard">
                  Dashboard
                </a>
                <a className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#process">
                  Process
                </a>
                <a className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#tracker">
                  Tracker
                </a>
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <Button variant="outline" className="rounded-full border-slate-200" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button
                    onClick={handleDemoLogin}
                    className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                  >
                    Try demo
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="relative">
        <section className="px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800">
                <BadgeCheck className="h-4 w-4" />
                Built to help people land better jobs with less stress
              </div>

              <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl xl:text-7xl">
                Make your job search sharper, faster, and easier to win.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Muwaazaf helps people polish their CV, tailor every application, prepare for interviews,
                and keep progress organized so getting hired feels less overwhelming.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 rounded-full bg-slate-950 px-6 text-base text-white hover:bg-slate-800" asChild>
                  <Link href="/signup">
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 bg-white px-6 text-base text-slate-700 hover:bg-slate-50"
                >
                  Try the demo
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Users className="h-4 w-4 text-cyan-700" />
                    Clear for people
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A tone and layout that feel approachable, not technical.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    Easy to trust
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Calm hierarchy, visible actions, and fewer confusing choices.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <MoveRight className="h-4 w-4 text-amber-700" />
                    Quick to move
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Each screen points to the next step without extra hunting.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="dashboard"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -left-6 top-12 h-24 w-24 rounded-full bg-cyan-200/50 blur-2xl" />
              <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-amber-200/50 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                  {focusModes.map((mode, index) => {
                    const active = selectedMode === index
                    return (
                      <button
                        key={mode.key}
                        onClick={() => setSelectedMode(index)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          active
                            ? 'bg-slate-950 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {mode.label}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMode.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="px-1 pb-1 pt-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <currentMode.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                            {currentMode.note}
                          </div>
                          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                            {currentMode.title}
                          </h2>
                        </div>
                      </div>
                      <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 sm:block">
                        Ready to open
                      </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                      {currentMode.description}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {currentMode.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <p className="text-sm leading-6 text-slate-700">{bullet}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <MiniStat label="Result" value="Inline and readable" />
                      <MiniStat label="Flow" value="Less back and forth" />
                      <MiniStat label="Tone" value="Human and clear" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-sm sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Upload className="h-5 w-5 text-cyan-700" />
              <div>
                <div className="text-sm font-semibold text-slate-950">Upload once</div>
                <div className="text-sm text-slate-600">CVs and job posts stay organized.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-amber-700" />
              <div>
                <div className="text-sm font-semibold text-slate-950">Find the fit</div>
                <div className="text-sm text-slate-600">See what to improve before applying.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <CalendarClock className="h-5 w-5 text-emerald-700" />
              <div>
                <div className="text-sm font-semibold text-slate-950">Track the next step</div>
                <div className="text-sm text-slate-600">Keep follow-ups and interviews visible.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Why it matters"
              title="Built to help people get hired, not just browse tools."
              description="Every part of the experience should move someone closer to a better application, a stronger interview, and a real chance at the role they want."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((card, index) => (
                <motion.a
                  key={card.title}
                  href={card.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-slate-950`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                    Explore the idea
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="How it should feel"
              title="Simple, visible, and built around the next decision."
              description="The landing page should set the tone, and the product should keep that tone everywhere else."
            />

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tracker" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <SectionTitle
                eyebrow="Tracker and prep"
                title="The practical screens should stay simple, helpful, and fast."
                description="The tracker, matcher, and interview prep should stay easy to navigate, with the right details showing up exactly when they are needed."
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                      <ListTodo className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Tracker list view</div>
                      <div className="text-sm text-slate-600">Drag and drop with clean labels.</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Reuse job descriptions</div>
                      <div className="text-sm text-slate-600">Choose a saved JD or upload a new one.</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <MessageSquareText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Interview practice</div>
                      <div className="text-sm text-slate-600">Better tips, quizzes, and flow.</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Dashboard entry points</div>
                      <div className="text-sm text-slate-600">Each feature should be easy to reach.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="matcher"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">
                      Visual dashboard note
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Replace the empty card wall with a real workspace
                    </h3>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
                    Interactive overview
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-950">Applications</div>
                      <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ['Applied', '12 roles'],
                        ['Interview', '4 active'],
                        ['Offer', '1 result'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <span className="text-sm font-semibold text-slate-950">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-950">Current work</div>
                      <BarChart3 className="h-5 w-5 text-cyan-700" />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">Profile clarity</span>
                          <span className="font-semibold text-slate-950">78%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200">
                          <div className="h-2 w-[78%] rounded-full bg-slate-950" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">Tracker completeness</span>
                          <span className="font-semibold text-slate-950">91%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200">
                          <div className="h-2 w-[91%] rounded-full bg-cyan-600" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                      The main dashboard should guide the user toward the next useful action
                      instead of making them scroll through duplicate cards.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-slate-200 bg-slate-950 px-6 py-14 text-center shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:px-10 lg:px-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                <Users className="h-4 w-4" />
                Ready for a more confident job search flow
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Let us turn the product into something job seekers trust and enjoy using.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                We can keep refining the landing page first, then move into the dashboard,
                matcher, tracker, and interview prep so each step feels more useful and more human.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 rounded-full bg-white px-6 text-base text-slate-950 hover:bg-slate-100" asChild>
                  <Link href="/signup">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-transparent px-6 text-base text-white hover:bg-white/10"
                >
                  Open demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-sm font-semibold text-slate-950">Muwaazaf</div>
            <div className="mt-1 text-sm text-slate-500">
              A clearer career experience for job seekers.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <a className="transition hover:text-slate-950" href="#features">
              Features
            </a>
            <a className="transition hover:text-slate-950" href="#process">
              Process
            </a>
            <a className="transition hover:text-slate-950" href="/login">
              Sign in
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
