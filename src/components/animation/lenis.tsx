'use client';

import { gsap } from 'gsap';
import { type LenisRef, ReactLenis } from 'lenis/react';
import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useRef } from 'react';

const LenisScroller = ({ children }: PropsWithChildren) => {
  const lenisRef = useRef<LenisRef | null>(null);

  useLayoutEffect(() => {
    function update(time: number): void {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    return (): void => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  );
};

export default LenisScroller;
