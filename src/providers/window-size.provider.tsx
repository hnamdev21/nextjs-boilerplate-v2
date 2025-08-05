'use client';

import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  registerOnResize: (key: string, handler: (size: SimpleSize) => void) => void;
  unregisterOnResize: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('WindowSizeProvider');

export const WindowSizeProvider: React.FC<Props> = ({ children }) => {
  const handlers = useRef<{ [key: string]: (size: SimpleSize) => void }>({});
  const debounce = useRef<NodeJS.Timeout | null>(null);

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

        Object.values(handlers.current).forEach((handler) => {
          handler({ width: window.innerWidth, height: window.innerHeight });
        });
      }, 200);
    };

    window.addEventListener('resize', listener);

    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      handlers.current = {};
      window.removeEventListener('resize', listener);
    };
  }, []);

  const registerOnResize = useCallback((key: string, handler: (size: SimpleSize) => void) => {
    if (!handlers.current[key]) {
      handlers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);

  const unregisterOnResize = useCallback((key: string) => {
    delete handlers.current[key];
  }, []);

  const value: Data = useMemo(() => {
    return {
      registerOnResize,
      unregisterOnResize,
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
