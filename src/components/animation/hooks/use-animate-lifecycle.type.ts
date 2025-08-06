import type { RefObject } from 'react';

export type UseAnimationLifeycleCallbackParams = {
  delay: number;
  fromVars?: gsap.TweenVars;
  toVars?: gsap.TweenVars;
  outVars?: gsap.TweenVars;
};

export type UseAnimateLifecycleConfig = {
  delayWhenEnter?: number;
  delayWhenExit?: number;
  delayWhenInView?: number;
  debug?: boolean;
  threshold?: number;
};

export type UseAnimationLifeCycleProps = {
  ref: RefObject<DomLike | null>;
  config?: UseAnimateLifecycleConfig;
  init?: () => void;
  animateIn?: (params: UseAnimationLifeycleCallbackParams) => void;
  animateOut?: (params: UseAnimationLifeycleCallbackParams) => void;
  reset?: () => void;
};
