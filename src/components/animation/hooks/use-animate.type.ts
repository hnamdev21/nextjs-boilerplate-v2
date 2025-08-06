import type { RefObject } from 'react';

export type UseAnimateProps = {
  ref: RefObject<DomLike | null>;
  init?: () => void;
  animateIn?: () => void;
  animateOut?: () => void;
  reset?: () => void;
};
