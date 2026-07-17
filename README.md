# 🏟️ StadiumMind AI

### The AI Operating System for FIFA World Cup 2026

> Powered by **Google Gemini 2.5** • Built for the **Prompt Wars Hackathon**

🌐 **Live Demo:** [https://challenge-4-delta.vercel.app/](https://challenge-4-delta.vercel.app/)

---

## 🎯 Overview

StadiumMind AI is a complete AI-powered platform for smart stadium operations. Instead of a single chatbot, it provides **three specialized AI modules** — each designed for a different stakeholder — sharing the same real-time intelligence layer.

| Module | Stakeholder | Key Features |
|--------|------------|--------------|
| 🎛️ **AI Command Center** | Organizers, Security, Operations | Live stadium map, crowd density, AI insights, multilingual announcements |
| 📱 **AI Fan Companion** | Spectators | Indoor navigation, food recommendations, exit predictions, match updates |
| ♿ **Accessibility AI** | Users with disabilities | Scene description, accessible routes, live captions, emergency guidance |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js 14 App                 │
├─────────────┬──────────────┬────────────────────┤
│  Command    │    Fan       │   Accessibility    │
│  Center     │  Companion   │       AI           │
├─────────────┴──────────────┴────────────────────┤
│              API Routes (Next.js)               │
├─────────────────────────────────────────────────┤
│         Google Gemini 2.5 Flash AI              │
├─────────────────────────────────────────────────┤
│       Real-Time Simulation Engine (SSE)         │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Google AI API key from [aistudio.google.com](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Navigate to the project
cd "Challenge - 4"

# 2. Install dependencies
npm install

# 3. Add your Gemini API key (optional — mock responses work without it)
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to run it locally, or view the live demo at [https://challenge-4-delta.vercel.app/](https://challenge-4-delta.vercel.app/).

### Available Pages

| Route | Module |
|-------|--------|
| `/` | Landing Page |
| `/command-center` | AI Command Center (Organizer Dashboard) |
| `/fan-companion` | AI Fan Companion (Spectator Assistant) |
| `/accessibility` | Accessibility AI (Inclusive Experience) |

---

## 🤖 AI Integration

### Gemini 2.5 Flash

The app uses `@google/genai` to interact with Gemini 2.5 Flash for:

- **Operational analysis**: Gemini analyzes 10+ live data streams and generates prioritized insights with reasoning
- **Natural language chat**: Conversational fan assistant understanding context (ticket, preferences, location)
- **Multilingual translation**: Generate stadium announcements in 6 languages (EN, ES, FR, AR, JA, HI)
- **Scene description**: Vision AI simulation for accessibility users
- **Accessible navigation**: Route generation avoiding stairs and crowded areas

### Mock Mode

When no `GEMINI_API_KEY` is provided, all AI endpoints return realistic mock responses. This allows the full demo to run without any API key.

---

## 📊 Simulation Engine

The app includes a comprehensive real-time simulation engine generating:

- Crowd density per zone (8 zones, drift-based evolution)
- Gate queue lengths and scan rates (8 gates)
- Food stall queues with wait time predictions (8 stalls)
- Washroom occupancy (18 washrooms across 6 zones)
- Security alerts (random generation with lifecycle)
- Medical incidents (with response time tracking)
- Volunteer locations and status (12 volunteers)
- Weather data (temperature, humidity, UV, wind)
- Transport status (metro, parking, bus shuttle, rideshare)
- Match simulation (score, events, minute)
- IoT sensor data (temperature, noise, air quality per zone)

Data streams via Server-Sent Events (SSE) with 3-second refresh intervals.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | CSS + Tailwind |

### Google Technologies Used

- ✅ Gemini 2.5 Flash — AI intelligence layer
- ✅ Vertex AI — Fallback AI provider
- ✅ Google Fonts — Inter + JetBrains Mono
- 📋 Firebase Hosting — Deployment target
- 📋 Cloud Run — Backend deployment
- 📋 Firestore — Production database
- 📋 Firebase Auth — Role-based authentication
- 📋 Translation API — Announcement translations
- 📋 Vision AI — Scene description
- 📋 Speech-to-Text / Text-to-Speech — Voice assistant

(✅ = implemented, 📋 = production-ready integration point)

---

## 🎨 Design

- **Glassmorphism UI** with backdrop blur and frosted glass effects
- **Dark mode first** with light mode and high-contrast mode support
- **FIFA-inspired color palette** (blue/gold/cyan)
- **Responsive** — works on desktop, tablet, and mobile
- **WCAG AA compliant** focus indicators, skip links, and ARIA attributes
- **Animated** — smooth transitions, pulse effects, shimmer loading states

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system
│   ├── command-center/             # Module 1
│   ├── fan-companion/              # Module 2
│   ├── accessibility/              # Module 3
│   └── api/                        # API routes
│       ├── simulation/route.ts     # SSE stream
│       └── ai/                     # Gemini endpoints
├── components/
│   ├── ui/                         # Shared design system
│   ├── command-center/             # Dashboard widgets
│   ├── fan-companion/              # Chat + companion
│   └── accessibility/              # A11y features
├── hooks/                          # Custom React hooks
└── lib/
    ├── ai/                         # Gemini client + prompts
    ├── simulation/                 # Data generator
    └── store/                      # Zustand stores
```

---

## 🔒 Security

- Security headers (CSP, HSTS, X-Frame-Options)
- Input validation on all API routes
- Rate limiting ready
- Environment variable isolation
- HTTPS-only in production

---

## 📝 License

Built for the Prompt Wars Hackathon — FIFA World Cup 2026 Challenge.
