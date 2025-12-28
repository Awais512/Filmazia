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
