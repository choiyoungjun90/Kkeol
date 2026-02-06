import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  actions: {
    initialize: () => Promise<void>;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  actions: {
    initialize: async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          set({ user: session.user, profile, isLoading: false });
        } else {
          await get().actions.signInAnonymously();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        set({ isLoading: false });
      }
    },

    signInAnonymously: async () => {
      set({ isLoading: true });
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
          // If anonymous sign-in is disabled, we just fail silently and stay as guest
          if (error.status === 400 || error.message.includes("disabled")) {
            console.warn(
              "Anonymous sign-in is disabled in Supabase project settings.",
            );
          } else {
            throw error;
          }
        }

        if (data?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          set({ user: data.user, profile, isLoading: false });
        } else {
          set({ user: null, profile: null, isLoading: false });
        }
      } catch (error) {
        console.error("Anonymous sign-in error:", error);
        set({ user: null, profile: null, isLoading: false });
      }
    },

    signOut: async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    },
  },
}));
