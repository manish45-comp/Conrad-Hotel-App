import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "../api/services/authService";

export interface User {
  UserId: number;
  UserName: string;
  UserRole: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      /*** LOGIN*/
      login: async (username: string, password: string) => {
        // Log the start of the attempt
        console.log(`[AUTH_DEBUG] Attempting login for user: ${username}`);

        set({ loading: true, error: null });
        try {
          const response = await authService.login(username, password);

          if (response.StatusCode !== 200) {
            // Log the specific business logic failure
            console.warn(
              `[AUTH_DEBUG] Login rejected: ${response.Message} (Status: ${response.StatusCode})`,
            );

            set({ error: response.Message, loading: false });
            return false;
          }

          const userData: User = response.Data;

          // Log success and a small snippet of data (don't log passwords/full tokens for security!)
          console.log(`[AUTH_DEBUG] Login successful. UserID: ${userData.id}`);

          set({
            user: userData,
            loading: false,
            error: null,
          });

          return true;
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.Message || err.message || "Login failed";

          // Log the actual network/system error
          console.error(
            `[AUTH_DEBUG] Network/System error during login: ${errorMessage}`,
          );

          set({
            error: errorMessage,
            loading: false,
          });
          return false;
        }
      },

      /**
       * LOGOUT
       */
      logout: async () => {
        set({ user: null, error: null });
        await AsyncStorage.removeItem("auth-storage");
      },

      /**
       * CLEAR ERROR
       */
      clearError: () => set({ error: null }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
