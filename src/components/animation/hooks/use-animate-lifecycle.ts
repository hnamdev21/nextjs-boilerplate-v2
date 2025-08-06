'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { usePageState } from '@/providers/page-state.provider';
import { PageState } from '@/stores/page-state.store';
import { calcThreshold, checkIsInView } from '@/utils/animate.util';
import { generateUUID } from '@/utils/string.util';

import type { UseAnimationLifeCycleProps } from './use-animate-lifecycle.type';

const useAnimationLifecycle = ({
  ref,
  config,
  init,
  animateIn,
  animateOut,
  reset,
}: UseAnimationLifeCycleProps) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const { subscribe, unsubscribe } = usePageState();

  const prepareAnimate = useCallback(
    (delay: number) => {
      gsap.registerPlugin(ScrollTrigger);

      scrollTriggerRef.current?.kill();

      const topStart = calcThreshold({
        element: ref.current as HTMLElement,
        threshold: config?.threshold ?? 0,
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: ref.current,
        start: `top+=${topStart.toString()}% bottom`,
        once: true,
        markers: config?.debug,
        onEnter: () => {
          animateIn?.({ delay });
        },
      });
    },
    [config?.debug, config?.threshold, animateIn]
  );

  useEffect(() => {
    const id = generateUUID();
    const key = `animate-${id}`;

    subscribe(key, (pageState) => {
      const isInView = checkIsInView(ref.current);

      if (pageState === PageState.READY) {
        ref.current?.classList.toggle('invisible', !isInView);

        init?.();
      } else if (pageState === PageState.ENTERED) {
        if (isInView) {
          animateIn?.({ delay: config?.delayWhenEnter ?? 0 });
        } else {
          prepareAnimate(config?.delayWhenInView ?? 0);
        }
      } else if (pageState === PageState.EXITING) {
        animateOut?.({ delay: config?.delayWhenExit ?? 0 });
      } else if (pageState === PageState.EXITED) {
        reset?.();
      }
    });

    return () => {
      unsubscribe(key);
    };
  }, [
    init,
    animateIn,
    animateOut,
    reset,
    config?.delayWhenEnter,
    config?.delayWhenExit,
    config?.delayWhenInView,
    config?.threshold,
    prepareAnimate,
  ]);
};

export default useAnimationLifecycle;
