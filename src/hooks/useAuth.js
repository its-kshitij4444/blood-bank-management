import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuth = create((set) => ({
  session: null,
  user: null,
  loading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    set({ session: data.session, user: data.session?.user ?? null })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.getState().setSession(session)
  useAuth.setState({ loading: false })
})

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuth.getState().setSession(session)
})

export default useAuth