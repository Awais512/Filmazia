'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Trash2, Check } from 'lucide-react';
import { useSettingsStore } from '@/store';
import type { PosterQuality, ViewMode } from '@/store';
import {
  getPreferencesAction,
  updatePreferencesAction,
} from '@/features/settings/actions';
import { cn } from '@/shared/utils';
import { Button } from '@/components/ui/button';

interface SettingsClientProps {
  userId: string;
}

type Section = 'content' | 'privacy';

export function SettingsClient({ userId }: SettingsClientProps) {
  const [activeSection, setActiveSection] = useState<Section>('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    posterQuality,
    viewMode,
    showRatings,
    showReleaseYear,
    privateProfile,
    setSettings,
    setFromServer: setSettingsFromServer,
  } = useSettingsStore();

  useEffect(() => {
    const loadPreferences = async () => {
      const result = await getPreferencesAction();
      if (result.success && result.data) {
        setSettingsFromServer(result.data);
      }
      setLoading(false);
    };
    loadPreferences();
  }, [setSettingsFromServer]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const result = await updatePreferencesAction({
      posterQuality,
      viewMode,
      showRatings,
      showReleaseYear,
      privateProfile,
    });

    setSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const sections = [
    { id: 'content' as Section, label: 'Content', icon: Settings },
    { id: 'privacy' as Section, label: 'Privacy & Data', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cinematic-black flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinematic-black">
      {/* Header */}
      <div className="border-b border-cinematic-gray">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">
            Customize your Filmazia experience
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                      activeSection === section.id
                        ? 'bg-accent-amber text-cinematic-black font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-cinematic-gray'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cinematic-dark border border-cinematic-gray rounded-xl p-6"
            >
              {/* Content Preferences Section */}
              {activeSection === 'content' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Content Preferences
                  </h2>

                  {/* Poster Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Poster Image Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as PosterQuality[]).map(
                        (quality) => (
                          <button
                            key={quality}
                            onClick={() => setSettings({ posterQuality: quality })}
                            className={cn(
                              'px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                              posterQuality === quality
                                ? 'bg-accent-amber text-cinematic-black border-accent-amber'
                                : 'bg-cinematic-black text-gray-400 border-cinematic-gray hover:border-gray-500'
                            )}
                          >
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Higher quality uses more data
                    </p>
                  </div>

                  {/* View Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Default View Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['grid', 'list'] as ViewMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSettings({ viewMode: mode })}
                          className={cn(
                            'px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                            viewMode === mode
                              ? 'bg-accent-amber text-cinematic-black border-accent-amber'
                              : 'bg-cinematic-black text-gray-400 border-cinematic-gray hover:border-gray-500'
                          )}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Show/Hide Ratings */}
                  <div className="flex items-center justify-between py-3 border-t border-cinematic-gray">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Show Ratings on Cards
                      </p>
                      <p className="text-xs text-gray-500">
                        Display star ratings on movie and TV show cards
                      </p>
                    </div>
                    <button
                      onClick={() => setSettings({ showRatings: !showRatings })}
                      className={cn(
                        'relative w-12 h-6 rounded-full transition-colors',
                        showRatings ? 'bg-accent-amber' : 'bg-cinematic-gray'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                          showRatings ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Show/Hide Release Year */}
                  <div className="flex items-center justify-between py-3 border-t border-cinematic-gray">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Show Release Year
                      </p>
                      <p className="text-xs text-gray-500">
                        Display release year on movie and TV show cards
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSettings({ showReleaseYear: !showReleaseYear })
                      }
                      className={cn(
                        'relative w-12 h-6 rounded-full transition-colors',
                        showReleaseYear ? 'bg-accent-amber' : 'bg-cinematic-gray'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                          showReleaseYear ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy & Data Section */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Privacy & Data
                  </h2>

                  {/* Private Profile */}
                  <div className="flex items-center justify-between py-3 border-t border-cinematic-gray">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Private Profile
                      </p>
                      <p className="text-xs text-gray-500">
                        Hide your profile, watchlist, and favorites from other
                        users
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSettings({ privateProfile: !privateProfile })
                      }
                      className={cn(
                        'relative w-12 h-6 rounded-full transition-colors',
                        privateProfile ? 'bg-accent-amber' : 'bg-cinematic-gray'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                          privateProfile ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Clear Cache */}
                  <div className="pt-6 border-t border-cinematic-gray">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Clear Local Cache
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Clear all locally stored data including favorites,
                          watchlist, and settings. This won't affect your
                          cloud data.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure? This will clear all local data.'
                              )
                            ) {
                              useSettingsStore
                                .getState()
                                .clearLocalCache();
                            }
                          }}
                          className="mt-3 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Clear Cache
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-cinematic-gray flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[100px]"
                >
                  {saving ? (
                    'Saving...'
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                {saveSuccess && (
                  <span className="text-sm text-green-500">
                    Settings saved successfully
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
