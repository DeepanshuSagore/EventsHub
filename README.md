# College Events Hub

A React-based single-page application that showcases college events, hackathon collaboration posts, and student profiles. This project is a direct conversion of the original HTML/CSS/JavaScript implementation into a modern React app while preserving the existing design and behaviour.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The site will be available at <http://localhost:5173>.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── index.html          # Vite entry file
├── package.json        # Project metadata and scripts
├── src
│   ├── App.jsx         # Main application component
│   ├── data.js         # Seed data used throughout the app
│   ├── main.jsx        # React entry point
│   └── utils.js        # Shared helper functions
├── style.css           # Global styling (converted from original)
└── vite.config.js      # Vite configuration
```

## Backend API (hybrid Firebase + MongoDB)

The repository now includes an Express server (`server/`) that will back the React app with real authentication and profile persistence.

### Environment variables

Create the following files locally (they are git-ignored):

- `./.env.local`

	```env
	VITE_FIREBASE_API_KEY=replace-me
	VITE_FIREBASE_AUTH_DOMAIN=replace-me.firebaseapp.com
	VITE_FIREBASE_PROJECT_ID=replace-me
	VITE_FIREBASE_APP_ID=replace-me
	VITE_FIREBASE_MESSAGING_SENDER_ID=replace-me
	```

- `./server/.env`

	```env
	PORT=5000
	MONGODB_URI=your-mongodb-connection-string
	MONGODB_DB_NAME=eventsHub

	FIREBASE_PROJECT_ID=your-project-id
	FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
	FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
	```

See the accompanying `*.env.example` files for the same placeholders.

### Install & run the server

```bash
cd server
npm install
npm run dev
```

The API listens on port `5000` by default and exposes:

- `POST /api/auth/sync` — verifies the Firebase ID token, upserts a MongoDB user + profile, and returns both documents.
- `GET /api/profile/me` — returns the authenticated student profile.
- `PUT /api/profile/me` — updates profile fields (`name`, `studentId`, `department`, `skills`, etc.).

Attach the Firebase ID token to requests as `Authorization: Bearer <token>`.

## Notes

- Application state is currently persisted to `localStorage` under the `collegeEventsData` key while the new backend integration is in progress.
- Modals, navigation, filtering, and form submissions retain their original interactions, now implemented with React hooks.
- Role-based login prototype remains available for reference but will be replaced once Firebase authentication is wired into the frontend.
