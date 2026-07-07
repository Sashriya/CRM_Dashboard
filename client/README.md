# Signal — AI CRM Frontend

React + Vite frontend for the AI CRM Dashboard, wired up to the Express/MongoDB/Groq backend.

## Features

- Auth (login/register) against the backend's JWT API
- Contacts, Leads, Deals (kanban board), Tasks — full CRUD
- AI features surfaced in the UI:
  - **Signal Ring** — click the ring next to any lead to run AI scoring (calls `/api/ai/leads/:id/score`)
  - **Email draft** — generate a follow-up email for any lead in one click
  - **Ask AI** — slide-over chat assistant in the sidebar, powered by Groq via the backend

## Setup

1. Make sure the backend (`ai-crm-backend`) is running — by default at `http://localhost:8000`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
   Adjust the port to match your backend's `PORT` value.

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`.

5. Make sure the backend's `.env` has `CLIENT_URL=http://localhost:5173` so CORS allows requests from this app.

## First run

1. Go to `/register` and create an account.
2. You'll land on the Overview dashboard.
3. Add a Contact, then a Lead — click the empty ring next to a lead to get an AI score and rationale.
4. Try "Ask AI" in the sidebar for a general assistant, or the mail icon on a lead row for a drafted follow-up email.

## Project Structure

```
src/
├── api/
│   ├── client.js       # axios instance + auth header/401 handling
│   └── resources.js    # grouped API calls (auth, contacts, leads, deals, tasks, ai)
├── components/
│   ├── AppLayout.jsx    # sidebar + shell
│   ├── AIAssistant.jsx  # slide-over AI chat panel
│   ├── SignalRing.jsx   # AI lead-score gauge
│   ├── Modal.jsx, PageHeader.jsx, StatCard.jsx, FormControls.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx  # user session state
├── pages/
│   ├── auth/Login.jsx, auth/Register.jsx
│   ├── Overview.jsx, Contacts.jsx, Leads.jsx, Deals.jsx, Tasks.jsx
├── App.jsx
└── main.jsx
```

## Notes

- Tokens are stored in `localStorage` under `crm_token` / `crm_user`. A 401 response anywhere clears them and redirects to `/login`.
- Styling uses Tailwind CSS with a custom token set (see `tailwind.config.js`) — indigo primary, orange "signal" accent for AI touches, mint for positive states.
- No backend build step is required beyond running `npm run dev` in the `ai-crm-backend` folder alongside this app.
