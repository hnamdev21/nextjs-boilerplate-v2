'use client';

import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

import { createLogger } from '@/utils/logger';

type Data = {
  subscribe: (key: string, handler: (size: SimpleSize) => void) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('WindowSizeProvider');

export const WindowSizeProvider: React.FC<Props> = ({ children }) => {
  const subscribers = useRef<{ [key: string]: (size: SimpleSize) => void }>({});
  const debounce = useRef<NodeJS.Timeout | null>(null);

  const subscribe = useCallback((key: string, handler: (size: SimpleSize) => void) => {
    if (!subscribers.current[key]) {
      subscribers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);

  const unsubscribe = useCallback((key: string) => {
    delete subscribers.current[key];
  }, []);

  useEffect(() => {
    const listener = () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      debounce.current = setTimeout(() => {
        logger.info('window.addEventListener resize', {
          width: window.innerWidth,
          height: window.innerHeight,
        });

        Object.values(subscribers.current).forEach((handler) => {
          handler({ width: window.innerWidth, height: window.innerHeight });
        });
      }, 200);
    };

    window.addEventListener('resize', listener);

    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      subscribers.current = {};
      window.removeEventListener('resize', listener);
    };
  }, []);

  const value: Data = useMemo(() => {
    return {
      subscribe,
      unsubscribe,
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
