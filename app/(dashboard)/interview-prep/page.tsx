'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Users, Code, Briefcase, DollarSign, Brain, Target, ArrowLeft, CheckCircle2, PlayCircle, Star, Award, ChevronRight, AlertCircle } from 'lucide-react'

// --- Academy Curriculum Data ---
const modules = [
  {
    id: 'screening',
    title: 'Screening Interviews',
    description: 'Master the initial recruiter call, phone screen, and asynchronous video interviews.',
    icon: <Users className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'The "Tell Me About Yourself" Pitch',
        content: (
          <div className="space-y-4">
            <p>The screening interview almost always starts with "Tell me about yourself". Do not read your resume chronologically. Use the <strong>Present-Past-Future</strong> framework.</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Present:</strong> What is your current role and what is your biggest recent accomplishment?</li>
              <li><strong>Past:</strong> How did you get there? Mention 1-2 past roles that gave you the necessary skills.</li>
              <li><strong>Future:</strong> Why are you looking for a new opportunity and why this company specifically?</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Recommended Resources</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://hbr.org/2019/08/how-to-respond-to-so-tell-me-about-yourself" target="_blank" className="text-blue-600 hover:underline">HBR: How to Respond to "Tell Me About Yourself"</a></li>
                <li><a href="https://www.youtube.com/watch?v=MmEQ0WQ3KNg" target="_blank" className="text-blue-600 hover:underline">Jeff Su: The Perfect Formula for "Tell Me About Yourself"</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'Handling Asynchronous Video (HireVue)',
        content: (
          <div className="space-y-4">
            <p>Many first-round screens are now done via one-way video platforms like HireVue. These can feel highly unnatural.</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <p><strong>The "Pin" Trick:</strong> Put a post-it note with a smiley face right next to your webcam lens. Talk directly to the sticky note, not the screen, to simulate eye contact.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <p><strong>Lighting & Framing:</strong> Face a window or a ring light. Do not have a bright window behind you. Ensure your head and shoulders are framed comfortably.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <p><strong>Pacing:</strong> One-way videos cause candidates to speak 30% faster than normal due to nerves and silence. Consciously slow down, breathe, and pause between sentences.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Practice Tools</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://www.yoodli.ai/" target="_blank" className="text-blue-600 hover:underline">Yoodli.ai (Free AI Speech Coaching for pacing and filler words)</a></li>
                <li><a href="https://vancoders.com/hirevue-interview-questions/" target="_blank" className="text-blue-600 hover:underline">Top 50 HireVue Questions Database</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'Common Recruiter Gotchas',
        content: (
          <div className="space-y-4">
            <p>Recruiters are screening for behavioral red flags and salary misalignment. Be prepared for these traps:</p>
            <ul className="list-disc pl-6 space-y-3 mt-2">
              <li>
                <strong>Why are you leaving your current job?</strong><br/>
                <em>Never</em> badmouth your current employer. Use the <strong>Pull, not Push</strong> technique: Focus on what is <em>pulling</em> you toward the new company (growth, new tech stack, larger scale), not what is <em>pushing</em> you away from the old one.
              </li>
              <li>
                <strong>What are your salary expectations?</strong><br/>
                Do your research beforehand. Always give a range, anchoring your target salary at the <em>bottom</em> of that range. For example, if you want $80k, say your range is $80k - $95k.
              </li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Salary Data Resources</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://www.levels.fyi/" target="_blank" className="text-blue-600 hover:underline">Levels.fyi (Best for Tech & Engineering compensation)</a></li>
                <li><a href="https://www.glassdoor.com/Salaries/index.htm" target="_blank" className="text-blue-600 hover:underline">Glassdoor Salary Insights</a></li>
              </ul>
            </div>
          </div>
        )
      }
    ],
    quiz: {
      question: "During a phone screen, the recruiter asks 'Tell me about yourself.' What is the best way to structure your answer?",
      options: [
        "Recite your entire resume chronologically from college to present day.",
        "Talk primarily about your personal hobbies so they see you as a culture fit.",
        "Use the Present-Past-Future framework to highlight recent wins, relevant background, and why you want this specific role."
      ],
      correctAnswer: 2,
      explanation: "The Present-Past-Future framework keeps your answer concise (under 2 minutes) while hitting the exact points the recruiter needs to hear."
    }
  },
  {
    id: 'technical',
    title: 'Technical Interviews',
    description: 'Frameworks for algorithms, data structures, and system design rounds.',
    icon: <Code className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'The REACT Method for Algorithms',
        content: (
          <div className="space-y-4">
            <p>Never jump straight into coding when given an algorithm question (e.g., LeetCode style). Use the <strong>REACT</strong> method to communicate effectively:</p>
            <ul className="space-y-2 mt-2">
              <li><strong>R - Repeat:</strong> Repeat the question back to the interviewer to confirm understanding and clarify constraints.</li>
              <li><strong>E - Examples:</strong> Write out 2-3 edge cases and test inputs on the whiteboard.</li>
              <li><strong>A - Approach:</strong> Verbally explain your algorithm <em>before</em> writing any code. Discuss time/space complexity (Big O).</li>
              <li><strong>C - Code:</strong> Write the actual code cleanly, talking through your logic as you type.</li>
              <li><strong>T - Test:</strong> Dry-run your code line-by-line with the examples you created in step E.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Algorithm Practice Platforms</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://leetcode.com/problemset/all/" target="_blank" className="text-blue-600 hover:underline">LeetCode (The Industry Standard)</a></li>
                <li><a href="https://neetcode.io/" target="_blank" className="text-blue-600 hover:underline">NeetCode.io (Curated roadmap of 150 essential problems)</a></li>
                <li><a href="https://www.algoexpert.io/" target="_blank" className="text-blue-600 hover:underline">AlgoExpert (Video explanations)</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'System Design Framework (PEDALS)',
        content: (
          <div className="space-y-4">
            <p>For mid-to-senior engineering roles, System Design is critical. Follow the structured <strong>PEDALS</strong> framework to guide the 45-minute discussion:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>P - Process Requirements:</strong> Clarify functional vs. non-functional requirements.</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>E - Estimate:</strong> Calculate traffic, storage, and bandwidth capacity.</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>D - Design the API:</strong> Define the core endpoints and payloads.</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>A - Architecture:</strong> Draw the high-level components (LBs, DBs, Caches).</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>L - Logical Database:</strong> Define the schema (SQL vs NoSQL decisions).</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>S - Scale:</strong> Address bottlenecks (Sharding, Replication, CDNs).</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">System Design Resources</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://github.com/donnemartin/system-design-primer" target="_blank" className="text-blue-600 hover:underline">The System Design Primer (GitHub - Free)</a></li>
                <li><a href="https://www.designgurus.io/course/grokking-the-system-design-interview" target="_blank" className="text-blue-600 hover:underline">Grokking the System Design Interview (Course)</a></li>
                <li><a href="https://bytebytego.com/" target="_blank" className="text-blue-600 hover:underline">ByteByteGo by Alex Xu</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'Take-Home Assignments',
        content: (
          <div className="space-y-4">
            <p>If given a take-home assignment, the code is only half of the evaluation. Professionalism is the other half.</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>The README is your resume:</strong> A perfect codebase with no instructions will fail. Write a comprehensive README explaining how to run the app, architectural decisions, and trade-offs.</li>
              <li><strong>Testing:</strong> Always include at least a few unit tests for core business logic (e.g. Jest for React, PyTest for Python). It shows maturity.</li>
              <li><strong>Clean Commits:</strong> Do not submit one giant commit. Show your working process through logical, atomic Git commits with clear messages.</li>
            </ul>
          </div>
        )
      }
    ],
    quiz: {
      question: "You are given a complex algorithm question on a whiteboard. What is the very first thing you should do?",
      options: [
        "Start writing a nested for-loop immediately to show you can code quickly.",
        "Ask to use a different programming language.",
        "Repeat the question back, clarify constraints, and write out example inputs/outputs."
      ],
      correctAnswer: 2,
      explanation: "Jumping straight into code often leads to solving the wrong problem. The 'R' and 'E' in the REACT method are crucial for alignment."
    }
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interviews',
    description: 'Master non-technical rounds using structured storytelling.',
    icon: <Briefcase className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'The STAR Method (Upgraded)',
        content: (
          <div className="space-y-4">
            <p>You know the basics of STAR (Situation, Task, Action, Result). Let's upgrade it to <strong>STAR-L</strong> for senior impact:</p>
            <ul className="space-y-2 mt-2">
              <li><strong>S - Situation:</strong> Set the scene in 1-2 sentences. Keep context tight.</li>
              <li><strong>T - Task:</strong> What was your exact objective or the problem to solve?</li>
              <li><strong>A - Action:</strong> <em>(Spend 70% of your time here)</em>. What steps did <em>you</em> (not "we") take? What was your thought process?</li>
              <li><strong>R - Result:</strong> Give a quantifiable metric (e.g., "Increased revenue by 15%", "Reduced load time by 2 seconds").</li>
              <li><strong>L - Learning:</strong> Add a concluding sentence on what this experience taught you and how you applied that lesson later.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Story Banking</h4>
              <p className="text-sm mb-2">Create a "Story Grid" before your interview mapping 4-5 versatile stories to different themes (Conflict, Leadership, Failure, Success).</p>
              <a href="https://igotanoffer.com/blogs/tech/star-method-interview" target="_blank" className="text-blue-600 hover:underline text-sm">Read: Comprehensive Guide to the STAR Method</a>
            </div>
          </div>
        )
      },
      {
        title: 'The Amazon Leadership Principles',
        content: (
          <div className="space-y-4">
            <p>Even if you aren't interviewing at Amazon, their 16 Leadership Principles are the gold standard for behavioral interviews across the entire tech industry.</p>
            <p>Prepare exactly ONE strong STAR story for each of the core archetypes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Customer Obsession:</strong> A time you went above and beyond for a client or user.</li>
              <li><strong>Dive Deep:</strong> A time you had to analyze complex data to find a root cause.</li>
              <li><strong>Disagree and Commit:</strong> A time you disagreed with your manager but fully supported the final decision.</li>
              <li><strong>Deliver Results:</strong> A time you hit a tight deadline against all odds.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">Preparation Resources</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><a href="https://www.amazon.jobs/content/en/our-workplace/leadership-principles" target="_blank" className="text-blue-600 hover:underline">Official Amazon Leadership Principles</a></li>
                <li><a href="https://danocb.com/amazon-interview/leadership-principles/" target="_blank" className="text-blue-600 hover:underline">Dan Croitor's Guide to LP Interviews</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'The Carl Method for Failures',
        content: (
          <div className="space-y-4">
            <p>When asked <em>"Tell me about a time you failed"</em>, do not give a fake weakness (e.g., "I work too hard" or "I am a perfectionist"). Use the <strong>CARL</strong> framework for genuine authenticity:</p>
            <ul className="space-y-2 mt-2">
              <li><strong>C - Context:</strong> Describe the situation briefly.</li>
              <li><strong>A - Action:</strong> What did you do that led to the failure? Own the mistake completely. Do not blame others.</li>
              <li><strong>R - Result:</strong> What was the negative outcome?</li>
              <li><strong>L - Learning:</strong> <em>(Crucial Step)</em> What did you learn, and what systemic changes did you implement so this failure <em>never happens again</em>?</li>
            </ul>
          </div>
        )
      }
    ],
    quiz: {
      question: "When answering 'Tell me about a time you failed', what is the most important part of your answer?",
      options: [
        "Proving that the failure was actually someone else's fault.",
        "Explaining the systemic changes you implemented afterward so the failure never repeats.",
        "Providing a fake weakness, like 'I am too much of a perfectionist'."
      ],
      correctAnswer: 1,
      explanation: "Interviewers ask about failure to test your self-awareness and ability to learn. The 'Learning' step is the entire point of the question."
    }
  }
]

export default function InterviewAcademy() {
  const [activeModule, setActiveModule] = useState<any>(null)
  const [view, setView] = useState<'hub' | 'lesson' | 'quiz' | 'result'>('hub')
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  
  // Gamification State
  const [xp, setXp] = useState(0)
  const [completedModules, setCompletedModules] = useState<string[]>([])

  const progressPct = (completedModules.length / modules.length) * 100

  // --- Handlers ---
  const startModule = (mod: any) => {
    setActiveModule(mod)
    setCurrentLessonIdx(0)
    setView('lesson')
  }

  const nextLesson = () => {
    if (currentLessonIdx < activeModule.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1)
    } else {
      setView('quiz')
      setSelectedAnswer(null)
    }
  }

  const submitQuiz = () => {
    if (selectedAnswer === null) return
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded-xl shadow-sm">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Mastery</h1>
              <p className="text-slate-500 mt-1">Complete modules to level up your interview skills.</p>
            </div>
          </div>
          
          <div className="flex gap-8 px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total XP</p>
              <div className="flex items-center text-2xl font-bold text-slate-900">
                <Star className="w-5 h-5 mr-1 text-slate-400" /> {xp}
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

        <Progress value={progressPct} className="h-2 bg-slate-100 [&>div]:bg-slate-900 w-full" />

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(mod => {
            const isCompleted = completedModules.includes(mod.id)
            return (
              <Card 
                key={mod.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-md border-slate-200 hover:border-slate-300 overflow-hidden relative bg-white`}
                onClick={() => startModule(mod)}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 text-slate-400 bg-slate-50 p-1 rounded-full border border-slate-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center mb-6 bg-slate-50`}>
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">{mod.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{mod.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <PlayCircle className="w-3.5 h-3.5 mr-2" /> {mod.lessons.length} Lessons
                    </div>
                    {isCompleted ? (
                      <span className="text-sm font-semibold text-slate-400">Completed</span>
                    ) : (
                      <span className="text-sm font-bold text-slate-900 hover:text-slate-700 flex items-center">
                        Start <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}


        </div>
      </div>
    )
  }

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
              <div className="text-slate-700 leading-relaxed text-base">
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
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Excellent!</h3>
                  <p className="text-emerald-600 font-medium mb-6">+150 XP Earned</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Not quite.</h3>
                  <p className="text-slate-500 mb-6">Let's review why that wasn't the best approach.</p>
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
