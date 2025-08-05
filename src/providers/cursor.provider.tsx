'use client';

import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  subscribe: (key: string, handler: CursorEventHandler) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('CursorProvider');

export const CursorProvider: React.FC<Props> = ({ children }) => {
  const subscribers = useRef<{ [key: string]: CursorEventHandler }>({});

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      Object.values(subscribers.current).forEach((handler) => {
        handler.onMove?.({ x: event.clientX, y: event.clientY });
      });
    };

    window.addEventListener('mousemove', listener);

    return () => {
      subscribers.current = {};
      window.removeEventListener('mousemove', listener);
    };
  }, []);

  const subscribe = useCallback((key: string, handler: CursorEventHandler) => {
    if (!subscribers.current[key]) {
      subscribers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);

  const unsubscribe = useCallback((key: string) => {
    delete subscribers.current[key];
  }, []);

  const value: Data = useMemo(() => {
    return {
      subscribe,
      unsubscribe,
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
