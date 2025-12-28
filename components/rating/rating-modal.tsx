'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Modal } from '@/components/ui';
import { Button, Input } from '@/components/ui';
import { StarRating } from './star-rating';
import { useRatingsStore } from '@/store';
import { Movie } from '@/lib/tmdb-types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

export default function RatingModal({ isOpen, onClose, movie }: RatingModalProps) {
  const { getRating, addRating, updateRating } = useRatingsStore();
  const existingRating = getRating(movie.id);

  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      if (existingRating) {
        updateRating(existingRating.id, rating, review);
      } else {
        addRating(movie, rating, review);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Movie" size="md">
      <div className="space-y-6">
        {/* Movie info */}
        <div className="flex items-center gap-4">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-lg"
            />
          )}
          <div>
            <h3 className="font-medium text-white">{movie.title}</h3>
            <p className="text-sm text-gray-400">{movie.release_date?.split('-')[0]}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">Your Rating</p>
          <StarRating rating={rating} onChange={setRating} size="lg" />
          <p className="text-sm text-accent-amber">
            {rating > 0 ? `${rating}/10` : 'Select a rating'}
          </p>
        </div>

        {/* Review */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Review (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your thoughts about this movie..."
            maxLength={500}
            rows={4}
            className="w-full bg-cinematic-gray border border-cinematic-light rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber resize-none"
          />
          <p className="text-xs text-gray-500 text-right">{review.length}/500</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {existingRating ? 'Update Rating' : 'Save Rating'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
