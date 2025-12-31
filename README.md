# Filmazia

A modern, full-featured movie tracker application with a cinematic design aesthetic. Browse, search, and track your favorite movies and TV shows using data from TMDB (The Movie Database).

![Filmazia](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)

## Features

- **Browse & Discover** - Explore trending and popular movies and TV shows
- **Advanced Search** - Search with filters for genre, year, rating, and more
- **Personal Watchlist** - Save movies you want to watch later
- **Favorites Collection** - Build your personal favorites library
- **Ratings & Reviews** - See the rating of the movie
- **User Profile** - View your statistics and rating history will be coming soon
- **Export Data** - Download your watchlist, favorites, and ratings as JSON
- **Responsive Design** - Beautiful cinematic UI that works on all devices
- **Dark Theme** - Easy on the eyes with a cinematic brutalism design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Supabase
- **API**: TMDB (The Movie Database)

## Prerequisites

Before running this project, ensure you have:

- **Node.js** v18 or higher installed
- **npm** or **yarn** package manager
- **TMDB API Key** - Get one free at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **Supabase Project** - Create one at [https://supabase.com](https://supabase.com)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd filmazia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPabase_ANON_KEY=your_supabase_anon_key
```

#### Getting Your TMDB API Key:

1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Sign up or log in
3. Click "Request an API Key"
4. Choose "Developer"
5. Fill in the form and submit
6. Copy your API key (v3 auth)

#### Getting Your Supabase Credentials:

1. Go to [https://supabase.com](https://supabase.com) and create a project
2. Go to Project Settings → API
3. Copy your project URL and anon/public key

### 4. Run Database Migrations

```bash
npx drizzle-kit push:pg
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
filmazia/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── movies/            # Movies pages
│   ├── tv/                # TV shows pages
│   ├── search/            # Search page
│   ├── watchlist/         # Watchlist page
│   ├── favorites/         # Favorites page
│   ├── profile/           # User profile page
│   └── auth/              # Authentication pages
├── features/              # Feature-based architecture
│   ├── auth/              # Authentication logic
│   ├── movies/            # Movie feature
│   ├── tv/                # TV show feature
│   ├── search/            # Search feature
│   ├── watchlist/         # Watchlist feature
│   ├── favorites/         # Favorites feature
│   ├── ratings/           # Ratings feature
│   └── profile/           # Profile feature
├── shared/                # Shared utilities
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── tmdb/              # TMDB API client
│   └── config/            # Configuration and constants
└── store/                 # Zustand state stores
```

## Design System

### Colors

- **Cinematic Black**: `#0A0A0A`
- **Cinematic Dark**: `#141414`
- **Cinematic Gray**: `#1F1F1F`
- **Cinematic Light**: `#2A2A2A`
- **Accent Amber**: `#FFB800`

### Typography

- **Display Font**: Playfair Display (serif)
- **Body Font**: Space Grotesk (sans-serif)

### Design Philosophy

The application follows a "Cinematic Brutalism" design approach with:

- Dark cinematic theme
- Asymmetric layouts
- Distinctive typography
- Electric amber accent color
- Smooth animations
- Grain texture overlay

## API Reference

This project uses the [TMDB API](https://developers.themoviedb.org/3) for all movie and TV show data.

### Rate Limiting

- TMDB allows approximately 4 requests per second
- This app implements request debouncing and caching to respect rate limits

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add these in your deployment platform:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is not affiliated with TMDB. Data provided by The Movie Database (TMDB).

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for authentication and database

---

Built with ❤️ using Next.js and TMDB by Awais Raza
