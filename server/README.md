# AI CRM Dashboard — MERN Backend (ES Modules + Groq AI)

Backend API for the [AI CRM Dashboard UI](https://github.com/time-to-program/ai-crm-dashboard-ui-boilerplate-code) boilerplate. Built with Express + MongoDB (Mongoose), fully in **ES Module** syntax, with AI features powered by **Groq**.

## Features

- JWT authentication (register/login/me)
- CRUD for Contacts, Leads, Deals, Tasks
- AI endpoints (via Groq's ultra-fast inference):
  - Chat assistant for the dashboard
  - AI lead scoring (0–100 + rationale)
  - AI-generated email drafts (outreach/follow-up)
  - AI summarization of call notes/transcripts
- Centralized error handling
- Ownership-scoped data (each user only sees their own records)

## Tech Stack

- Node.js (ES Modules, `"type": "module"`)
- Express 4
- MongoDB + Mongoose
- Groq SDK (`groq-sdk`)
- JWT + bcryptjs for auth

## Project Structure

```
ai-crm-backend/
├── config/
│   ├── db.js            # MongoDB connection
│   └── groq.js          # Groq client setup
├── controllers/
│   ├── authController.js
│   ├── contactController.js
│   ├── leadController.js
│   ├── dealController.js
│   ├── taskController.js
│   └── aiController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Contact.js
│   ├── Lead.js
│   ├── Deal.js
│   └── Task.js
├── routes/
│   ├── authRoutes.js
│   ├── contactRoutes.js
│   ├── leadRoutes.js
│   ├── dealRoutes.js
│   ├── taskRoutes.js
│   └── aiRoutes.js
├── utils/
│   └── generateToken.js
├── .env.example
├── package.json
└── server.js
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ai-crm-dashboard
   JWT_SECRET=replace_with_a_long_random_secret
   JWT_EXPIRES_IN=7d
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   CLIENT_URL=http://localhost:5173
   ```

   Get a free Groq API key at https://console.groq.com/keys

3. **Run MongoDB** locally, or use a hosted MongoDB Atlas URI in `MONGO_URI`.

4. **Start the server**
   ```bash
   npm run dev    # with nodemon
   # or
   npm start
   ```

   Server runs at `http://localhost:5000`.

## API Reference

All private routes require header: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register `{ name, email, password, role? }` |
| POST | `/api/auth/login` | Login `{ email, password }` |
| GET | `/api/auth/me` | Get current user (private) |

### Contacts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contacts?search=` | List contacts |
| GET | `/api/contacts/:id` | Get one contact |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads?status=&source=` | List leads |
| GET | `/api/leads/:id` | Get one lead |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Deals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/deals?stage=` | List deals |
| GET | `/api/deals/:id` | Get one deal |
| POST | `/api/deals` | Create deal |
| PUT | `/api/deals/:id` | Update deal |
| DELETE | `/api/deals/:id` | Delete deal |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks?status=&priority=` | List tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### AI (Groq-powered)
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | `{ message, history? }` | Chat with the CRM AI assistant |
| POST | `/api/ai/leads/:id/score` | — | AI-score a lead, saves `aiScore` + `aiSummary` on the Lead |
| POST | `/api/ai/email-draft` | `{ recipientName, context, tone?, purpose? }` | Generate an email draft |
| POST | `/api/ai/summarize` | `{ text }` | Summarize call notes/transcripts |

### Example: AI chat request
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "message": "What should I prioritize today?" }'
```

## Connecting to the Frontend

The frontend (Vite React app) should point its API base URL at `http://localhost:5000/api` and store the JWT `token` returned by `/api/auth/login` (e.g. in localStorage) to attach as `Authorization: Bearer <token>` on subsequent requests. Make sure `CLIENT_URL` in `.env` matches your Vite dev server URL (default `http://localhost:5173`) for CORS to work.
