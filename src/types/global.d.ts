import type Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: { wrapper?: HTMLElement; content?: HTMLElement; lenis?: Lenis };
  }
}
