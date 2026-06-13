<div align="center">
  <img src="./public/file.svg" alt="Muwaazaf Logo" width="120" />
  <h1>Muwaazaf Platform</h1>
  <p><strong>The Next-Generation AI Career Companion designed specifically for the Lebanese Market.</strong></p>
</div>

---

## 🚀 Overview
**Muwaazaf** is a fully integrated, AI-powered employability platform that empowers job seekers to navigate the modern labor market. By leveraging advanced Multi-Agent LLMs (powered primarily by Google Gemini 2.5 Flash), Muwaazaf provides personalized career tools—from CV matching and cover letter generation to mock interviews and labor rights guidance.

## ✨ Key Features
- **🎯 CV Matcher (Scout):** Upload your CV and a target Job Description. The AI will instantly calculate an ATS fit score, extract matching keywords, and identify critical skill gaps.
- **📝 Cover Letter Generator:** Generate highly personalized, professionally formatted cover letters tailored exactly to your CV and the specific job requirements. Export them directly to a 1-page PDF.
- **🎙️ Mock Interview Coach:** Practice your interviewing skills with a context-aware AI agent that asks behavioral and technical questions based on your identified skill gaps.
- **📊 Job Tracker (Kanban):** A sleek drag-and-drop Kanban board to seamlessly track the status of your applications (Applied, Interviewing, Offered, Rejected).
- **💰 Salary Benchmarking:** Real-time, localized salary insights tailored to the Lebanese job market, helping you negotiate your worth confidently.
- **⚖️ Labor Rights Explorer:** An interactive knowledge base trained on Lebanese Labor Law to help you understand your contracts, end-of-service indemnities, and worker rights.

## 🛠️ Technology Stack
- **Frontend Framework:** [Next.js 16.2.9](https://nextjs.org/) (App Router, React Server Components)
- **Styling:** Tailwind CSS v4, Lucide Icons, Shadcn UI / Radix UI components
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & GoTrue Auth)
- **AI / LLM Engine:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 2.5 Flash)
- **Deployment:** [Vercel](https://vercel.com/) (Edge / Serverless architecture)

## 💻 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/omarmokh122/MuwazafAI.git
cd MuwazafAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

## 📂 Project Structure
- `app/` - Next.js App Router pages and API routes (`/api/agents/*`).
- `components/` - Reusable UI components (buttons, dialogs, layouts).
- `lib/` - Utility functions, Supabase client initialization, Zustand store configuration, and AI prompts.
- `public/` - Static assets (images, fonts, icons).

## 🚀 Deployment
This project is deeply optimized for deployment on Vercel. 
To deploy, simply push to the `main` branch or use the Vercel CLI:
```bash
npx vercel --prod
```
*Note: Ensure your environment variables are configured in the Vercel dashboard prior to deployment.*

## 📄 License
This project is licensed under the MIT License.
