import type { RefObject } from 'react';

export type UseAnimationFnConfig = {
  delayWhenEnter?: number;
  delayWhenExit?: number;
  delayWhenInView?: number;
  debug?: boolean;
  threshold?: number;
};

export type UseAnimationFnProps = {
  ref: RefObject<DomLike | null>;
  config?: UseAnimationFnConfig;
  withTransform?: boolean;
  withOpacity?: boolean;
};
