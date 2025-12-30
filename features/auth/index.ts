// Server utilities
export { createClient } from './utils/supabase-server'
export { getUser } from './utils/get-user'
export { requireAuth } from './utils/require-auth'

// Server actions
export { signInAction, signUpAction, signOutAction } from './actions'

// Client-side utilities (deprecated - kept for backward compatibility)
// TODO: Remove after verifying migration is complete
export { AuthProvider, useAuth } from './components/auth-provider'
