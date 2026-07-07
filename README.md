# Signal — AI CRM Dashboard (Full Stack)

A complete MERN application: React (Vite) frontend + Express/MongoDB backend, with AI features powered by Groq.

```
ai-crm-fullstack/
├── client/     # React + Vite + Tailwind frontend
└── server/     # Express + MongoDB backend (ES Modules)
```

## Quick Start

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=your_port_number
MONGO_URI=mongodb://127.0.0.1:27017/your_mongodb_database_name
JWT_SECRET=replace_with_a_long_random_secret
GROQ_API_KEY=your_groq_api_key_here     # https://console.groq.com/keys
CLIENT_URL=your_server_number
```

### Use it

1. Open `http://localhost:server_number`
2. Create an account (Register page)
3. Add contacts, leads, deals, and tasks
4. Click the AI score ring on any lead to get a Groq-powered score + rationale
5. Click the mail icon on a lead to generate an AI follow-up email draft
6. Click "Ask AI" in the sidebar to chat with the CRM assistant

## What's included

**Backend** (`server/`) — Express, Mongoose, JWT auth, full CRUD for Contacts/Leads/Deals/Tasks, and Groq-powered AI endpoints (chat, lead scoring, email drafting, note summarization). See `server/README.md` for the full API reference.

**Frontend** (`client/`) — React 18 + Vite + Tailwind. Pages: Login/Register, Overview dashboard, Contacts, Leads (with AI scoring), Deals (kanban by stage), Tasks. A slide-over AI Assistant chat panel is available from any page.

## Notes

- Both `.env` files are excluded from this zip — copy the `.env.example` in each folder and fill in your own values (especially `GROQ_API_KEY` and `MONGO_URI`).
- `node_modules` and `dist` folders are excluded — run `npm install` in both `client/` and `server/` before starting.
- Make sure `CLIENT_URL` in the backend `.env` matches wherever your frontend actually runs, or CORS will block requests.
