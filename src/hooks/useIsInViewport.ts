'use client';

import type { RefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';
import type { Signal } from '@preact/signals-react';
import { useSignal } from '@preact/signals-react';

type Props = {
  ref: RefObject<DomLike>;
  options?: IntersectionObserverInit;
  onVisible?: () => void;
  onHidden?: () => void;
};

type Return = {
  visible: Signal<boolean>;
};

const useIsInViewport = ({ ref, options, onVisible, onHidden }: Props): Return => {
  const visible = useSignal<boolean>(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useLayoutEffect(() => {
    ioRef.current = new IntersectionObserver(
      ([entry]) => {
        visible.value = entry.isIntersecting;
        if (entry.isIntersecting) {
          onVisible?.();
        } else {
          onHidden?.();
        }
      },

      {
        ...{ threshold: 0, rootMargin: '0px 0px 0px 0px' },
        ...options,
      }
    );

    if (ref.current) {
      ioRef.current.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        ioRef.current?.unobserve(ref.current);
        ioRef.current?.disconnect();
      }
    };
  }, []);

  return { visible };
};

export default useIsInViewport;
