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

## Notes

- Application state is persisted to `localStorage` under the `collegeEventsData` key, matching the original behaviour.
- Modals, navigation, filtering, and form submissions retain their original interactions, now implemented with React hooks.
- Role-based login prototype:
	- Admin password: `ThisAppleIsMajor`. Admins can publish immediately and review pending submissions from the Admin dashboard.
	- Event Heads can submit events for approval; Students can submit HackFinder posts. All non-admin submissions enter a pending queue until approved or rejected by the Admin.
	- Session data (current role and pending queues) is stored in `localStorage` for quick prototyping and should be replaced with a secure backend for production use.
