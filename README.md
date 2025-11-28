# AI Podcast Generator - Frontend

A premium Next.js frontend for the AI Podcast Generator platform. Features a cinematic black UI with neon accents, smooth animations, and a complete podcast creation workflow.

## Features

- **Landing Page**: Hero animations, feature showcases, and demo player
- **Authentication**: Supabase Auth with email/password and Google OAuth
- **Dashboard**: Episode overview, stats, and quick actions
- **Episode Wizard**: 4-step creation flow (Source → Personas → Preview → Generate)
- **Audio Player**: WaveSurfer.js integration with waveform visualization
- **Persona Editor**: Customizable AI speaker configurations
- **Episode Library**: Filterable, searchable episode management

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Shadcn/UI + Radix |
| State Management | Zustand |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Audio | WaveSurfer.js |
| Animations | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── create/page.tsx
│   │   ├── episodes/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── audio/
│   │   └── audio-player.tsx
│   ├── dashboard/
│   │   ├── episode-card.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── landing/
│   │   ├── cta-section.tsx
│   │   ├── demo-section.tsx
│   │   ├── features-section.tsx
│   │   ├── hero-section.tsx
│   │   └── how-it-works-section.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   └── navbar.tsx
│   ├── ui/
│   │   └── [shadcn components]
│   └── wizard/
│       ├── generate-step.tsx
│       ├── persona-step.tsx
│       ├── preview-step.tsx
│       ├── source-step.tsx
│       └── wizard-progress.tsx
├── lib/
│   ├── api.ts
│   ├── supabase.ts
│   └── utils.ts
└── stores/
    ├── auth-store.ts
    └── episode-store.ts
```

## Quick Start

See [quickstart.md](quickstart.md) for rapid setup.

## Full Setup

See [setup_guide.md](setup_guide.md) for detailed configuration.

## Design System

### Colors
- **Background**: Pure black (#000000)
- **Neon Cyan**: #00ffff (primary accent)
- **Neon Pink**: #ff00ff (secondary accent)
- **Neon Purple**: #a855f7 (tertiary accent)

### Effects
- Neon glow borders
- Glass morphism cards
- Gradient text
- Animated waveforms

## API Integration

The frontend connects to the FastAPI backend via REST API:

- `POST /api/v1/episodes/` - Create episode
- `GET /api/v1/episodes/` - List episodes
- `GET /api/v1/episodes/{id}` - Get episode
- `GET /api/v1/episodes/{id}/status` - Poll status
- `GET /api/v1/export/{id}/audio` - Download audio
- `GET /api/v1/export/{id}/transcript` - Get transcript

## License

MIT License
# nervaai
