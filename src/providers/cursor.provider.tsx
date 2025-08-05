'use client';

import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  registerOnMouseMove: (key: string, handler: (position: SimpleVector2) => void) => void;
  unregisterOnMouseMove: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('CursorProvider');

export const CursorProvider: React.FC<Props> = ({ children }) => {
  const handlers = useRef<{ [key: string]: (position: SimpleVector2) => void }>({});

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      Object.values(handlers.current).forEach((handler) => {
        handler({ x: event.clientX, y: event.clientY });
      });
    };

    window.addEventListener('mousemove', listener);

    return () => {
      handlers.current = {};
      window.removeEventListener('mousemove', listener);
    };
  }, []);

  const registerOnMouseMove = useCallback(
    (key: string, handler: (position: SimpleVector2) => void) => {
      if (!handlers.current[key]) {
        handlers.current[key] = handler;
      } else {
        logger.warn(`Handler already registered for key: ${key}`);
      }
    },
    []
  );

  const unregisterOnMouseMove = useCallback((key: string) => {
    delete handlers.current[key];
  }, []);

  const value: Data = useMemo(() => {
    return {
      registerOnMouseMove,
      unregisterOnMouseMove,
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
