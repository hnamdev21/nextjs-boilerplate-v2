'use client';

import type { ReactNode } from 'react';
import { createContext, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { StoreApi } from 'zustand';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LoginDTO } from '@/dtos/auth.dto';
import type { User } from '@/types/models/user';
import { createLogger } from '@/utils/logger.util';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

type AuthState = {
  token: string | null;
  user: User | null;
};

type AuthActions = {
  actions: {
    setToken: (token: string) => void;
    setUser: (user: User) => void;

    reset: () => void;
  };
};

const initialAuthState: AuthState = {
  token: null,
  user: null,
};

type AuthData = {
  authStore: StoreApi<AuthState & AuthActions>;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('AuthProvider');

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const authStore = createStore<AuthState & AuthActions>()(
    persist(
      (set) => ({
        ...initialAuthState,

        actions: {
          setToken: (token: string) => set({ token }),
          setUser: (user: User) => set({ user }),

          reset: () => set(initialAuthState),
        },
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

  const value: AuthData = useMemo(() => {
    return {
      authStore,

      login: async (data: LoginDTO, redirect: string = '/') => {
        logger.info('Login', data);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        authStore.getState().actions.setToken('token');
        authStore.getState().actions.setUser({
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          isActive: true,
          isEmailVerified: true,
        });

        router.push(redirect);
      },

      logout: async () => {
        authStore.getState().actions.reset();
        router.push('/login');
      },
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext value={value}>{children}</AuthContext>
    </QueryClientProvider>
  );
};

export const useAuth = (): AuthData => {
  const context = use(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
