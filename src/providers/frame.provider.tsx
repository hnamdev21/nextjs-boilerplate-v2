'use client';

import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

import usePageStateStore, { PageState } from '@/stores/page-state.store';
import { createLogger } from '@/utils/logger.util';

type Data = {
  subscribe: (key: string, handler: FrameEventHandler) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('FrameProvider');

export const FrameProvider: React.FC<Props> = ({ children }) => {
  const pageState = usePageStateStore((state) => state.pageState);

  const subscribers = useRef<{ [key: string]: FrameEventHandler }>({});

  useEffect(() => {
    if (pageState === PageState.LOADING) return;

    let lastTime = performance.now();

    const listener = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      Object.values(subscribers.current).forEach((handler) => {
        handler.onFrame?.(delta);
      });
    };

    const frame = requestAnimationFrame(listener);

    return () => {
      subscribers.current = {};
      cancelAnimationFrame(frame);
    };
  }, [pageState]);

  const subscribe = useCallback((key: string, handler: FrameEventHandler) => {
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

export const useFrame = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('useFrame must be used within a FrameProvider');
  }

  return context;
};
