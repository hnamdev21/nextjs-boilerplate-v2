'use client';

import { useAsset } from '@providers/asset.provider';
import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

type Data = {
  subscribe: (key: string, handler: FontEventHandler) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('FontProvider');

export const FontProvider: React.FC<Props> = ({ children }) => {
  const { loadAsset, completeAsset } = useAsset();

  const subscribers = useRef<{ [key: string]: FontEventHandler }>({});

  const subscribe = useCallback((key: string, handler: FontEventHandler) => {
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
    loadAsset();

    logger.info('Loading fonts');
    Object.values(subscribers.current).forEach((handler) => {
      handler.onStart?.();
    });

    document.fonts.ready
      .then(() => {
        logger.info('Fonts loaded');
        Object.values(subscribers.current).forEach((handler) => {
          handler.onComplete?.();
        });
      })
      .catch((error) => {
        Object.values(subscribers.current).forEach((handler) => {
          handler.onError?.(error);
        });
        logger.error('Failed to load fonts', error);
      })
      .finally(() => {
        completeAsset();
      });

    return () => {
      subscribers.current = {};
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

export const useFont = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }

  return context;
};
