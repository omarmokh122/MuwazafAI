'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, DollarSign, Brain, Target, ArrowLeft, CheckCircle2, PlayCircle, Star, Award, ChevronRight, AlertCircle } from 'lucide-react'

interface Lesson {
  title: string
  content: string
}

interface Quiz {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Module {
  id: string
  title: string
  description: string
  icon: ReactNode
  color: string
  borderColor: string
  lessons: Lesson[]
  quiz: Quiz
}

const modules: Module[] = [
  {
    id: 'behavioral',
    title: 'Behavioral answers that feel natural',
    description: 'Practice STAR-style answers that sound clear, confident, and real.',
    icon: <Users className="w-6 h-6 text-blue-600" />,
    color: 'bg-blue-100',
    borderColor: 'border-blue-200 hover:border-blue-400',
    lessons: [
      {
        title: 'The STAR Method',
        content: `Behavioral interviews are designed to see how you act in real situations. The only way to answer these is the **STAR** method.\n\n**S - Situation:** Set the scene and give the necessary details of your example.\n**T - Task:** Describe what your responsibility was in that situation.\n**A - Action:** Explain exactly what steps you took to address it.\n**R - Result:** Share what outcomes your actions achieved (use numbers!).`
      },
      {
        title: 'Common Pitfalls',
        content: `**1. Saying "We" instead of "I":** Interviewers want to know what YOU did, not your team.\n**2. No Result:** The story falls flat if you don't share the business impact.\n**3. Rambling:** Keep your story under 2 minutes.`
      }
    ],
    quiz: {
      question: "An interviewer asks: 'Tell me about a time you failed.' What is the BEST approach using STAR?",
      options: [
        "Explain the situation, blame a coworker for the task, and state the result.",
        "Briefly state the failure, focus heavily on the Action you took to fix it, and the Resulting lesson learned.",
        "Deny that you have ever failed, as it shows weakness."
      ],
      correctAnswer: 1,
      explanation: "Always own the failure quickly (Situation/Task), but spend 80% of your answer on how you fixed it (Action) and what you learned (Result)."
    }
  },
  {
    id: 'body-language',
    title: 'Body language and presence',
    description: 'Learn the small habits that make you look calm and prepared on camera.',
    icon: <Target className="w-6 h-6 text-purple-600" />,
    color: 'bg-purple-100',
    borderColor: 'border-purple-200 hover:border-purple-400',
    lessons: [
      {
        title: 'The Virtual Interview',
        content: `**1. Eye Contact:** Look at the CAMERA, not the screen. It feels unnatural, but it simulates direct eye contact to the interviewer.\n**2. Framing:** Ensure your head and shoulders are visible. Don't sit too close.\n**3. Lighting:** Face a window or a ring light. Never sit with a bright window directly behind you.`
      },
      {
        title: 'Handling Nerves',
        content: `It is completely okay to pause. If you are asked a tough question, simply say: *"That's a great question, let me think about that for a second."* Take a deep breath, and then answer. Pausing shows thoughtfulness, not panic.`
      }
    ],
    quiz: {
      question: "You are in a Zoom interview and the interviewer asks a highly complex technical question. You need a moment to think. What should you do?",
      options: [
        "Look down at your desk, frown, and stay completely silent for 15 seconds.",
        "Immediately start talking and try to figure it out as you go.",
        "Smile, say 'That is an excellent question, let me take a brief moment to structure my thoughts', and look directly at the camera."
      ],
      correctAnswer: 2,
      explanation: "Communicating your need to pause shows extreme professional maturity and prevents rambling."
    }
  },
  {
    id: 'salary',
    title: 'Salary negotiation',
    description: 'Talk about compensation with confidence and without sounding pushy.',
    icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
    color: 'bg-emerald-100',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    lessons: [
      {
        title: 'The First Rule',
        content: `Never give a number first if you can avoid it. When asked "What are your salary expectations?" early in the process, pivot gracefully:\n\n*"I'm currently focused on finding the right fit for my career. I'm sure if we are a mutual match, we can agree on a competitive number."*`
      },
      {
        title: 'When Forced to Answer',
        content: `If they absolutely force you, provide a **Range**, and anchor the bottom of your range to your actual target number. For example, if you want $80k, say *"Based on my market research for this specific role, I am looking for a range between $80k and $95k, depending on the total compensation package."*`
      }
    ],
    quiz: {
      question: "The recruiter asks you for your salary expectations during the very first 10-minute phone screen. What is the optimal response?",
      options: [
        "Tell them exactly how much you currently make so they can match it.",
        "Say 'I need at least $100,000 or I will walk away.'",
        "Pivot by saying you are focused on learning about the role first, but expect a competitive market rate."
      ],
      correctAnswer: 2,
      explanation: "Pivoting keeps your leverage intact until you actually receive an offer and know the full scope of the job."
    }
  }
]

export default function InterviewAcademy() {
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [view, setView] = useState<'hub' | 'lesson' | 'quiz' | 'result'>('hub')
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  
  // Gamification State
  const [xp, setXp] = useState(0)
  const [completedModules, setCompletedModules] = useState<string[]>([])

  const progressPct = (completedModules.length / modules.length) * 100

  // --- Handlers ---
  const startModule = (mod: Module) => {
    setActiveModule(mod)
    setCurrentLessonIdx(0)
    setView('lesson')
  }

  const nextLesson = () => {
    if (!activeModule) return
    if (currentLessonIdx < activeModule.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1)
    } else {
      setView('quiz')
      setSelectedAnswer(null)
    }
  }

  const submitQuiz = () => {
    if (selectedAnswer === null || !activeModule) return
    setView('result')
    if (selectedAnswer === activeModule.quiz.correctAnswer && !completedModules.includes(activeModule.id)) {
      setXp(xp + 150)
      setCompletedModules([...completedModules, activeModule.id])
    }
  }

  const closeModule = () => {
    setActiveModule(null)
    setView('hub')
  }

  // --- Views ---
  if (view === 'hub') {
    return (
      <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-200">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Prep</h1>
              <p className="text-slate-500">Short lessons and focused quizzes to help you answer with confidence.</p>
            </div>
          </div>
          
          <div className="flex gap-8 px-6 py-4 bg-slate-50 rounded-xl border w-full md:w-auto">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total XP</p>
              <div className="flex items-center text-2xl font-bold text-violet-600">
                <Star className="w-5 h-5 mr-1 fill-violet-600" /> {xp}
              </div>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Progress</p>
              <div className="flex items-center text-2xl font-bold text-slate-800">
                {completedModules.length} <span className="text-sm text-slate-400 ml-1">/ {modules.length}</span>
              </div>
            </div>
          </div>
        </div>

        <Progress value={progressPct} className="h-3 bg-slate-100 [&>div]:bg-violet-600" />

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(mod => {
            const isCompleted = completedModules.includes(mod.id)
            return (
              <Card 
                key={mod.id}
                className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${mod.borderColor} overflow-hidden relative`}
                onClick={() => startModule(mod)}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${mod.color}`}>
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-slate-800">{mod.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">{mod.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <PlayCircle className="w-4 h-4 mr-2" /> {mod.lessons.length} Lessons
                    </div>
                    {isCompleted ? (
                      <span className="text-sm font-bold text-emerald-600">Completed</span>
                    ) : (
                    <span className="text-sm font-bold text-violet-600 group-hover:text-violet-700 flex items-center">
                        Start <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Locked Simulator Card */}
        <Card className="opacity-60 grayscale border-dashed border-2 cursor-not-allowed">
          <CardContent className="p-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-200">
              <Target className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-slate-800">Mock interview simulator</h3>
            <p className="text-sm text-slate-500 mb-6">Complete the core modules to unlock a live practice mode.</p>
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
              Locked
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!activeModule) return null

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 pb-12">
      <Button variant="ghost" onClick={closeModule} className="mb-6 text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Academy
      </Button>

      <Card className="border-none shadow-2xl overflow-hidden">
        {/* Module Header */}
        <div className={`${activeModule.color} p-8 flex items-center gap-6`}>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            {activeModule.icon}
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider uppercase mb-1 opacity-70">
              {view === 'quiz' || view === 'result' ? 'Knowledge Check' : `Lesson ${currentLessonIdx + 1} of ${activeModule.lessons.length}`}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{activeModule.title}</h2>
          </div>
        </div>

        <CardContent className="p-8">
          {view === 'lesson' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800">{activeModule.lessons[currentLessonIdx].title}</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {activeModule.lessons[currentLessonIdx].content}
              </div>
              <div className="pt-8 flex justify-end">
                <Button onClick={nextLesson} size="lg" className="bg-slate-900 text-white hover:bg-slate-800">
                  {currentLessonIdx < activeModule.lessons.length - 1 ? 'Next Lesson' : 'Take the Quiz'} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {view === 'quiz' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="text-lg font-medium text-slate-800 leading-snug">{activeModule.quiz.question}</h3>
              </div>
              
              <div className="space-y-3">
                {activeModule.quiz.options.map((opt: string, idx: number) => (
                  <label key={idx} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-colors ${selectedAnswer === idx ? 'border-violet-600 bg-violet-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="quiz-option" 
                      value={idx} 
                      checked={selectedAnswer === idx} 
                      onChange={() => setSelectedAnswer(idx)} 
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-600"
                    />
                    <span className="flex-1 cursor-pointer leading-relaxed">{opt}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={submitQuiz} disabled={selectedAnswer === null} size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Submit Answer
                </Button>
              </div>
            </div>
          )}

          {view === 'result' && (
            <div className="space-y-8 text-center animate-in zoom-in-95 py-8">
              {selectedAnswer === activeModule.quiz.correctAnswer ? (
                <>
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Nice work!</h3>
                  <p className="text-emerald-600 font-medium mb-6">+150 XP Earned</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Almost there.</h3>
                  <p className="text-slate-500 mb-6">Let&apos;s review why this answer could be stronger.</p>
                </>
              )}

              <div className="bg-slate-50 p-6 rounded-xl border text-left">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Explanation</p>
                <p className="text-slate-700 leading-relaxed">{activeModule.quiz.explanation}</p>
              </div>

              <Button onClick={closeModule} size="lg" className="bg-slate-900 hover:bg-slate-800 w-full max-w-sm mx-auto">
                Return to Academy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
