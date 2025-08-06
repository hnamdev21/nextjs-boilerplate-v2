'use client';

import { useEffect } from 'react';

import { usePageState } from '@/providers/page-state.provider';
import { PageState } from '@/stores/page-state.store';
import { generateUUID } from '@/utils/string.util';

import type { UseAnimateProps } from './use-animate.type';

const useAnimate = ({ init, animateIn, animateOut, reset }: UseAnimateProps) => {
  const { subscribe } = usePageState();

  useEffect(() => {
    const id = generateUUID();

    subscribe(`animate-${id}`, (pageState) => {
      if (pageState === PageState.READY) {
        init?.();
      } else if (pageState === PageState.EXTERED) {
        animateIn?.();
      } else if (pageState === PageState.EXITING) {
        animateOut?.();
      } else if (pageState === PageState.EXITED) {
        reset?.();
      }
    });
  }, []);
};

export default useAnimate;
