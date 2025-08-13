import type Lenis from 'lenis';

declare global {
  type Window = {
    lenis?: { wrapper?: HTMLElement; content?: HTMLElement; lenis?: Lenis };
  };
}
