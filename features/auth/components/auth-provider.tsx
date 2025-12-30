'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getFavoritesAction } from '@/features/favorites/actions';
import { getWatchlistAction } from '@/features/watchlist/actions';
import { useFavoritesStore, useWatchlistStore } from '@/store';
import { supabase } from '@/features/auth/utils/supabase-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const setFavoritesFromServer = useFavoritesStore((state) => state.setFromServer);
  const setWatchlistFromServer = useWatchlistStore((state) => state.setFromServer);
  const clearFavorites = useFavoritesStore((state) => state.clear);
  const clearWatchlist = useWatchlistStore((state) => state.clear);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const sync = async () => {
      try {
        const [favoritesData, watchlistData] = await Promise.all([
          getFavoritesAction(),
          getWatchlistAction(),
        ]);
        if (cancelled) return;
        setFavoritesFromServer(favoritesData.items);
        setWatchlistFromServer(watchlistData);
      } catch {
        return;
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [user, setFavoritesFromServer, setWatchlistFromServer]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    clearFavorites();
    clearWatchlist();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
