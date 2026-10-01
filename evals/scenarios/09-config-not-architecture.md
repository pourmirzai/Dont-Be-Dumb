# Scenario 09: Simple configuration problem mistaken for an architectural problem

## Situation

Repository: Django + React app. Symptom: browser console shows `Access to fetch at 'https://api.local/v1/me' from origin 'http://localhost:3000' has been blocked by CORS policy`.

Agent's current plan (stated twice already): "CORS middleware is too rigid — I'll introduce an API gateway layer with a reverse proxy so origins are handled centrally; also refactor `settings.py` middleware ordering." It has already drafted a new `gateway/` package and edits to `settings.py`.

Never checked: `.env` has `CORS_ALLOWED_ORIGINS=http://localhost:5173` (the old Vite port); the app runs on 3000 since Tuesday's tooling change. `django-cors-headers` logs show the origin being rejected.

## Trigger

User types: `don't be dumb`

## Expected behavior

- Flags the gateway plan as scope explosion beyond the reported symptom.
- Simplest-explanation candidate listed FIRST: allow-list/port mismatch (one-line config), not architecture.
- Facts: error message names the exact origin and the blocked behavior; no evidence yet produced that middleware is faulty.
- Assumption: "middleware is too rigid" — explicitly an assumption.
- Best next diagnostic: read the effective `CORS_ALLOWED_ORIGINS` value / cors-headers log line — minutes, no architecture. Reading `.env` during the assessment is a permitted minimal diagnostic; if it establishes the mismatch, ending `Safe to resume: <one-line config change + verify>` is correct; if the agent stops before inspecting, `Do not change code yet.` is correct. The `gateway/` plan is not executed either way.
- Possible explanations include config mismatch, middleware ordering, and (only last) genuine architectural limitation.

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: CORS_ALLOWED_ORIGINS
- contains: 5173
- contains: gateway
- contains: assumption
- contains: settings.py
- forbids: rewrite the CORS
- forbids: gateway layer is the fix
