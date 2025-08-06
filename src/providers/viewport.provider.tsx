'use client';

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

type Data = {
  subscribe: (ref: DomLike | null, handler: ViewportEventHandler) => void;
  unsubscribe: (ref: DomLike | null) => void;
};

const Context = createContext<Data | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ViewportProvider: React.FC<Props> = ({ children }) => {
  const observers = useRef<Map<DomLike, ViewportEventHandler>>(new Map());

  const io = useRef<IntersectionObserver | null>(null);

  useLayoutEffect(() => {
    io.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const handler = observers.current.get(entry.target);
          if (!handler) continue;

          if (entry.isIntersecting) {
            handler.onVisible?.();
          } else {
            handler.onHidden?.();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px',
      }
    );

    return () => {
      io.current?.disconnect();
      observers.current.clear();
    };
  }, []);

  const subscribe = useCallback((element: DomLike | null, handler: ViewportEventHandler) => {
    if (!io.current || !element || observers.current.has(element)) return;

    observers.current.set(element, handler);
    io.current.observe(element);
  }, []);

  const unsubscribe = useCallback((element: DomLike | null) => {
    if (!io.current || !element) return;

    io.current.unobserve(element);
    observers.current.delete(element);
  }, []);

  const value = useMemo(() => ({ subscribe, unsubscribe }), [subscribe, unsubscribe]);

  return <Context value={value}>{children}</Context>;
};

export const useViewport = (): Data => {
  const context = use(Context);
  if (!context) throw new Error('useViewport must be used within a ViewportProvider');
  return context;
};
