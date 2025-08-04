'use client';

import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  register: (callback: (size: SimpleSize) => void) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const WindowSizeProvider: React.FC<Props> = ({ children }) => {
  const callbacks = useRef<((size: SimpleSize) => void)[]>([]);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const listener = () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      debounce.current = setTimeout(() => {
        callbacks.current.forEach((callback) => {
          callback({ width: window.innerWidth, height: window.innerHeight });
        });
      }, 200);
    };

    window.addEventListener('resize', listener);

    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      callbacks.current = [];
      window.removeEventListener('resize', listener);
    };
  }, []);

  const register = useCallback((callback: (size: SimpleSize) => void) => {
    callbacks.current.push(callback);
  }, []);

  const value: Data = useMemo(() => {
    return {
      register,
    };
  }, []);

  return <Context value={value}>{children}</Context>;
};

export const useWindowSize = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }

  return context;
};
