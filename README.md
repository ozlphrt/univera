# Univera — College Guidance Made Simple

A mobile-first PWA helping high-school students and parents explore colleges, understand fit, build a list, and manage the admissions timeline.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Zustand** for state management
- **React Router** for navigation
- **Supabase** for backend (auth + DB + storage)
- **PWA** enabled (manifest + service worker)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  components/     # Reusable UI components
  modules/        # Feature modules (auth, onboarding, dashboard, etc.)
  stores/         # Zustand state stores
  api/            # API clients and wrappers
  utils/          # Utility functions
  hooks/          # Custom React hooks
  assets/         # Static assets
```

## Development

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`

## Documentation

See the project documentation files:
- `PROJECT_OVERVIEW.md` - High-level project overview
- `TASK_LIST.md` - Development roadmap
- `TECH_ARCHITECTURE.md` - Technical architecture
- `UI_UX_GUIDE.md` - Design guidelines
- `DATA_MODELS.md` - Data structures
- And more...

## License

Private project

