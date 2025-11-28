# Quick Start Guide

Get the AI Podcast Generator frontend running in under 5 minutes.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free)
- Backend API running

## 1. Install Dependencies

```bash
# Clone repository
git clone <your-repo-url>
cd ai-podcast-frontend

# Install dependencies
npm install
```

## 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Settings → API
4. Copy your Project URL and anon key

### Enable Google OAuth (optional)

1. Go to Authentication → Providers → Google
2. Enable and configure with your Google OAuth credentials

## 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test the Flow

1. Click "Get Started" to create an account
2. Sign in with email or Google
3. Create a new episode from the dashboard
4. Follow the wizard to generate a podcast

## Common Issues

### "Supabase not configured"
- Verify your `.env.local` has the correct Supabase URL and key
- Restart the development server after changing env vars

### "API connection failed"
- Ensure the backend is running on port 8000
- Check CORS settings in the backend

### "Auth redirect not working"
- Verify `NEXT_PUBLIC_APP_URL` matches your frontend URL
- Check Supabase URL configuration in dashboard

## Next Steps

- See [setup_guide.md](setup_guide.md) for production deployment
- Customize the theme in `tailwind.config.ts`
- Add custom personas in the wizard
