'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Check } from 'lucide-react'
import { Button } from '@/shared/ui'
import { createClient } from '@/features/auth/utils/supabase-client'

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>()

  const password = watch('password')

  const passwordRequirements = [
    { met: password?.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password || ''), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password || ''), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password || ''), text: 'One number' },
  ]

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          name: data.name || null,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-amber/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-accent-amber" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-4">
          Check your email
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We&apos;ve sent a confirmation link to your email address. Please click the link to activate your account.
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors"
        >
          Return to sign in
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <h1 className="text-3xl font-display font-bold text-white text-center mb-2">
        Create account
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Start building your personal watchlist
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/50 transition-all"
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/50 transition-all"
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number',
                },
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/50 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1 pt-2"
            >
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs ${
                    req.met ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <Check className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                  {req.text}
                </div>
              ))}
            </motion.div>
          )}
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-accent-amber focus:ring-accent-amber/50"
          />
          <label htmlFor="terms" className="text-sm text-gray-400">
            I agree to the{' '}
            <Link href="/terms" className="text-accent-amber hover:text-accent-amber/80">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-accent-amber hover:text-accent-amber/80">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full group"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-gray-400">
        Already have an account?{' '}
        <Link
          href="/auth/sign-in"
          className="text-accent-amber hover:text-accent-amber/80 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
