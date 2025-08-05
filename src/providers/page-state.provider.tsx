'use client';

import { useAsset } from '@providers/asset.provider';
import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

import usePageStateStore, { PageState } from '@/stores/page-state.store';

type Data = {
  subscribe: (key: string, handler: (pageState: PageState) => void) => void;
  unsubscribe: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('PageProvider');

export const PageStateProvider: React.FC<Props> = ({ children }) => {
  const asset = useAsset();

  const subscribers = useRef<{ [key: string]: (pageState: PageState) => void }>({});

  const subscribe = useCallback((key: string, handler: (pageState: PageState) => void) => {
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
    asset.subscribe('page-provider', {
      onComplete: () => {
        usePageStateStore.getState().actions.setPageState(PageState.READY);
      },
    });

    Object.values(subscribers.current).forEach((handler) => {
      handler(usePageStateStore.getState().pageState);
    });

    usePageStateStore.subscribe((state) => {
      logger.info({
        pageState: state.pageState,
      });

      Object.values(subscribers.current).forEach((handler) => {
        handler(state.pageState);
      });
    });

    return () => {
      subscribers.current = {};
      usePageStateStore.getState().actions.reset();
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

export const usePageState = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('usePageState must be used within a PageStateProvider');
  }

  return context;
};
