# Filmazia Movie Tracker - Implementation Plan

## 1. Problem Statement

**What is being built:**
A full-featured movie tracker application called "Filmazia" using TMDB API. This is a greenfield project - the codebase is completely empty except for AI configuration files.

**Core Features:**
- Browse popular/trending movies
- Search movies by title/genre with filters
- Detailed movie information pages
- Personal watchlist management
- Favorites collection
- User ratings and reviews
- User profile with statistics

**What is NOT included:**
- User authentication (localStorage-based persistence only)
- Social sharing features
- Movie streaming capabilities
- Payment processing
- Admin dashboard
- Mobile native app (web only)

**Design Philosophy:** "Cinematic Brutalism" - Dark cinematic theme, asymmetric layouts, distinctive typography (Playfair Display + Space Grotesk), electric amber accent color, grain texture overlay, smooth animations.

---

## 2. Assumptions

**Technical:**
1. User has valid TMDB API v3 key ready
2. Node.js v18+ and npm installed
3. LocalStorage for user data persistence (watchlist, favorites, ratings)
4. Deployment target: Vercel
5. TypeScript for type safety

**Design:**
1. Dark-themed default (cinematic aesthetic)
2. Mobile-first responsive design
3. Image-heavy UI with optimization
4. Pagination (20-24 items per page)

---

## 3. Proposed Approach

### Tech Stack
- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Styling:** Tailwind CSS v4+
- **State:** Zustand (lightweight, modern)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Components:** Headless UI + bespoke components
- **Storage:** LocalStorage

### Design Tokens
```typescript
colors: {
  cinematic: { black: '#0A0A0A', dark: '#141414', gray: '#1F1F1F', light: '#2A2A2A' },
  accent: { amber: '#FFB800', teal: '#0D9488' }
}
fonts: {
  display: 'Playfair Display' (serif),
  body: 'Space Grotesk' (sans-serif)
}
```

### File Structure
```
filmazia/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home
│   ├── layout.tsx         # Root layout
│   ├── movies/
│   │   ├── page.tsx       # Browse/Discover
│   │   └── [id]/page.tsx  # Movie details
│   ├── search/page.tsx
│   ├── watchlist/page.tsx
│   ├── favorites/page.tsx
│   └── profile/page.tsx
├── components/
│   ├── layout/            # Header, Footer, Nav
│   ├── movie/             # MovieCard, MovieHero, etc.
│   ├── ui/                # Button, Modal, Input, etc.
│   └── animations/        # Page transitions
├── lib/
│   ├── tmdb-api.ts        # TMDB API client
│   ├── tmdb-types.ts      # TypeScript types
│   └── utils.ts           # Utilities
├── store/
│   ├── watchlist-store.ts
│   ├── favorites-store.ts
│   ├── ratings-store.ts
│   └── ui-store.ts
└── .env.local             # TMDB API key
```

---

## 4. Step-by-Step Plan

### Phase 1: Foundation

#### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```
- Enable strict TypeScript mode
- Configure absolute imports (@/components, @/lib, @/store)
- Setup ESLint and Prettier
- **Deliverable:** Working Next.js app

#### Step 2: Configure Design System
Create `tailwind.config.ts` with custom theme:
- Design tokens (colors, spacing, breakpoints)
- Custom fonts (Playfair Display, Space Grotesk)
- CSS variables for consistency

Create `app/globals.css`:
- Base styles and resets
- Grain texture overlay
- Typography imports

Create `lib/constants.ts`:
- Export design tokens

#### Step 3: Install Dependencies
```bash
npm install zustand framer-motion lucide-react clsx tailwind-merge
npm install @headlessui/react react-hook-form date-fns
```
Create `lib/utils.ts`:
- `cn()` function for className merging

#### Step 4: Create Zustand Stores
Create store pattern with localStorage persistence:

`store/watchlist-store.ts`:
```typescript
interface WatchlistStore {
  items: Movie[]
  add: (movie: Movie) => void
  remove: (id: number) => void
  contains: (id: number) => boolean
}
```

`store/favorites-store.ts` - Same pattern
`store/ratings-store.ts` - Ratings and reviews
`store/ui-store.ts` - UI state (modals, sidebar)

#### Step 5: Build TMDB API Layer
Create `lib/tmdb-api.ts`:
```typescript
class TMDBClient {
  getTrending(timeWindow: 'day' | 'week')
  getPopular(page: number)
  getMovieDetails(id: number)
  searchMovies(query: string, filters: SearchFilters)
  getSimilarMovies(id: number)
  getMovieCredits(id: number)
  getGenres()
}
```

Create `lib/tmdb-types.ts` - TypeScript interfaces
Create `.env.local` - Add `NEXT_PUBLIC_TMDB_API_KEY`

**Critical File:** `lib/tmdb-api.ts` - Foundation of all data fetching

---

### Phase 2: Core Layout & Components

#### Step 6: Root Layout and Navigation
`app/layout.tsx`:
- Root layout with fonts and metadata
- HTML structure

`components/layout/header.tsx`:
- Sticky header with blur effect
- Search input
- Navigation links
- Mobile hamburger menu

`components/layout/footer.tsx`:
- Footer with links

`components/layout/mobile-nav.tsx`:
- Bottom navigation for mobile

#### Step 7: Movie Card Components
`components/movie/movie-card-poster.tsx`:
- Vertical poster card
- Hover effects (scale + shadow)
- Lazy loading images
- Add to watchlist/favorite buttons
- Rating display
- Accessibility (ARIA, keyboard)

`components/movie/movie-card-landscape.tsx` - Horizontal variant
`components/movie/movie-card-compact.tsx` - Small list variant
`components/movie/movie-rating-badge.tsx` - Rating display
`components/movie/movie-actions-menu.tsx` - Quick action dropdown

#### Step 8: Loading and Error States
`components/ui/loading-skeleton.tsx`:
- Card, list, detail skeletons
- Shimmer animation

`components/ui/error-boundary.tsx`:
- React error boundary

`components/ui/error-message.tsx`:
- Error display with retry

`components/ui/empty-state.tsx`:
- Empty list illustrations with CTAs

#### Step 9: UI Component Library
`components/ui/button.tsx`:
- Primary, secondary, ghost variants
- Multiple sizes
- Loading states

`components/ui/input.tsx` - Text, search inputs
`components/ui/select.tsx` - Custom dropdown
`components/ui/modal.tsx` - Dialog component
`components/ui/pagination.tsx` - Page navigation

#### Step 10: Movie Detail Page
`app/movies/[id]/page.tsx`:
- Server component for movie details
- Fetch movie data from TMDB

`components/movie/movie-hero.tsx`:
- Backdrop image with gradient
- Title, year, rating

`components/movie/movie-info.tsx`:
- Runtime, genres, release date

`components/movie/movie-overview.tsx`:
- Plot summary with expand

`components/movie/movie-cast.tsx`:
- Cast grid with photos

`components/movie/movie-recommendations.tsx`:
- Similar movies grid

**Critical File:** `app/movies/[id]/page.tsx` - Server component pattern template

---

### Phase 3: Features

#### Step 11: Home Page
`app/page.tsx`:
- Hero carousel (5 featured movies)
- Trending section
- Popular section
- Continue watching (if watchlist exists)

`components/home/hero-carousel.tsx`:
- Auto-play with controls
- Backdrop images

`components/home/trending-section.tsx`:
- Horizontal scroll grid

`components/home/popular-section.tsx`:
- Grid of popular movies

#### Step 12: Browse/Discover Page
`app/movies/page.tsx`:
- Browse page with filters

`components/discover/filters-sidebar.tsx`:
- Genre filter (multi-select)
- Year range
- Rating filter
- Sort dropdown

`components/discover/movie-grid.tsx`:
- Filtered results with pagination

#### Step 13: Search
`app/search/page.tsx`:
- Search results page

`components/search/search-bar.tsx`:
- Header search input with debounce

`components/search/search-autocomplete.tsx`:
- Dropdown suggestions

`components/search/search-results.tsx`:
- Results grid with filters

Recent searches in localStorage

#### Step 14: Watchlist
`app/watchlist/page.tsx`:
- User's saved movies

`components/watchlist/watchlist-grid.tsx`:
- Display saved movies
- Remove action
- Sort options
- Filter by watched status

`components/watchlist/watchlist-empty.tsx`:
- Empty state with CTA

#### Step 15: Favorites
`app/favorites/page.tsx`:
- User's favorites

`components/favorites/favorites-grid.tsx`:
- Display favorited movies
- Remove action

`components/favorites/favorites-folders.tsx`:
- Create custom collections
- Folder management

#### Step 16: Ratings and Reviews
`components/rating/rating-modal.tsx`:
- Rating input dialog

`components/rating/star-rating.tsx`:
- Interactive 1-10 star rating

`components/rating/review-form.tsx`:
- Written review (max 500 chars)

`app/profile/page.tsx`:
- User statistics
- Rating history
- Export data (JSON/CSV)

**Critical File:** `store/watchlist-store.ts` - State management pattern template

---

### Phase 4: Polish

#### Step 17: Animations
- Add Framer Motion to all interactive components
- Page transition fade/slide
- Card hover effects
- Button press feedback
- Modal spring animations
- Staggered list reveals
- Scroll-triggered animations

#### Step 18: Image Optimization
- Use Next.js Image for all TMDB images
- Progressive loading with blur placeholders
- Appropriate sizes (w154, w342, w500, w780)
- Preload critical images
- React.memo for expensive components
- Code splitting

#### Step 19: Accessibility
- Full keyboard navigation
- ARIA labels on interactive elements
- Focus indicators
- Screen reader support
- Skip to content link
- Proper heading hierarchy
- Color contrast (4.5:1 minimum)
- Reduced motion support

#### Step 20: Error Handling
`lib/error-logger.ts` - Client-side error tracking
`app/error.tsx` - Global error page
`app/not-found.tsx` - 404 page
- API error logging
- Recovery UI

---

### Phase 5: Testing & Deployment

#### Step 21: Testing
- Unit tests (Vitest) for API client and utilities
- Component tests (Testing Library) for critical UI
- E2E tests (Playwright) for key user flows

Critical flows to test:
1. Browse → Detail → Add to watchlist
2. Search → Filter → View results
3. Rate movie → View on profile
4. Persistence across sessions

#### Step 22: Deployment
- Set up Vercel project
- Configure environment variables
- Enable image optimization
- Configure caching
- Create production build
- Deploy

---

## 5. Edge Cases & Risks

| Risk | Mitigation |
|------|------------|
| TMDB rate limiting (4 req/sec) | Request queue with debounce, 5-min cache, use Server Actions |
| Heavy images slow load | Next.js Image with lazy load, blur placeholders, proper sizes |
| LocalStorage 5-10MB limit | Store only IDs, cleanup old data, storage check |
| Stale TMDB data | Revalidate: 1hr for popular, 24hr for old movies |
| Malformed API responses | Zod validation, TypeScript strict types, fallback values |
| Empty new user experience | Clear CTAs, trending movies in empty states |
| API key exposure | Proxy via API routes (optional), referer restrictions |
| XSS in reviews | Sanitize input, escape HTML, React XSS protection |

---

## 6. Acceptance Criteria

### Foundation
- [ ] Next.js 14+ runs locally with TypeScript strict mode
- [ ] Tailwind configured with custom theme
- [ ] Zustand stores persist to localStorage
- [ ] TMDB API fetches trending movies successfully

### Core Features
- [ ] Homepage shows trending and popular movies
- [ ] Hero carousel auto-plays with manual controls
- [ ] Movie detail pages load with all sections
- [ ] Search works with autocomplete
- [ ] Filters work on browse page
- [ ] Watchlist: add/remove/persists
- [ ] Favorites: add/remove/persists
- [ ] Ratings: 1-10 stars with reviews
- [ ] Profile shows statistics and history

### Polish
- [ ] Animations are smooth (60fps)
- [ ] Images load progressively
- [ ] App loads in <3 seconds on 4G
- [ ] Keyboard navigation works
- [ ] Mobile responsive

### Production
- [ ] Builds successfully
- [ ] Tests pass
- [ ] Deployed to Vercel
- [ ] All features work in production

---

## 7. Test Strategy

### Unit Tests (Vitest)
- API client methods
- Store actions and selectors
- Utility functions
- Target: 80% coverage

### Component Tests (Testing Library)
- MovieCard interactions
- SearchBar input and debounce
- RatingModal submission
- WatchlistGrid add/remove
- Target: 70% coverage

### E2E Tests (Playwright)
- Browse → Detail → Add to watchlist
- Search → Filter → View results
- Rate movie → View on profile
- Persistence across refresh

### Performance
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1
- Bundle < 300KB gzipped

### Accessibility
- axe-core DevTools
- Manual keyboard testing
- WAVE extension
- WCAG AA compliance

---

## Critical Files (Implementation Order)

1. **`lib/tmdb-api.ts`** - Core API integration, error handling, types. Foundation of all data fetching.

2. **`store/watchlist-store.ts`** - State management pattern. Template for all other stores with localStorage persistence.

3. **`tailwind.config.ts`** - Design system configuration. Defines visual language and ensures consistency.

4. **`app/movies/[id]/page.tsx`** - Server component pattern. Template for all detail pages using App Router.

5. **`components/movie/movie-card-poster.tsx`** - Reusable component architecture. Pattern for all components (typing, animations, accessibility, responsive).

---

## Frontend Design Guidelines (from frontend-design.md)

- **Anti-Generic:** Reject standard layouts. Create bespoke, asymmetric designs.
- **Typography:** Use Playfair Display (display) + Space Grotesk (body). Avoid Inter/Roboto.
- **Color:** Dark cinematic base with electric amber (#FFB800) accents.
- **Motion:** CSS animations, staggered reveals, hover surprises.
- **Backgrounds:** Grain texture, gradients, shadows - not solid colors.
- **Composition:** Asymmetry, overlap, diagonal flow, grid-breaking.
- **No Template Feel:** Every design choice should be intentional and unique.

---

## Refactoring Plan: Server Components & Server Actions

### Overview
Convert all `page.tsx` files from client components to server components. Data fetching will be done on the server using Server Actions and passed down to client components for interactivity.

### Current State Analysis

**Already Server Components:**
- [app/page.tsx](app/page.tsx) - Home (already server component)
- [app/movies/[id]/page.tsx](app/movies/[id]/page.tsx) - Movie Details (already server component)
- [app/tv/[id]/page.tsx](app/tv/[id]/page.tsx) - TV Show Details (already server component)

**Need Refactoring (Client Components):**
- [app/movies/page.tsx](app/movies/page.tsx) - Browse Movies (client-side fetching)
- [app/tv/page.tsx](app/tv/page.tsx) - Browse TV Shows (client-side fetching)
- [app/search/page.tsx](app/search/page.tsx) - Search (client-side fetching)
- [app/watchlist/page.tsx](app/watchlist/page.tsx) - Watchlist (client-side fetching)
- [app/favorites/page.tsx](app/favorites/page.tsx) - Favorites (client-side fetching)
- [app/profile/page.tsx](app/profile/page.tsx) - Profile (uses stores only)

---

## Step-by-Step Refactoring Plan

### Phase 1: Create Server Actions Layer

#### Step 1: Create Server Actions File
**File:** `app/actions.ts`

Create centralized server actions for all data fetching operations:

```typescript
'use server'

import { tmdb } from '@/lib/tmdb-api'
import { SearchFilters } from '@/lib/tmdb-types'

// Movies
export async function getMovies(filters: SearchFilters, page: number)
export async function getMovieFilters() // Returns genres, years, etc.

// TV Shows
export async function getTVShows(filters: TVFilters, page: number)
export async function getTVFilters() // Returns genres, providers, etc.

// Search
export async function searchContent(query: string, page: number)

// Bulk details fetch (for watchlist/favorites)
export async function getMoviesByIds(ids: number[])
export async function getTVShowsByIds(ids: number[])
```

**Key Benefits:**
- Single source of truth for server-side data fetching
- Reusable across multiple pages
- Easy to add caching and error handling
- Type-safe with TypeScript

---

### Phase 2: Refactor Browse Pages

#### Step 2: Movies Page Refactoring
**File:** [app/movies/page.tsx](app/movies/page.tsx)

**Current (Client Component):**
- `'use client'` directive
- `useState` for movies, filters, pagination
- `useEffect` for data fetching
- Direct TMDB API calls from client

**Target (Server Component):**
```typescript
// app/movies/page.tsx (Server Component)
import { MoviesClient } from './movies-client'

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { genre?: string; year?: string; sort?: string; page?: string }
}) {
  // Parse search params
  const page = Number(searchParams.page) || 1
  const filters = {
    genre: searchParams.genre ? Number(searchParams.genre) : undefined,
    year: searchParams.year ? Number(searchParams.year) : undefined,
    sortBy: searchParams.sort || 'popularity.desc',
  }

  // Fetch data on server
  const [movies, allGenres] = await Promise.all([
    getMovies(filters, page),
    getMovieFilters(),
  ])

  // Pass to client component for interactivity
  return <MoviesClient initialMovies={movies} initialFilters={filters} genres={allGenres} />
}
```

**New Client Component:**
```typescript
// app/movies/movies-client.tsx
'use client'

export function MoviesClient({ initialMovies, initialFilters, genres }) {
  // Use URL-based state management instead of useState
  // Update URL params on filter change (triggers server refetch)
  // Handle animations, loading states
}
```

**Benefits:**
- Initial page load is faster (server-side rendering)
- SEO friendly (content available to crawlers)
- Reduced client-side JavaScript
- Progressive enhancement (works without JS)

---

#### Step 3: TV Shows Page Refactoring
**File:** [app/tv/page.tsx](app/tv/page.tsx)

**Same approach as Movies page:**
- Create server action `getTVShows()`
- Create `TVFiltersClient` component
- Use URL search params for state
- Pass initial data from server

**Key Differences:**
- TV shows have additional provider filter
- Fetch TV genres instead of movie genres

---

### Phase 3: Refactor Search Page

#### Step 4: Search Page Refactoring
**File:** [app/search/page.tsx](app/search/page.tsx)

**Challenge:** Search is inherently interactive

**Solution: Hybrid Approach**
```typescript
// app/search/page.tsx (Server Component)
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = Number(searchParams.page) || 1

  // Only fetch if query exists
  const initialResults = query ? await searchContent(query, page) : null

  return <SearchClient initialQuery={query} initialResults={initialResults} />
}
```

**Client Component:**
- Handle search input with debounce
- Update URL on search (pushes to server)
- Show recent searches from localStorage
- Display results

---

### Phase 4: Refactor User Data Pages

#### Step 5: Watchlist Page Refactoring
**File:** [app/watchlist/page.tsx](app/watchlist/page.tsx)

**Challenge:** Watchlist data comes from localStorage (client-side only)

**Solution:**
```typescript
// app/watchlist/page.tsx (Server Component - passthrough)
export default function WatchlistPage() {
  // Can't fetch on server (localStorage)
  // Just render client component
  return <WatchlistClient />
}
```

**Optimization for Client Component:**
- Use server action `getMoviesByIds(ids)` to fetch multiple movies at once
- Batch fetch requests (reduce N+1 problem)
- Implement proper loading states

**Server Action:**
```typescript
export async function getWatchlistItems(ids: number[]) {
  const movies = await tmdb.getMoviesByIds(ids)
  return movies
}
```

---

#### Step 6: Favorites Page Refactoring
**File:** [app/favorites/page.tsx](app/favorites/page.tsx)

**Same approach as Watchlist:**
- Server component passthrough
- Client component reads from localStorage
- Use server action `getMoviesByIds()` for bulk fetching
- Handle folders (client-side only feature)

---

#### Step 7: Profile Page Refactoring
**File:** [app/profile/page.tsx](app/profile/page.tsx)

**Simplest case:**
- All data comes from localStorage stores
- No server fetching needed
- Keep as client component (minimal impact)
- OR make server component that renders client wrapper

```typescript
// app/profile/page.tsx
export default function ProfilePage() {
  return <ProfileClient />
}
```

---

### Phase 5: Create Reusable Client Components

#### Step 8: Extract Client Components
Create shared client components for interactive elements:

**New Files:**
- `app/movies/movies-client.tsx` - Movies browse interface
- `app/tv/tv-client.tsx` - TV browse interface
- `app/search/search-client.tsx` - Search interface
- `app/watchlist/watchlist-client.tsx` - Watchlist interface
- `app/favorites/favorites-client.tsx` - Favorites interface
- `app/profile/profile-client.tsx` - Profile interface

**Shared Pattern:**
```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export function PageClient({ initialData, initialFilters }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Update URL instead of useState
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  // Handle loading states, animations
  // Display data from props
}
```

---

## Implementation Summary

### Files to Create

| File | Purpose |
|------|---------|
| `app/actions.ts` | Server actions for all data fetching |
| `app/movies/movies-client.tsx` | Movies page client component |
| `app/tv/tv-client.tsx` | TV page client component |
| `app/search/search-client.tsx` | Search page client component |
| `app/watchlist/watchlist-client.tsx` | Watchlist client component |
| `app/favorites/favorites-client.tsx` | Favorites client component |
| `app/profile/profile-client.tsx` | Profile client component |

### Files to Modify

| File | Changes |
|------|---------|
| `app/movies/page.tsx` | Remove 'use client', add server data fetching |
| `app/tv/page.tsx` | Remove 'use client', add server data fetching |
| `app/search/page.tsx` | Remove 'use client', add server data fetching |
| `app/watchlist/page.tsx` | Simplify to passthrough |
| `app/favorites/page.tsx` | Simplify to passthrough |
| `app/profile/page.tsx` | Simplify to passthrough |

### Benefits of This Refactoring

1. **Performance:**
   - Faster initial page loads (server-side rendering)
   - Reduced client-side JavaScript bundle
   - Better SEO (content available to crawlers)

2. **User Experience:**
   - Progressive enhancement (works without JS)
   - Shareable URLs (filters in search params)
   - Better caching on server side

3. **Code Quality:**
   - Clearer separation of concerns
   - Reusable server actions
   - Easier to test server logic separately

4. **Scalability:**
   - Easier to add caching layers
   - Better for CDN edge caching
   - Reduced API rate limiting (server can cache)

---

## Migration Checklist

### Server Actions Setup
- [ ] Create `app/actions.ts` with all data fetching functions
- [ ] Add error handling and caching to actions
- [ ] Test actions individually

### Movies Page
- [ ] Create `MoviesClient` component
- [ ] Refactor `app/movies/page.tsx` to server component
- [ ] Implement URL-based filter state
- [ ] Test pagination and filters

### TV Page
- [ ] Create `TVClient` component
- [ ] Refactor `app/tv/page.tsx` to server component
- [ ] Test provider filter
- [ ] Verify all filters work

### Search Page
- [ ] Create `SearchClient` component with debounce
- [ ] Refactor `app/search/page.tsx` to server component
- [ ] Test search functionality
- [ ] Verify recent searches still work

### Watchlist Page
- [ ] Add `getMoviesByIds` server action
- [ ] Optimize `WatchlistClient` for bulk fetching
- [ ] Test hydration and data loading
- [ ] Verify remove functionality

### Favorites Page
- [ ] Optimize `FavoritesClient` for bulk fetching
- [ ] Test folder functionality
- [ ] Verify folder filtering works

### Profile Page
- [ ] Create `ProfileClient` wrapper
- [ ] Verify all store functionality works
- [ ] Test export functionality

### Final Testing
- [ ] Test all pages with JavaScript disabled
- [ ] Verify SEO metadata
- [ ] Check bundle size reduction
- [ ] Test error handling
- [ ] Verify localStorage features still work

---

# Feature-Based Architecture Refactoring

## Overview

Refactor the Filmazia application from a traditional folder-based structure (`components/`, `lib/`, `store/`) to a **feature-based architecture** where each feature contains all its related code (components, hooks, types, utils, actions, stores).

---

## Current Structure

```
filmazia/
├── app/
│   ├── actions.ts (all server actions)
│   ├── movies/page.tsx
│   ├── tv/page.tsx
│   ├── search/page.tsx
│   ├── watchlist/page.tsx
│   ├── favorites/page.tsx
│   ├── profile/page.tsx
│   └── auth/
├── components/
│   ├── movie/ (shared components)
│   ├── tv/ (shared components)
│   ├── home/ (home sections)
│   ├── layout/
│   ├── ui/ (reusable ui)
│   ├── pages/ (client components)
│   ├── search/
│   └── rating/
├── lib/
│   ├── tmdb-api.ts
│   ├── tmdb-types.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── supabase/
└── store/
    ├── watchlist-store.ts
    ├── favorites-store.ts
    ├── ratings-store.ts
    └── ui-store.ts
```

---

## Target Structure

```
filmazia/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── actions/
│   │   └── index.ts
│   ├── movies/
│   │   ├── components/
│   │   │   ├── movie-card-poster.tsx
│   │   │   ├── movie-hero.tsx
│   │   │   ├── movie-info.tsx
│   │   │   ├── movie-cast.tsx
│   │   │   ├── movie-overview.tsx
│   │   │   ├── movie-recommendations.tsx
│   │   │   ├── movie-actions-menu.tsx
│   │   │   ├── movie-rating-badge.tsx
│   │   │   └── movies-page-client.tsx
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── actions/
│   │   │   └── index.ts (server actions)
│   │   └── index.ts
│   ├── tv/
│   │   ├── components/
│   │   │   ├── tvshow-card-poster.tsx
│   │   │   ├── tvshow-hero.tsx
│   │   │   ├── tvshow-info.tsx
│   │   │   ├── tvshow-cast.tsx
│   │   │   ├── tvshow-overview.tsx
│   │   │   ├── tvshow-recommendations.tsx
│   │   │   └── tv-page-client.tsx
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── actions/
│   │   └── index.ts
│   ├── search/
│   │   ├── components/
│   │   │   ├── search-bar.tsx
│   │   │   └── search-page-client.tsx
│   │   ├── hooks/
│   │   │   └── use-search-debounce.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── actions/
│   │   └── index.ts
│   ├── watchlist/
│   │   ├── components/
│   │   │   └── watchlist-page-client.tsx
│   │   ├── hooks/
│   │   │   └── use-hydrated-watchlist.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── store/
│   │   │   └── watchlist-store.ts
│   │   └── index.ts
│   ├── favorites/
│   │   ├── components/
│   │   │   └── favorites-page-client.tsx
│   │   ├── hooks/
│   │   │   └── use-hydrated-favorites.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── store/
│   │   │   └── favorites-store.ts
│   │   └── index.ts
│   ├── ratings/
│   │   ├── components/
│   │   │   ├── star-rating.tsx
│   │   │   └── rating-modal.tsx
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── store/
│   │   │   └── ratings-store.ts
│   │   └── index.ts
│   ├── profile/
│   │   ├── components/
│   │   │   └── profile-page-client.tsx
│   │   ├── hooks/
│   │   │   └── use-profile-stats.ts
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── home/
│       ├── components/
│       │   ├── hero-carousel.tsx
│       │   ├── trending-section.tsx
│       │   ├── popular-section.tsx
│       │   ├── upcoming-section.tsx
│       │   ├── trending-tv-section.tsx
│       │   └── popular-tv-section.tsx
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── shared/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── pagination.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-message.tsx
│   │   ├── video-modal.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── index.ts
│   ├── tmdb/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── index.ts
│   └── utils/
│       └── index.ts
└── app/ (routes only, minimal logic)
```

---

## Feature Breakdown

### 1. Auth Feature
**Route:** `app/auth/`
**Source Files:** `lib/supabase/`, `components/auth-provider.tsx`

| Subfolder | Contents |
|-----------|----------|
| `components/` | AuthProvider component |
| `hooks/` | useAuth, useUser |
| `types/` | User, Session types |
| `utils/` | Supabase client, auth helpers |
| `actions/` | signIn, signOut, signUp server actions |

### 2. Movies Feature
**Route:** `app/movies/`
**Source Files:** `components/movie/`, `app/actions.ts` (movie actions), `store/ratings-store.ts`

| Subfolder | Contents |
|-----------|----------|
| `components/` | MovieCardPoster, MovieHero, MovieInfo, MovieCast, MovieOverview, MovieRecommendations, MovieActions, MoviesPageClient |
| `hooks/` | useMovie, useMovies, useMovieFilters |
| `types/` | Movie-specific type extensions |
| `utils/` | Movie-related utilities |
| `actions/` | getMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getUpcomingMovies, getMovieGenres, getMovieProviders, getMoviesByIds |

### 3. TV Feature
**Route:** `app/tv/`
**Source Files:** `components/tv/`, `app/actions.ts` (TV actions)

| Subfolder | Contents |
|-----------|----------|
| `components/` | TVShowCardPoster, TVShowHero, TVShowInfo, TVShowCast, TVShowOverview, TVShowRecommendations, TVPageClient |
| `hooks/` | useTVShow, useTVShows, useTVFilters |
| `types/` | TV-specific type extensions |
| `utils/` | TV-related utilities |
| `actions/` | getTVShows, getTVShowDetails, getTrendingTVShows, getPopularTVShows, getTVGenres, getTVProviders, getTVShowsByIds |

### 4. Search Feature
**Route:** `app/search/`
**Source Files:** `components/search/`, `app/actions.ts` (search actions)

| Subfolder | Contents |
|-----------|----------|
| `components/` | SearchBar, SearchPageClient |
| `hooks/` | useSearch, useSearchDebounce |
| `types/` | Search filters, results types |
| `utils/` | Search utilities |
| `actions/` | searchContent (movies + TV) |

### 5. Watchlist Feature
**Route:** `app/watchlist/`
**Source Files:** `components/pages/watchlist-client.tsx`, `store/watchlist-store.ts`

| Subfolder | Contents |
|-----------|----------|
| `components/` | WatchlistPageClient |
| `hooks/` | useWatchlist, useHydratedWatchlist |
| `types/` | WatchlistItem types |
| `utils/` | Watchlist utilities |
| `store/` | WatchlistStore (Zustand) |

### 6. Favorites Feature
**Route:** `app/favorites/`
**Source Files:** `components/pages/favorites-client.tsx`, `store/favorites-store.ts`

| Subfolder | Contents |
|-----------|----------|
| `components/` | FavoritesPageClient, FolderManager |
| `hooks/` | useFavorites, useHydratedFavorites |
| `types/` | FavoriteItem, Folder types |
| `utils/` | Favorites utilities |
| `store/` | FavoritesStore (Zustand) |

### 7. Ratings Feature
**Source Files:** `components/rating/`, `store/ratings-store.ts`

| Subfolder | Contents |
|-----------|----------|
| `components/` | StarRating, RatingModal |
| `hooks/` | useRatings, useMovieRating |
| `types/` | Rating types |
| `utils/` | Rating utilities |
| `store/` | RatingsStore (Zustand) |

### 8. Profile Feature
**Route:** `app/profile/`
**Source Files:** `app/profile/page.tsx`, store aggregations

| Subfolder | Contents |
|-----------|----------|
| `components/` | ProfilePageClient |
| `hooks/` | useProfileStats, useExportData |
| `types/` | Profile stats types |
| `utils/` | Export utilities |

### 9. Home Feature
**Route:** `app/page.tsx`
**Source Files:** `components/home/`

| Subfolder | Contents |
|-----------|----------|
| `components/` | HeroCarousel, TrendingSection, PopularSection, UpcomingSection, TrendingTVSection, PopularTVSection |
| `hooks/` | useTrending, usePopular |
| `types/` | Home section types |

### 10. Shared Layer
**Purpose:** Reusable code across features

| Subfolder | Contents |
|-----------|----------|
| `ui/` | All reusable UI components (Button, Input, Select, Modal, Pagination, Skeleton, EmptyState, ErrorMessage, VideoModal) |
| `layout/` | Header, Footer, MobileNav |
| `tmdb/` | API client, types (moved from lib/) |
| `config/` | Constants (moved from lib/) |
| `utils/` | General utilities (cn function, etc.) |

---

## Implementation Phases

### Phase 1: Setup Shared Layer
**Goal:** Create foundation for features to depend on

1. Create `shared/` directory structure
2. Move `components/ui/*` → `shared/ui/`
3. Move `components/layout/*` → `shared/layout/`
4. Move `lib/tmdb-api.ts` → `shared/tmdb/api.ts`
5. Move `lib/tmdb-types.ts` → `shared/tmdb/types.ts`
6. Move `lib/constants.ts` → `shared/config/constants.ts`
7. Move `lib/utils.ts` → `shared/utils/index.ts`
8. Create barrel exports (index.ts) for each shared folder

### Phase 2: Auth Feature
1. Create `features/auth/` structure
2. Move auth-related files from `lib/supabase/` and `components/auth-provider.tsx`
3. Create `features/auth/index.ts` with exports

### Phase 3: Movies Feature
1. Create `features/movies/` structure
2. Move all `components/movie/*` except TVShowCardPoster
3. Extract movie actions from `app/actions.ts` → `features/movies/actions/`
4. Create `features/movies/index.ts` with exports
5. Update imports in `app/movies/page.tsx`

### Phase 4: TV Feature
1. Create `features/tv/` structure
2. Move all `components/tv/*`
3. Move `components/movie/tvshow-card-poster.tsx` → `features/tv/components/`
4. Extract TV actions from `app/actions.ts` → `features/tv/actions/`
5. Create `features/tv/index.ts` with exports
6. Update imports in `app/tv/page.tsx`

### Phase 5: Search Feature
1. Create `features/search/` structure
2. Move `components/search/*`
3. Move `components/pages/search-client.tsx` → `features/search/components/`
4. Extract search actions from `app/actions.ts` → `features/search/actions/`
5. Create debounce hook → `features/search/hooks/use-search-debounce.ts`
6. Update imports in `app/search/page.tsx`

### Phase 6: Watchlist Feature
1. Create `features/watchlist/` structure
2. Move `components/pages/watchlist-client.tsx` → `features/watchlist/components/`
3. Move `store/watchlist-store.ts` → `features/watchlist/store/`
4. Extract hydration hook → `features/watchlist/hooks/use-hydrated-watchlist.ts`
5. Update imports in `app/watchlist/page.tsx`

### Phase 7: Favorites Feature
1. Create `features/favorites/` structure
2. Move `components/pages/favorites-client.tsx` → `features/favorites/components/`
3. Move `store/favorites-store.ts` → `features/favorites/store/`
4. Extract hydration hook → `features/favorites/hooks/use-hydrated-favorites.ts`
5. Update imports in `app/favorites/page.tsx`

### Phase 8: Ratings Feature
1. Create `features/ratings/` structure
2. Move `components/rating/*`
3. Move `store/ratings-store.ts` → `features/ratings/store/`
4. Create hooks for rating management

### Phase 9: Profile Feature
1. Create `features/profile/` structure
2. Extract profile component from `app/profile/page.tsx`
3. Create stats hook → `features/profile/hooks/use-profile-stats.ts`
4. Update imports in `app/profile/page.tsx`

### Phase 10: Home Feature
1. Create `features/home/` structure
2. Move `components/home/*`
3. Create hooks for data fetching
4. Update imports in `app/page.tsx`

### Phase 11: Update All Imports
1. Update import paths in all `app/*.tsx` files
2. Update cross-feature imports within features
3. Add path aliases to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"]
    }
  }
}
```

### Phase 12: Cleanup
1. Delete old empty directories:
   - `components/movie/`
   - `components/tv/`
   - `components/home/`
   - `components/search/`
   - `components/rating/`
   - `components/pages/`
   - `store/`
   - `lib/` (check if other files exist first)
2. Delete `app/actions.ts` (actions now in features)
3. Run build to verify no broken imports
4. Test all routes

---

## Import Path Examples

### Before (Current)
```typescript
import { MovieCardPoster } from '@/components/movie';
import { getMovies } from '@/app/actions';
import { useWatchlistStore } from '@/store';
```

### After (Refactored)
```typescript
import { MovieCardPoster } from '@/features/movies';
import { getMovies } from '@/features/movies/actions';
import { useWatchlistStore } from '@/features/watchlist';
```

### Shared Imports
```typescript
import { Button } from '@/shared/ui';
import { Header } from '@/shared/layout';
import { tmdb } from '@/shared/tmdb';
```

---

## tsconfig.json Updates

Add path aliases for cleaner imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"],
      "@/shared/ui/*": ["./shared/ui/*"],
      "@/shared/layout/*": ["./shared/layout/*"],
      "@/shared/tmdb/*": ["./shared/tmdb/*"],
      "@/shared/config/*": ["./shared/config/*"]
    }
  }
}
```

---

## Barrel Export Pattern

Each feature and shared folder should have an `index.ts` that exports its public API:

**Example: `features/movies/index.ts`**
```typescript
// Components
export { MovieCardPoster } from './components/movie-card-poster';
export { MovieHero } from './components/movie-hero';
export { MovieInfo } from './components/movie-info';
// ... more components

// Actions
export * from './actions';

// Hooks
export { useMovie } from './hooks/use-movie';
// ... more hooks

// Types
export type { MovieFilters } from './types';
```

This allows clean imports like:
```typescript
import { MovieCardPoster, getMovies, useMovie } from '@/features/movies';
```

---

## Files to Create Summary

### Directories to Create
- `features/auth/` + subfolders
- `features/movies/` + subfolders
- `features/tv/` + subfolders
- `features/search/` + subfolders
- `features/watchlist/` + subfolders
- `features/favorites/` + subfolders
- `features/ratings/` + subfolders
- `features/profile/` + subfolders
- `features/home/` + subfolders
- `shared/ui/`
- `shared/layout/`
- `shared/tmdb/`
- `shared/config/`
- `shared/utils/`

### Files to Move (Summary)
| From | To |
|------|-----|
| `components/ui/*` | `shared/ui/*` |
| `components/layout/*` | `shared/layout/*` |
| `lib/tmdb-api.ts` | `shared/tmdb/api.ts` |
| `lib/tmdb-types.ts` | `shared/tmdb/types.ts` |
| `lib/constants.ts` | `shared/config/constants.ts` |
| `lib/utils.ts` | `shared/utils/index.ts` |
| `components/movie/*` | `features/movies/components/*` |
| `components/tv/*` | `features/tv/components/*` |
| `components/home/*` | `features/home/components/*` |
| `components/search/*` | `features/search/components/*` |
| `components/rating/*` | `features/ratings/components/*` |
| `components/pages/*` | Individual feature components/ |
| `store/watchlist-store.ts` | `features/watchlist/store/` |
| `store/favorites-store.ts` | `features/favorites/store/` |
| `store/ratings-store.ts` | `features/ratings/store/` |
| `store/ui-store.ts` | Keep in root or move to shared |

### Actions to Extract from `app/actions.ts`
| Action | Destination |
|--------|-------------|
| `getMovies`, `getMovieDetails`, `getTrendingMovies`, `getPopularMovies`, `getUpcomingMovies`, `getMovieGenres`, `getMovieProviders`, `getMoviesByIds` | `features/movies/actions/` |
| `getTVShows`, `getTVShowDetails`, `getTrendingTVShows`, `getPopularTVShows`, `getTVGenres`, `getTVProviders`, `getTVShowsByIds` | `features/tv/actions/` |
| `searchContent` | `features/search/actions/` |
| `getWatchlistContent` | `features/watchlist/actions/` |
| `getFavoritesContent` | `features/favorites/actions/` |

---

## Benefits of Feature-Based Architecture

1. **Co-location:** All code for a feature lives together
2. **Easier Navigation:** Find related code quickly
3. **Better Scalability:** Add new features without clutter
4. **Clearer Boundaries:** Know what belongs where
5. **Independent Features:** Features can be extracted/moved easily
6. **Better Onboarding:** New devs understand structure faster
7. **Easier Testing:** Test features in isolation
8. **Code Reuse:** Shared layer is explicit

---

## Migration Checklist

- [ ] Create shared directory structure
- [ ] Move UI components to shared/ui
- [ ] Move layout components to shared/layout
- [ ] Move TMDB API to shared/tmdb
- [ ] Move constants to shared/config
- [ ] Create auth feature
- [ ] Create movies feature
- [ ] Create TV feature
- [ ] Create search feature
- [ ] Create watchlist feature
- [ ] Create favorites feature
- [ ] Create ratings feature
- [ ] Create profile feature
- [ ] Create home feature
- [ ] Update all import paths
- [ ] Update tsconfig.json with path aliases
- [ ] Delete old empty directories
- [ ] Delete app/actions.ts
- [ ] Run build - verify no errors
- [ ] Test all routes manually
- [ ] Verify all features work correctly
