'use client';

import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

import usePageStateStore, { PageState } from '@/stores/page-state.store';

type Data = {
  registerOnPageChange: (key: string, handler: (pageState: PageState) => void) => void;
  registerOnFontAsset: (key: string, handler: (isLoaded: boolean) => void) => void;
  unregisterOnPageChange: (key: string) => void;
  unregisterOnFontAsset: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('PageProvider');

export const PageProvider: React.FC<Props> = ({ children }) => {
  const pageChangeHandlers = useRef<{ [key: string]: (pageState: PageState) => void }>({});
  const fontAssetHandlers = useRef<{ [key: string]: (isLoaded: boolean) => void }>({});

  const registerOnPageChange = useCallback(
    (key: string, handler: (pageState: PageState) => void) => {
      if (!pageChangeHandlers.current[key]) {
        pageChangeHandlers.current[key] = handler;
      } else {
        logger.warn(`Handler already registered for key: ${key}`);
      }
    },
    []
  );

  const registerOnFontAsset = useCallback((key: string, handler: (isLoaded: boolean) => void) => {
    if (!fontAssetHandlers.current[key]) {
      fontAssetHandlers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);

  const unregisterOnPageChange = useCallback((key: string) => {
    delete pageChangeHandlers.current[key];
  }, []);

  const unregisterOnFontAsset = useCallback((key: string) => {
    delete fontAssetHandlers.current[key];
  }, []);

  useEffect(() => {
    usePageStateStore.subscribe((state) => {
      logger.info('usePageStateStore.subscribe', {
        pageState: state.pageState,
      });

      Object.values(pageChangeHandlers.current).forEach((handler) => {
        handler(state.pageState);
      });
    });

    const handleFontAsset = (isLoaded: boolean) => {
      logger.info('handleFontAsset', {
        isLoaded,
      });

      Object.values(fontAssetHandlers.current).forEach((handler) => {
        handler(isLoaded);
      });
    };

    handleFontAsset(false);

    document.fonts.ready
      .then(() => {
        handleFontAsset(true);
        usePageStateStore.getState().actions.setPageState(PageState.READY);
      })
      .catch((error) => {
        handleFontAsset(false);
        usePageStateStore.getState().actions.setPageState(PageState.ERROR);
        logger.error('Failed to load fonts', error);
      });

    return () => {
      pageChangeHandlers.current = {};
      fontAssetHandlers.current = {};
      usePageStateStore.getState().actions.reset();
    };
  }, []);

  const value: Data = useMemo(() => {
    return {
      registerOnPageChange,
      registerOnFontAsset,
      unregisterOnPageChange,
      unregisterOnFontAsset,
    };
  }, []);

  return <Context value={value}>{children}</Context>;
};

export const usePage = (): Data => {
  const context = use(Context);

  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }

  return context;
};
