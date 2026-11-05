# PharmaKalCare updated project

This is an updated working copy of the local PharmaKalCare project. The original folder has not been changed. No credentials from the source `.env` were copied.

## Requirements

- Node.js 18 or newer and npm
- MongoDB (local or hosted)

## Configure and start

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `MONGO_URI` and a long random `JWT_SECRET`. Set a temporary `INITIAL_ADMIN_KEY` for the first account only.
3. In `backend/`, run `npm install`.
4. Run `npm start` (or `npm run dev` for development).
5. In a second terminal at the project root, run `python -m http.server 3000 --directory frontend`.
6. Open `http://localhost:3000/pages/login.html`.
7. Before any account exists, use the **First administrator** option with `INITIAL_ADMIN_KEY`. After creating that account, remove `INITIAL_ADMIN_KEY` from the environment and restart the backend. Public account registration creates Cashier accounts; an Admin can create and assign additional roles.

The API defaults to port 5000. The browser client uses `http://localhost:5000/api`; a deployment can set `window.API_BASE_URL` before `common.js` is loaded.

## Included areas

- Authenticated, role-gated API routes for inventory, sales, dashboard, users, and reports.
- Admin user management for creating accounts, assigning roles, and deleting other accounts.
- Personal profile editing, password changes, and profile picture uploads (JPEG/PNG/WEBP/GIF, 3 MB maximum).
- Sales summary report by date range.
- Shared browser session helper, profile avatar rendering, and sign-out behavior.

## Roles

- Admin: user administration and all app areas.
- Manager: reports, dashboard, inventory and sales.
- Pharmacist: dashboard, inventory and sales.
- Cashier: sales and read-only inventory.

The backend enforces permissions. Hiding links in the browser is only a usability aid.

## Notes

The original environment file was not copied. User-uploaded profile pictures are written under `backend/uploads/profile-pictures/`. The editor tasks and a MongoDB connectivity diagnostic are retained. This copy has not been run against a live MongoDB instance in this workspace.



