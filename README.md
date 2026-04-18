# Memory Assist Bot: Your Personal Memory Companion

---

## Navigation
[Story & Mission](#story--mission) | [Demo](#live-demo) | [Features](#features-walkthrough) | [Tech Stack](#architecture--how-it-works) | [Getting Started](#getting-started-local-dev) | [Deployment](#deployment) | [Market & Vision](#market-opportunity--vision) | [GitHub](#github)

---

## Story & Mission

### The Story Behind It All

It all started with a simple frustration. I couldn't remember my best friend's birthday. Sounds trivial, right? But in that moment, I realized how many important details slip through the cracks in our busy lives. I thought, "That's easy—I can build an app for that." So I did. But then, I wanted to get him a thoughtful gift. What were his recent hobbies? What had he posted about on Instagram? What conversations had we had lately? I found myself scrambling, piecing together fragments from scattered notes and social media.

That's when the vision expanded. We all know that one person in our lives who always remembers the little things—the book you mentioned loving, the coffee shop you raved about, or that inside joke from years ago. Their memory makes you feel seen, valued, important. I wanted to be that person for my friends and family, but I simply didn't have the mental bandwidth. Did you know we're exposed to about 10,000 pieces of information every day? From emails and messages to social posts and live conversations, it's overwhelming. My app needed to do more than just store birthdays—it had to distill, organize, and retrieve all this information intelligently, helping me build stronger human connections.

### The Problem: Information Overload in a Connected World

In our hyper-connected world, we're bombarded with data. Emails, texts, social media updates, voice notes, photos—it's endless. Yet, when it comes to remembering the things that matter most, we often fall short. We forget birthdays, miss important details in conversations, or lose track of someone's evolving interests. The result? Missed opportunities to connect deeply, to show we care. Traditional notes apps or calendars are too manual and fragmented. We need something smarter, something that acts like a friend with perfect recall and insight.

### The Solution: A Smart Memory Assistant

Memory Assist Bot is your personal memory companion. Throw in all the information—emails, messages, social posts, voice recordings—and it carefully organizes, distills, and stores it for easy retrieval. Ask questions, and it reminds you like a friend with a sharp memory and intelligence. No more forgetting; just meaningful connections.

---

## Live Demo

Experience Memory Assist Bot in action:

- **Frontend**: https://2025-12-01-memory-assist-bot.vercel.app/
- **Backend API**: https://two025-12-01-memory-assist-bot.onrender.com/
- **API Docs**: https://two025-12-01-memory-assist-bot.onrender.com/docs

---

## Features Walkthrough

### 1. Overview Dashboard: Your Daily Pulse
![Overview Dashboard](demo-images/demo%20-%20concentric%20circle%20of%20friends.png)

Starting with the overview, this is where you land every morning. It shows your "concentric circles" of friends—close ones in the center, acquaintances farther out. Just like remembering your best friend's birthday, this visual helps you prioritize who to reach out to. It tracks recent interactions, upcoming birthdays, and even suggests thoughtful gestures based on stored memories. No more forgetting—it's like having a personal assistant who knows your social world intimately.

### 2. Chat Interface: Conversing with Your Memory
![Chat Interface](demo-images/demo-%20chat.png)

The chat is the heart of the app. Ask questions like, "What did my friend say about his new hobby?" and get instant, context-rich answers. It started with simple birthday reminders, but now it distills entire conversations. Imagine chatting with a friend who remembers every detail—that's what this feels like. It pulls from emails, messages, and social feeds to give you the full picture, helping you craft the perfect response or gift idea.

### 3. Memories Vault: Storing the Important Bits
![Memories Vault](demo-images/demo%20-%20memories.png)

This is where all distilled memories live. From birthdays to WiFi passwords, it's organized and searchable. Starting as just a birthday app, the vault grew to hold everything—conversations, events, personal facts. It's like having a second brain that organizes the 10,000 daily info bits into something meaningful. You no longer scramble for details; they're here, ready to make you the friend who remembers.

### 4. People Profiles: Deepening Connections
![People Profiles](demo-images/demo%20-%20people%20profile.png)

Each person gets a profile with birthdays, relationships, and distilled insights from your interactions. It tracks hobbies, recent posts, and conversation highlights. This is where the app shines—turning scattered data into a rich tapestry of who someone is. It makes you feel like you truly know them, fostering those deep, important connections we all crave.

### 5. Places Tracker: Locations That Matter
![Places Tracker](demo-images/demo%20-%20places.png)

Remembering places—favorite coffee shops, hiking trails, or someone's hometown—adds context to stories. This feature helps you recall where conversations happened or suggest meetups. It's not just storage; it's about the settings that make memories vivid. Now you can say, "Remember that coffee shop we loved?" and mean it.

### 6. Diary: Reflecting on Your Day
![Diary](demo-images/demo%20-%20diary.png)

The diary lets you add personal notes and reflections. It's where you capture thoughts that don't fit elsewhere. This became a space for daily distillation—organizing the bombardment of information into coherent stories. It's not just storage; it's synthesis, helping you reflect and connect dots in your own life.

### 7. Email Feeds: Ingesting Inbox Insights
![Email Feeds](demo-images/demo%20-%20email%20feed.png)

Pull receipts, invites, and attachments from emails. The capture engine classifies them—travel receipts tagged for trips, meeting invites linked to people. It started with simple reminders, but now it handles the email overload, distilling it into useful memories. No more sifting through spam; just smart, organized insights.

### 8. Social Feeds: Capturing Online Moments
![Social Feeds](demo-images/demo%20-%20social%20feed.png)

Ingest Facebook and Instagram posts, saves, and messages. It tracks recent reels and mentions, updating profiles with new hobbies or events, making you better at thoughtful gestures. It's like having eyes on their digital life, but ethically and privately.

### 9. Live Feed Capture: Real-Time Logging
![Live Feed Capture](demo-images/demo%20-%20live%20feed%20capture.png)

Record audio or video sessions for transcription and insights. Voice notes from calls get distilled into key points. This is the future—capturing live moments so nothing slips away. It means never missing a detail in a conversation, building connections that last.

---

## Architecture & How It Works

Memory Assist Bot is built on a **three-layer architecture**:

### 1. Capture Engine
Receives information from various sources:
- Emails & attachments
- SMS, WhatsApp & messaging apps
- Social media (Facebook, Instagram)
- Live recordings (voice & video)
- Diary entries & notes

The engine smartly **classifies information** into:
- Long-term memories (anniversaries, key facts)
- Short-term notes (recent conversations)
- Meta tags & relationships
- Updates past information based on new findings

### 2. Memory/Database Layer (Graph Knowledge Base)
- **SQLite-backed storage** (locally) or scalable DB (production)
- Designed for **graph relationships**: connects facts, people, places, events
- Makes retrieval intuitive: "What hobbies does Sarah have?" = instant answer
- Supports relationship updates: "Sarah mentioned she's into rock climbing" refines her profile

### 3. Smart Retrieval Layer
- **Contextual search & synthesis**: pulls relevant facts from the graph
- **Natural language chat interface**: ask questions naturally
- **Insights & suggestions**: recommends gifts, reminders, conversation topics
- **Timeline views**: see memories in context

---

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **State management**: React Hooks (useState, useCallback)
- **Icons**: Heroicons
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **ORM/Database**: SQLite (local), extensible to PostgreSQL
- **CORS**: Enabled for local dev & deployed frontend
- **Deployment**: Render.com
- **Server**: Uvicorn (ASGI)

### Deployment
- **Backend**: Render Web Service
- **Frontend**: Vercel Static Site
- **Environment**: VITE_BACKEND_URL injected at build time

---

## Key Endpoints

- `POST /chat` — Send a message, get AI-powered response with memory context
- `POST /conversations` — Create a new conversation
- `GET /conversations` — List all conversations
- `GET /conversations/{id}/messages` — Retrieve messages from a conversation
- `POST /conversations/{id}/messages` — Add a message to a conversation
- `GET /memories` — Retrieve distilled memories
- `GET /people` — List people profiles
- `GET /places` — List visited places
- `GET /birthdays` — Get upcoming birthdays

---

## Getting Started (Local Dev)

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git

### 1. Backend Setup (FastAPI)

From the repository root:

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python backend/main.py
```

The backend will be available at:
- **API**: http://localhost:8001
- **Interactive Docs**: http://localhost:8001/docs

### 2. Frontend Setup (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
- **App**: http://localhost:5173/

By default, the frontend points to the local backend at `http://127.0.0.1:8001`.

### 3. Quick Test

Open http://localhost:5173/ in your browser and start chatting!

---

## Database

- **Path**: `backend/data.db` (auto-created on first run)
- **Schema**: Conversations & Messages tables with proper foreign keys
- **Auto-setup**: The app calls `ensure_db()` on startup

---

## Deployment

### Option A: Render + Vercel (Recommended for Quick Demo)

#### Backend → Render
1. Push code to GitHub
2. Create a **Web Service** on Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Deploy & note the URL

#### Frontend → Vercel
1. Create a **Static Site** on Vercel
2. Set root directory to `/frontend`
3. Build command: `npm run build` (auto-detected)
4. Output directory: `dist`
5. Add environment variable: `VITE_BACKEND_URL` = your Render URL
6. Deploy

#### Important
Update `CORS allow_origins` in `backend/main.py` with your Vercel URL (or use `"*"` for demo):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Option B: Single Docker Container

Build and deploy as one service with frontend baked in:

```bash
docker build -t memory-assist .
docker run -p 8001:8001 memory-assist
```

---

## Notes & Limitations

- **Demo mode**: The `/chat` endpoint returns rule-based replies (not LLM-powered). Extend with OpenAI/Claude API.
- **Data**: Some endpoints return static demo data for UI development.
- **Persistence**: Data stored in SQLite locally; migrate to PostgreSQL for production.
- **Privacy**: Use responsibly. All captured data is local/private by default.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't reach backend | Check `VITE_BACKEND_URL` in Vercel env vars; ensure backend is running |
| CORS errors | Update `allow_origins` in `backend/main.py` or use `["*"]` for demo |
| Port 8001 in use | Change port in `uvicorn` command: `--port 8002` |
| Port 5173 in use | Vite will auto-pick next available port |
| Database errors | Delete `backend/data.db` and restart (it will rebuild) |

---

## Market Opportunity & Vision

### The Problem at Scale

- **10,000+ info pieces daily** overwhelm human memory
- **Relationship decay** from information overload, not intention
- **Seniors & early cognitive decline** lose orientation & emotional continuity
- **No unified system** today solves memory + connection

### Why Now

- AI becoming **contextual and personal**
- **Aging populations** drive global memory-care need
- **Loneliness climbing** across age groups (post-pandemic)
- **Digital fragmentation** makes recall harder than ever
- **No major entrants** own the "memory + connection" category yet

### Market Opportunity

**Primary markets**:
- Senior care & dementia support
- Busy professionals & parents
- Relationship enrichment & wellbeing apps
- Journaling, life organization, productivity

**Total addressable market**: Over **$40B** across digital health, memory care, and personal AI.

### Vision

To become the world's most trusted companion for memory, connection, and emotional continuity—across all stages of life.

**Memory Assist Bot is where people keep their story alive.**

We're building a future where memory isn't something you lose—but something you share, strengthen, and live through.

---

## Conclusion

Memory Assist Bot turns information overload into meaningful relationships. From a simple birthday reminder to a full-fledged memory companion, it's grown to help us all remember what matters.

Try it out. See how it makes you the friend with the perfect memory. Your connections will thank you.

---

## GitHub

- **Repository**: https://github.com/ronaks2309/2025_12_01-Memory_Assist_Bot
- **Issues & Feature Requests**: [GitHub Issues](https://github.com/ronaks2309/2025_12_01-Memory_Assist_Bot/issues)
- **Live Demo**: https://2025-12-01-memory-assist-bot.vercel.app/

---

**Built with ❤️ to strengthen human connections.**
