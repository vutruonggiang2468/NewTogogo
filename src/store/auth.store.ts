import { UserProfile } from "@/types";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  access_token: string | null;
  refresh_token: string | null;
  // login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (code: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      isLoggedIn: false,

      // login: async (email: string, password: string) => {
      //   // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      //   // Mock authentication - in real app, this would call your backend
      //   if (email === "khoa.ndk.nene@gmail.com" && password === "123456") {
      //     set({
      //       isLoggedIn: true,
      //       user: mockUser,
      //     });
      //     return true;
      //   }
      //   return false;
      // },
      loginWithGoogle: async (code: string) => {
        try {
          const { data } = await axios.post(
            "http://192.168.31.248:8000/api/auth/google/login",
            { code },
            { withCredentials: true }
          );

          const access =
            data?.access_token ||
            data?.token ||
            data?.id_token ||
            data?.data?.access_token;

          const refresh = data?.refresh_token || data?.data?.refresh_token;

          const user = data?.user || data?.data?.user || null;

          if (!access || !user) return false;

          axios.defaults.headers.common.Authorization = `Bearer ${access}`;

          set({
            access_token: access,
            refresh_token: refresh,
            user,
            isLoggedIn: true,
          });

          return true;
        } catch (err) {
          console.error("❌ Lỗi đăng nhập Google:", err);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isLoggedIn: false,
        });
        delete axios.defaults.headers.common.Authorization;
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
