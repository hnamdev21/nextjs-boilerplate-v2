'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { UseAnimationLifeycleCallbackParams } from '@/components/animation/hooks/use-animate-lifecycle.type';

import type { UseAnimationFnProps } from './use-animate-fn.type';

const useAnimationFn = ({
  ref,
  withTransform,
  withOpacity,
  initVars,
  animateInVars,
  animateOutVars,
}: UseAnimationFnProps) => {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const animateIn = useCallback(
    (params: UseAnimationLifeycleCallbackParams) => {
      tweenRef.current?.kill();

      tweenRef.current = gsap.fromTo(
        ref.current,
        {
          ...initVars,
          ...params.fromVars,
        },
        {
          duration: 1.2,
          ease: 'power3.out',
          ...params.toVars,
          ...animateInVars,
        }
      );
    },
    [initVars, animateInVars]
  );

  const animateOut = useCallback(
    (params: UseAnimationLifeycleCallbackParams) => {
      tweenRef.current?.kill();

      tweenRef.current = gsap.to(ref.current, {
        duration: 1.2,
        ease: 'power3.out',
        ...params.outVars,
        ...animateOutVars,
      });
    },
    [animateOutVars]
  );

  useEffect(() => {
    tweenRef.current?.kill();

    gsap.set(ref.current, {
      ...initVars,
    });

    ref.current?.classList.toggle('will-transform', withTransform);
    ref.current?.classList.toggle('will-opacity', withOpacity);

    return () => {
      tweenRef.current?.kill();
    };
  }, [withTransform, withOpacity, initVars]);

  return { animateIn, animateOut };
};

export default useAnimationFn;
