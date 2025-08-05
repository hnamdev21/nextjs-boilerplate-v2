'use client';

import type { ReactNode } from 'react';
import { createContext, use, useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { createLogger } from '@/utils/logger';

type Data = {
  loadAsset: () => void;
  completeAsset: () => void;

  subscribe: (key: string, handler: AssetEventHandler) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('AssetProvider');

export const AssetProvider: React.FC<Props> = ({ children }) => {
  const subscribers = useRef<{ [key: string]: AssetEventHandler }>({});
  const totalAssets = useRef(0);
  const loadedAssets = useRef(0);

  const loadAsset = useCallback(() => {
    totalAssets.current++;
  }, []);

  const completeAsset = useCallback(() => {
    Object.values(subscribers.current).forEach((handler) => {
      logger.info(`${loadedAssets.current} of ${totalAssets.current} assets loaded`);
      handler.onProgress?.(loadedAssets.current / totalAssets.current);
    });

    loadedAssets.current++;

    const progress = loadedAssets.current / totalAssets.current;

    if (progress >= 1) {
      logger.info('All assets loaded');

      Object.values(subscribers.current).forEach((handler) => {
        handler.onComplete?.();
      });
    }
  }, []);

  const subscribe = useCallback((key: string, handler: AssetEventHandler) => {
    if (!subscribers.current[key]) {
      subscribers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);
  const unsubscribe = useCallback((key: string) => {
    delete subscribers.current[key];
  }, []);

  useLayoutEffect(() => {
    logger.info('Loading assets');
    Object.values(subscribers.current).forEach((handler) => {
      handler.onStart?.();
    });

    return () => {
      subscribers.current = {};
      totalAssets.current = 0;
      loadedAssets.current = 0;
    };
  }, []);

  const value: Data = useMemo(() => {
    return {
      loadAsset,
      completeAsset,

      subscribe,
      unsubscribe,
    };
  }, []);

  return <Context value={value}>{children}</Context>;
};

export const useAsset = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('useAsset must be used within a AssetProvider');
  }

  return context;
};
