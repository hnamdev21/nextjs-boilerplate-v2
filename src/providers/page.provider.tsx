'use client';

import { createLogger } from '@utils/logger';
import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useRef } from 'react';

import usePageStateStore, { PageState } from '@/stores/page-state.store';

type Data = {
  registerOnPageChange: (key: string, handler: (pageState: PageState) => void) => void;
  unregisterOnPageChange: (key: string) => void;

  registerOnFontAsset: (key: string, handler: (isLoaded: boolean) => void) => void;
  unregisterOnFontAsset: (key: string) => void;

  loadAsset: () => void;
  completeAsset: () => void;

  registerOnAssetLoad: (key: string, handler: (isLoaded: boolean) => void) => void;
  unregisterOnAssetLoad: (key: string) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const logger = createLogger('PageProvider');

export const PageProvider: React.FC<Props> = ({ children }) => {
  const pageChangeHandlers = useRef<{ [key: string]: (pageState: PageState) => void }>({});
  const fontAssetHandlers = useRef<{ [key: string]: (isLoaded: boolean) => void }>({});

  const assetLoadHandlers = useRef<{ [key: string]: (isLoaded: boolean) => void }>({});
  const totalAssets = useRef(0);
  const loadedAssets = useRef(0);

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
  const unregisterOnPageChange = useCallback((key: string) => {
    delete pageChangeHandlers.current[key];
  }, []);

  const registerOnFontAsset = useCallback((key: string, handler: (isLoaded: boolean) => void) => {
    if (!fontAssetHandlers.current[key]) {
      fontAssetHandlers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);
  const unregisterOnFontAsset = useCallback((key: string) => {
    delete fontAssetHandlers.current[key];
  }, []);

  const loadAsset = useCallback(() => {
    totalAssets.current++;
  }, []);
  const completeAsset = useCallback(() => {
    loadedAssets.current++;

    if (loadedAssets.current === totalAssets.current) {
      Object.values(assetLoadHandlers.current).forEach((handler) => {
        handler(true);
      });
    }

    if (loadedAssets.current === totalAssets.current) {
      usePageStateStore.getState().actions.setPageState(PageState.READY);
    }
  }, []);

  const registerOnAssetLoad = useCallback((key: string, handler: (isLoaded: boolean) => void) => {
    if (!assetLoadHandlers.current[key]) {
      assetLoadHandlers.current[key] = handler;
    } else {
      logger.warn(`Handler already registered for key: ${key}`);
    }
  }, []);
  const unregisterOnAssetLoad = useCallback((key: string) => {
    delete assetLoadHandlers.current[key];
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

    const handleFontLoader = (isLoaded: boolean) => {
      logger.info('handleFontLoader', {
        isLoaded,
      });

      Object.values(fontAssetHandlers.current).forEach((handler) => {
        handler(isLoaded);
      });
    };

    loadAsset();
    handleFontLoader(false);

    document.fonts.ready
      .then(() => handleFontLoader(true))
      .catch((error) => {
        handleFontLoader(false);
        logger.error('Failed to load fonts', error);
      })
      .finally(() => {
        completeAsset();
      });

    return () => {
      pageChangeHandlers.current = {};
      fontAssetHandlers.current = {};
      assetLoadHandlers.current = {};
      totalAssets.current = 0;
      loadedAssets.current = 0;
      usePageStateStore.getState().actions.reset();
    };
  }, []);

  const value: Data = useMemo(() => {
    return {
      registerOnPageChange,
      registerOnFontAsset,
      unregisterOnPageChange,
      unregisterOnFontAsset,
      loadAsset,
      completeAsset,
      registerOnAssetLoad,
      unregisterOnAssetLoad,
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
