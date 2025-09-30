# DreamAlign Lite - AI-Powered Career Development Platform

## Project Overview
DreamAlign Lite is a Next.js 15 application that provides AI-powered career development tools including personalized dashboards, AI interview practice, and career path recommendations.

## Tech Stack
- **Frontend**: Next.js 15 with React 18, TypeScript, TailwindCSS
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk (keyless development mode supported)
- **AI Integrations**: OpenAI and Google Gemini (via AI SDK)
- **Analytics**: Vercel Analytics, Custom analytics tracking
- **Additional Services**: Firecrawl (web scraping), Resend (email), Scorecard (AI analytics)

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── analytics/           # Analytics tracking endpoint
│   │   └── scrape/              # Web scraping endpoints
│   ├── dashboard/               # Dashboard page
│   ├── profile/                 # Profile page
│   ├── interview/               # AI Interview page
│   ├── ConvexClientProvider.tsx # Convex setup with fallback UI
│   └── Provider.tsx             # Global providers wrapper
├── lib/                         # Utility libraries
│   ├── integrations/            # Third-party integrations
│   │   ├── openai.ts           # OpenAI integration
│   │   ├── gemini.ts           # Google Gemini integration
│   │   └── firecrawl.ts        # Web scraping integration
│   ├── ai-provider.ts          # AI provider utilities
│   ├── analytics.ts            # Analytics tracking
│   └── convex.tsx              # Convex client utilities
├── convex/                      # Convex backend schema
├── components/                  # React components
└── middleware.ts               # Next.js middleware with auth handling
```

## Current Status

### Working Features

- ✅ Next.js development server running on port 3000
- ✅ Homepage loads successfully with branding and navigation
- ✅ Dashboard page loads with loading state
- ✅ Profile page loads with loading state
- ✅ Interview page compiles successfully
- ✅ Analytics tracking functional (with local fallback)
- ✅ Clerk authentication in keyless development mode
- ✅ Convex integration with graceful fallback
- ✅ No critical TypeScript errors

### Requires Configuration (Optional)

⚠️ **Clerk Authentication**: Currently in keyless mode. For full auth features:
  - Visit the Clerk dashboard URL shown in console
  - Claim your development keys
  - Add them to `.env.local`

⚠️ **Convex Database**: Backend database is configured but can be reconfigured:
  - Run `npx convex dev` to set up or switch deployments

⚠️ **AI Features**: API keys are configured in `.env.local` for:
  - OpenAI (for GPT models)
  - Google Gemini (for Gemini models)
  - Services will fallback to mock data if keys are invalid

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Set up Convex (if needed)
npx convex dev

# Type checking
npx tsc --noEmit
```

## Environment Variables

Key environment variables in `.env.local`:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Clerk (commented out for keyless mode)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...

# URLs
NEXT_PUBLIC_CLERK_SIGNIN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGNUP_URL=/auth/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Optional Services
RESEND_API_KEY=...
SCORECARD_API_KEY=...
FIRECRAWL_API_KEY=...
```


## User Preferences

- Clean, minimal error handling with user-friendly messages
- Development-first approach with production-ready fallbacks
- Graceful degradation when services are unavailable

## Architecture Decisions

### Why Graceful Degradation?
The application is designed to work even when external services (Convex, Clerk, AI APIs) are not configured. This enables:
- Faster onboarding for new developers
- Testing without full service setup
- Resilience against service outages

### Why Keyless Clerk Mode?
Clerk's keyless mode allows development without managing secret keys, making it easier to test authentication flows and UI components.

### Why Turbopack?
Next.js 15 uses Turbopack by default for faster development builds and hot module replacement.

## Future Improvements

- Add proper error boundaries for better error handling
- Implement comprehensive test coverage
- Add Storybook for component documentation
- Set up CI/CD pipeline for automated deployments
- Add proper logging and monitoring for production

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)

---

*Last Updated: September 29, 2025*
