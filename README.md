# AI-Powered Travel Lead Assistant (Vagabond)

An enterprise-grade, production-ready AI-Powered Travel Lead Assistant web application designed for premium travel agencies to automate inquiries, capture customer travel details, assess buying signals, score qualification parameters, and register qualified sales leads directly to MongoDB.

---

## 1. PRODUCT & ARCHITECTURE OVERVIEW

This application uses a split-tier architecture built with React 19 (Vite) and Node.js/Express in strict TypeScript mode. 

### Logical Architecture Flow
```
[Client App (React 19)]
        │ (1) User Message
        ▼
[Express Server (Node.js)] 
        │ (2) Read Memory Context & Message History
        ▼
   [MongoDB] 
        │ (3) Generate Prompt + Dynamic Inject Memory
        ▼
[Gemini 3.5 Flash API]
        │ (4) Structured JSON Response Validation (Zod)
        ▼
[Express Server] ────► Update DB Memory & History 
        │
        ├───► [Lead Scoring Service] ───► Auto-Upsert [Lead Collection]
        │
        ▼ (5) Return Reply, Intent Level, Live memory, Score breakdown
[Client Live UI Panel] (Reflected in Real-time)
```

1. **Frontend App**: Captures user input and updates conversation states via a React Context/`useReducer` framework. It renders a clean live-updating split screen tracking the travel profile details, progress meters, and missing checklists.
2. **Backend API**: Decoupled routes process messages, load conversation parameters from MongoDB, validate schema bounds, log requests with request IDs, apply rate limits, and coordinate interactions with the LLM.
3. **Structured AI Layer**: Uses **Google Gemini 3.5 Flash** with JSON mode. Responses are parsed, validated against Zod schemas, and repaired using fallback algorithms if errors arise.
4. **Lead Scoring & Intent Detection**: Pure, explainable service layers determine buying confidence levels and assign numeric points to captured parameters.

---

## 2. FEATURE LIST

*   **Warm Conversational Agent (Maya)**: Real-time, friendly travel consultant persona that asks exactly one prioritized question per turn.
*   **Persistent Conversation Memory**: Retains and merges parameters across topic shifts, early info disclosures, or short inputs.
*   **Live Trip Profile Panel**: Displays captured parameters, a progress bar, checklist of remaining info, and a live-generated natural text summary.
*   **Rule-based Explainable Lead Scoring**: Audit-trail details on point distributions, mapping leads into Low/Medium/High confidence bands.
*   **Dynamic Intent Detection**: Combines LLM intent classification with local rule-based fallback keyword detectors.
*   **Auth-Guarded Admin Dashboard**: Real-time analytics charts, searchable leads directory, detailed lead details with conversation history transcripts, deletion options, and raw CSV export.
*   **Robust Security Hardening**: Helmet CSP, CORS origin whitelisting, Express rate limiters, strict schema sanitization (NoSQL injection defense), and httpOnly refresh token rotation.
*   **Graceful Degenerative states**: Fallback prompts and repair cycles handling AI service or database disconnects.

---

## 3. FOLDER STRUCTURE

```
travel-lead-assistant/
├── client/
│   ├── src/
│   │   ├── app/                 # Providers, router config
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn component primitives
│   │   │   ├── chat/            # ChatWindow, message bubbles, input
│   │   │   └── lead-panel/      # ProgressBar, FieldRow, gauge meter
│   │   ├── pages/                # Home planner, Admin dashboard, Login, Lead details
│   │   ├── hooks/                # useChat, useLead, useAuth, useConversation
│   │   ├── context/              # State context structures
│   │   ├── services/             # Axios API client endpoints
│   │   ├── types/                # TypeScript shared schemas
│   │   ├── utils/                # formatters, validators, cn class mergers
│   │   └── styles/               # index.css Tailwind base imports
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/                # DB, Logger, Constants, Env loader
│   │   ├── controllers/           # Chat, Leads, Auth route controllers
│   │   ├── routes/                # Mount parameters under /api/v1
│   │   ├── services/
│   │   │   ├── ai/                 # Gemini connector, prompt builder, json repair
│   │   │   ├── leadScoring.service.ts
│   │   │   ├── intentDetection.service.ts
│   │   │   └── conversation.service.ts
│   │   ├── middleware/            # Rate limiting, auth, logs, error handlers
│   │   ├── models/                # Mongo Schemas: Lead, Conversation, Admin
│   │   ├── prompts/                # Consultant system prompts, examples
│   │   ├── validation/             # Request schema validation
│   │   ├── utils/                  # ApiError wrapper, async handlers
│   │   └── app.ts / server.ts     # Server startup and Express configurations
│   ├── tests/
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml
├── README.md
└── .env.example
```

---

## 4. ENVIRONMENT VARIABLES

### Root Configuration (`.env.example`)
```env
# ─── SERVER CONFIGS ───
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/travel-lead-assistant
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
JWT_ACCESS_SECRET=your_access_token_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
ADMIN_EMAIL=admin@travelassistant.com
ADMIN_PASSWORD=Admin@12345678

# ─── CLIENT CONFIGS ───
VITE_API_URL=
```

---

## 5. INSTALLATION & SETUP

### Prerequisites
*   Node.js v22 (LTS)
*   MongoDB Atlas cluster (or local MongoDB database)
*   Google Gemini API Key

### Standard Development Setup
1.  **Clone the workspace** and navigate to root directory.
2.  **Configure environments**: Create `.env` files matching `.env.example` configurations.
3.  **Install dependencies and start server**:
    ```bash
    cd server
    npm install
    # Start development watcher
    npm run dev
    ```
4.  **Seed the Admin user**:
    ```bash
    # From the server directory
    ADMIN_EMAIL=admin@travelassistant.com ADMIN_PASSWORD=Admin@12345678 npm run seed:admin
    ```
5.  **Install client and start front-end**:
    ```bash
    cd ../client
    npm install
    # Start client dev server
    npm run dev
    ```
6.  Navigate to `http://localhost:3000` to start using Vagabond.

---

## 6. SCORING & INTENT LOGIC

### Rule-Based Scoring Matrix
Points are allocated to fields to assess traveler qualified states.

| Field | Weight |
|---|---|
| Destination | 15 points |
| Travel Date | 10 points |
| Budget | 15 points |
| Number of Travellers | 10 points |
| Trip Type | 10 points |
| Duration | 5 points |
| Departure City | 5 points |
| Special Requirements | 5 points |
| Customer Name | 10 points |
| Phone Number | 15 points |
| **Max Score** | **100 points** |

Leads are categorized into **Confidence Bands** based on their score:
*   `0 – 39`: **Low** Confidence
*   `40 – 69`: **Medium** Confidence
*   `70 – 100`: **High** Confidence

---

## 7. API DOCUMENTATION

All REST APIs are structured under `/api/v1`.

### Endpoint Definitions

| Method | Route | Auth | Payload | Purpose |
|---|---|---|---|---|
| `POST` | `/api/v1/chat` | Public | `{ "message": "string", "conversationId": "uuid" }` | Send user message to Maya |
| `POST` | `/api/v1/lead` | Public | `{ "conversationId": "uuid" }` | Save or finalize lead profile |
| `GET` | `/api/v1/leads` | Public | Query filters (`page`, `limit`, `confidence`) | Paginated list of captured leads |
| `GET` | `/api/v1/lead/:id` | Public | None | Retrieve specific lead details |
| `DELETE` | `/api/v1/lead/:id` | Admin JWT | None | Delete a captured lead record |
| `GET` | `/api/v1/conversations/:id` | Admin JWT | None | Get chat messages list for a lead |
| `GET` | `/api/v1/leads/export` | Admin JWT | None | Export leads to CSV file |
| `POST` | `/api/v1/auth/login` | Public | `{ "email": "string", "password": "pwd" }` | Get Admin access + refresh tokens |
| `POST` | `/api/v1/auth/refresh` | Public | `{ "refreshToken": "string" }` | Rotate and issue token pairs |

---

## 8. DOCKER & CONTAINER USAGE

To start the database, server, and client containers locally in one command:

```bash
# Add GEMINI_API_KEY to your environment variables
# Run docker compose
docker-compose up --build
```
*   **Client app**: Serves on `http://localhost:3000` via Nginx.
*   **Server API**: Exposes port `3001` (with proxy configurations mapping automatically).
*   **MongoDB**: Run locally inside container, persistence using named volume mounts.

---

## 9. FUTURE IMPROVEMENTS

1.  **Voice Interaction (STT/TTS)**: Fully connect the placeholder voice button to transcription models.
2.  **Live WebSocket Notifications**: Push lead capture alerts live to admin dashboards.
3.  **CRM Integrations**: Add automated webhooks exporting High-confidence leads directly to Salesforce or HubSpot.
4.  **Vector Store Memory**: Add RAG pipelines mapping destination recommendation guides directly inside chat answers.
