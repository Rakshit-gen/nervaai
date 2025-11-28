# Detailed Setup Guide

Complete guide for setting up the AI Podcast Generator frontend for development and production.

## Table of Contents

1. [Requirements](#requirements)
2. [Supabase Configuration](#supabase-configuration)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)

---

## Requirements

### System Requirements
- Node.js 18.17+
- npm 9+ or yarn 1.22+
- Git

### Services Required
- Supabase account (free tier)
- Backend API (see backend setup guide)
- Vercel/Netlify account for deployment (free tier)

---

## Supabase Configuration

### 1. Create Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose a name and region
4. Wait for the project to initialize (~2 minutes)

### 2. Get API Keys

Navigate to Settings → API:

- **Project URL**: `https://your-project.supabase.co`
- **anon public**: Your anonymous/public API key

### 3. Configure Authentication

Navigate to Authentication → Providers:

#### Email Authentication
- Enable "Email" provider
- Configure email templates (optional)

#### Google OAuth (Optional)
1. Enable Google provider
2. Create OAuth credentials in Google Cloud Console:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing
   - Navigate to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - **IMPORTANT**: Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
     - ⚠️ **DO NOT** use `http://localhost:3000/auth/v1/callback` - this is incorrect!
     - The redirect URI must be your Supabase project URL, not your localhost URL
     - Replace `your-project` with your actual Supabase project reference ID
3. Enter Client ID and Secret in Supabase

### 4. Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `http://localhost:3000` (development)
- **Redirect URLs**: 
  - `http://localhost:3000/**` (development - allows any path on localhost:3000)
  - `https://your-domain.com/**` (production - allows any path on your domain)

**Note**: These are different from Google OAuth redirect URIs:
- **Google Cloud Console** → Use: `https://your-project.supabase.co/auth/v1/callback`
- **Supabase Dashboard** → Use: `http://localhost:3000/**` (with wildcard)

### 5. Storage Buckets (Optional)

For storing podcast files in Supabase:

1. Navigate to Storage
2. Create bucket: `podcast-files`
3. Set to public or configure RLS policies

---

## Local Development

### 1. Clone & Install

```bash
git clone <repository-url>
cd ai-podcast-frontend

npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

---

## Production Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel automatically builds and deploys on push
   - Custom domain configuration in Settings → Domains

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Add new site from Git

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   Same as Vercel, configure in Site settings

### Docker

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  neon: {
    cyan: '#00ffff',    // Primary accent
    pink: '#ff00ff',    // Secondary accent
    purple: '#a855f7',  // Tertiary accent
    green: '#00ff88',   // Success states
  },
}
```

### Animations

Modify keyframes in `tailwind.config.ts`:

```typescript
keyframes: {
  'glow-pulse': {
    '0%, 100%': { 
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' 
    },
    '50%': { 
      boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)' 
    },
  },
}
```

### Add New Persona Archetypes

Edit `src/components/wizard/persona-step.tsx`:

```typescript
const archetypes = [
  { id: 'custom', label: 'Your Archetype', description: 'Description here' },
  // Add more...
]
```

### Custom Components

All UI components are in `src/components/ui/`. They follow the Shadcn/UI pattern and can be customized freely.

---

## Troubleshooting

### Authentication Issues

**"Email not confirmed"**
- Check spam folder for confirmation email
- Disable email confirmation in Supabase for testing

**"Invalid login credentials"**
- Verify Supabase URL and key
- Check if email exists in Supabase Auth users

**"OAuth redirect error"**
- **For Google OAuth**: Verify the redirect URI in Google Cloud Console is `https://your-project.supabase.co/auth/v1/callback` (NOT localhost)
- **For Supabase**: Verify redirect URLs in Supabase Dashboard are `http://localhost:3000/**` (with wildcard)
- Ensure you're adding the redirect URI in the correct place:
  - Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs
  - Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

### API Connection

**"Failed to fetch"**
- Verify backend is running
- Check CORS configuration in backend
- Verify `NEXT_PUBLIC_API_URL` is correct

**"401 Unauthorized"**
- Ensure user is authenticated
- Check if token is being sent in headers

### Build Errors

**"Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

**"Type errors"**
```bash
# Check TypeScript errors
npm run lint
```

### WaveSurfer Issues

**"Waveform not rendering"**
- Ensure audio URL is accessible (CORS)
- Check browser console for WebAudio errors
- Verify audio format is supported

### Performance

**"Slow initial load"**
- Enable static optimization in Next.js
- Use dynamic imports for heavy components
- Optimize images with next/image

---

## Support

For issues and feature requests, please open a GitHub issue.
