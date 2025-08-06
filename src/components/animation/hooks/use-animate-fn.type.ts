import type { RefObject } from 'react';

import type { UseAnimationLifeycleCallbackParams } from '@/components/animation/hooks/use-animate-lifecycle.type';

export type UseAnimationFnConfig = {
  delayWhenEnter?: number;
  delayWhenExit?: number;
  delayWhenInView?: number;
  debug?: boolean;
  threshold?: number;
};

export type UseAnimationFnProps = {
  ref: RefObject<DomLike | null>;
  withTransform?: boolean;
  withOpacity?: boolean;
  initVars?: gsap.TweenVars;
  animateInVars?: gsap.TweenVars;
  animateOutVars?: gsap.TweenVars;
};

export type UseAnimationFnReturn = {
  animateIn: (params: UseAnimationLifeycleCallbackParams) => void;
  animateOut: (params: UseAnimationLifeycleCallbackParams) => void;
};
