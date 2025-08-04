'use client';

import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  register: (callback: (position: SimpleVector2) => void) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const CursorProvider: React.FC<Props> = ({ children }) => {
  const callbacks = useRef<((position: SimpleVector2) => void)[]>([]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      callbacks.current.forEach((callback) => {
        callback({ x: event.clientX, y: event.clientY });
      });
    };

    window.addEventListener('mousemove', listener);

    return () => {
      callbacks.current = [];
      window.removeEventListener('mousemove', listener);
    };
  }, []);

  const register = useCallback((callback: (position: SimpleVector2) => void) => {
    callbacks.current.push(callback);
  }, []);

  const value: Data = useMemo(() => {
    return {
      register,
    };
  }, []);

  return <Context value={value}>{children}</Context>;
};

export const useCursor = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }

  return context;
};
