const fs = require('fs');
const file = '/Users/omarmokhtar/Desktop/muwaazaf-platform/app/(dashboard)/interview-prep/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the hardcoded `const modules = [` with `const baseModules = [`
code = code.replace('const modules = [', 'const baseModules = [');

// We need to extract the 'technical' module out of baseModules.
// It's easier to just do it via string manipulation or Babel, but we can do a simple hack:
// Since it's a big file, let's just insert the React state and effects inside `InterviewAcademy`.

code = code.replace(
  `import { useState } from 'react'`,
  `import { useState, useEffect } from 'react'\nimport { useUserProfile } from '@/lib/store/user-profile'\nimport { useInterviewStore } from '@/lib/store/interview-store'\nimport { Loader2 } from 'lucide-react'`
);

code = code.replace(
  `export default function InterviewAcademy() {`,
  `
const predefinedTechModules: Record<string, any> = {
  'Software Engineer': {
    id: 'technical',
    title: 'Technical Interviews (SWE)',
    description: 'Frameworks for algorithms, data structures, and system design rounds.',
    icon: <Code className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'The REACT Method for Algorithms',
        content: (
          <div className="space-y-4">
            <p>Never jump straight into coding when given an algorithm question. Use the <strong>REACT</strong> method:</p>
            <ul className="space-y-2 mt-2">
              <li><strong>R - Repeat:</strong> Repeat the question back to confirm understanding.</li>
              <li><strong>E - Examples:</strong> Write out 2-3 edge cases.</li>
              <li><strong>A - Approach:</strong> Verbally explain your algorithm before coding.</li>
              <li><strong>C - Code:</strong> Write the actual code cleanly.</li>
              <li><strong>T - Test:</strong> Dry-run your code line-by-line.</li>
            </ul>
          </div>
        )
      },
      {
        title: 'System Design Framework (PEDALS)',
        content: (
          <div className="space-y-4">
            <p>For mid-to-senior roles, follow the <strong>PEDALS</strong> framework:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>P:</strong> Process Requirements</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>E:</strong> Estimate capacity</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>D:</strong> Design the API</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>A:</strong> Architecture</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>L:</strong> Logical Database</li>
              <li className="bg-white border rounded-lg p-3 text-sm"><strong>S:</strong> Scale bottlenecks</li>
            </ul>
          </div>
        )
      }
    ],
    quiz: {
      question: "You are given a complex algorithm question. What is the very first thing you should do?",
      options: ["Start writing a for-loop", "Ask to use a different language", "Repeat the question back and clarify"],
      correctAnswer: 2,
      explanation: "Jumping straight into code often leads to solving the wrong problem."
    }
  },
  'Product Manager': {
    id: 'technical_pm',
    title: 'Technical Interviews (Product)',
    description: 'Frameworks for product sense, execution, and strategy rounds.',
    icon: <Code className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'Product Sense (CIRCLES)',
        content: (
          <div className="space-y-4">
            <p>When asked to design a product, use the CIRCLES method:</p>
            <ul className="space-y-2 mt-2 list-disc pl-6">
              <li><strong>Comprehend the situation:</strong> Goal, constraints.</li>
              <li><strong>Identify the customer:</strong> Personas.</li>
              <li><strong>Report the customer needs:</strong> Use cases.</li>
              <li><strong>Cut through prioritizing:</strong> ROI.</li>
              <li><strong>List solutions:</strong> Brainstorm.</li>
              <li><strong>Evaluate tradeoffs.</strong></li>
              <li><strong>Summarize recommendation.</strong></li>
            </ul>
          </div>
        )
      }
    ],
    quiz: {
      question: "What is the first step in the CIRCLES method?",
      options: ["Comprehend the situation", "Identify the customer", "List solutions"],
      correctAnswer: 0,
      explanation: "Always understand the goal and constraints before designing."
    }
  },
  'Marketing Specialist': {
    id: 'technical_mkt',
    title: 'Technical Interviews (Marketing)',
    description: 'GTM strategies, campaign analytics, and growth frameworks.',
    icon: <Code className="w-6 h-6 text-slate-700" />,
    lessons: [
      {
        title: 'Go-To-Market Strategy',
        content: (
          <div className="space-y-4">
            <p>For GTM questions, cover these pillars:</p>
            <ul className="space-y-2 mt-2 list-disc pl-6">
              <li><strong>Target Audience:</strong> ICP and buyer personas.</li>
              <li><strong>Value Prop:</strong> Core messaging and positioning.</li>
              <li><strong>Channels:</strong> Owned, Earned, Paid.</li>
              <li><strong>Metrics:</strong> CAC, LTV, ROAS.</li>
            </ul>
          </div>
        )
      }
    ],
    quiz: {
      question: "Which metric measures the cost to acquire a new customer?",
      options: ["LTV", "CAC", "ROAS"],
      correctAnswer: 1,
      explanation: "Customer Acquisition Cost (CAC) is crucial for GTM efficiency."
    }
  }
}

export default function InterviewAcademy() {`
);

fs.writeFileSync(file, code);
