'use client';

import { type Signal, useSignal } from '@preact/signals-react';
import { gsap } from 'gsap';
import { cloneDeep } from 'lodash';
import type { ReactNode } from 'react';
import { createContext, use, useEffect, useMemo, useRef } from 'react';

export interface PlayAnimationProps {
  onComplete?: () => void;
  index: number;
}

interface AnimationCollection {
  kill: () => void;
  playIn: (props: PlayAnimationProps) => void;
  playOut: (props: PlayAnimationProps) => void;
}

interface SliderContextData {
  prevIndexSignal: Signal<number>;
  activeIndexSignal: Signal<number>;
  isAnimatingSignal: Signal<boolean>;
  countdownSignal: Signal<number>; // Percentage of time remaining

  handleNext: (onComplete?: () => void) => void;
  handlePrev: () => void;
  registerTween: (key: string, collection: AnimationCollection, multiple?: boolean) => void;
  startAutoSlide: () => void;
  startAutoSlideWithDelay: (delayMs: number) => void;
  stopAutoSlide: () => void;
  resetCountdown: () => void;
}

const SliderContext = createContext<SliderContextData | undefined>(undefined);

interface Props {
  children: ReactNode;
  totalSlides: number;
  autoSlideInterval?: number; // Time in milliseconds
  autoSlideAfterSlide?: boolean;
}

export const SliderProvider: React.FC<Props> = ({
  children,
  totalSlides,
  autoSlideInterval = 10_000,
  autoSlideAfterSlide = false,
}) => {
  const prevIndexSignal = useSignal(0);
  const activeIndexSignal = useSignal(0);
  const isAnimatingSignal = useSignal(false);
  const countdownSignal = useSignal(100); // 100% initially
  const timelineMapRefs = useRef<
    Record<string, AnimationCollection[] | AnimationCollection | undefined>
  >({} as Record<string, AnimationCollection[]>);

  // GSAP timeline and ticker refs
  const autoSlideTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const countdownTickerRef = useRef<(() => void) | null>(null);
  const delayBetweenSlidesRef = useRef<number>(0);
  const isAutoSlideActiveRef = useRef<boolean>(false);

  const tickFnRef = useRef<(() => void) | null>(null);

  const slideTo = (index: number): void => {
    const prevIndex = cloneDeep(activeIndexSignal.value);
    prevIndexSignal.value = prevIndex;

    stopAutoSlide();
    activeIndexSignal.value = index;
    isAnimatingSignal.value = true;

    const nextIndex = cloneDeep(activeIndexSignal.value);

    // Play animations for all registered tweens
    Object.keys(timelineMapRefs.current).forEach((key) => {
      const currentTweens = timelineMapRefs.current[key];
      const _onComplete = (): void => {
        isAnimatingSignal.value = false;
        if (autoSlideAfterSlide) {
          startAutoSlide();
        }
      };

      if (Array.isArray(currentTweens)) {
        currentTweens.forEach((tween) => {
          tween.kill();
        });

        currentTweens[prevIndex].playOut({
          onComplete: _onComplete,
          index: prevIndex,
        });

        currentTweens[nextIndex].playIn({
          onComplete: _onComplete,
          index: nextIndex,
        });

        return;
      }

      currentTweens?.playOut({
        onComplete: _onComplete,
        index: prevIndex,
      });

      currentTweens?.playIn({
        onComplete: _onComplete,
        index: nextIndex,
      });
    });
  };

  const handleSlideChange = (direction: 'next' | 'prev'): void => {
    const prevIndex = activeIndexSignal.value;

    isAnimatingSignal.value = true;

    slideTo(
      direction === 'next'
        ? (prevIndex + 1) % totalSlides
        : (prevIndex - 1 + totalSlides) % totalSlides
    );
  };

  const handleNext = (): void => {
    handleSlideChange('next');
  };
  const handlePrev = (): void => {
    handleSlideChange('prev');
  };

  const registerTween = (
    key: string,
    collection: AnimationCollection,
    multiple?: boolean
  ): void => {
    if (!multiple) {
      timelineMapRefs.current[key] = collection;
      return;
    }

    timelineMapRefs.current[key] ??= [];

    if (Array.isArray(timelineMapRefs.current[key])) {
      timelineMapRefs.current[key].push(collection);
    }
  };

  const tick =
    (startTime: number, duration: number): (() => void) =>
    () => {
      {
        if (!isAutoSlideActiveRef.current || isAnimatingSignal.value) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const remainingPercentage = Math.max(0, 100 - progress * 100);

        countdownSignal.value = Math.round(Math.abs(remainingPercentage));
      }
    };

  const startCountdown = (): void => {
    // Remove existing countdown ticker
    if (countdownTickerRef.current) {
      gsap.ticker.remove(countdownTickerRef.current);
      countdownTickerRef.current = null;
    }

    if (tickFnRef.current) {
      gsap.ticker.remove(tickFnRef.current);
      tickFnRef.current = null;
    }

    // Create countdown ticker
    const startTime = Date.now();
    const duration = autoSlideInterval;

    tickFnRef.current = tick(startTime, duration);

    countdownTickerRef.current = gsap.ticker.add(tickFnRef.current);
  };

  const startAutoSlide = (): void => {
    stopAutoSlide(); // Clear any existing timers
    resetCountdown();
    isAutoSlideActiveRef.current = true;

    autoSlideTimelineRef.current?.kill();
    autoSlideTimelineRef.current = null;

    // Create main timeline for auto slide
    autoSlideTimelineRef.current = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        if (!isAutoSlideActiveRef.current) return;

        handleNext();

        // If there's a delay between slides, pause the timeline
        if (delayBetweenSlidesRef.current > 0) {
          // Pause countdown during delay
          if (countdownTickerRef.current) {
            countdownTickerRef.current();
            countdownTickerRef.current = null;
          }

          // Set countdown to 0 during delay
          countdownSignal.value = 0;

          // Resume after delay
          gsap.delayedCall(delayBetweenSlidesRef.current / 1000, () => {
            if (isAutoSlideActiveRef.current) {
              startCountdown();
            }
          });
        } else {
          // No delay, just restart countdown
          startCountdown();
        }
      },
    });

    // Start the timeline
    autoSlideTimelineRef.current.to({}, { duration: autoSlideInterval / 1000 });

    // Start initial countdown
    startCountdown();
  };

  const startAutoSlideWithDelay = (delayMs: number): void => {
    stopAutoSlide(); // Clear any existing timers

    // Store the delay between slides
    delayBetweenSlidesRef.current = delayMs;

    // Start auto slide immediately
    startAutoSlide();
  };

  const stopAutoSlide = (): void => {
    // Kill timeline
    if (autoSlideTimelineRef.current) {
      autoSlideTimelineRef.current.kill();
      autoSlideTimelineRef.current = null;
    }

    // Remove countdown ticker
    if (countdownTickerRef.current) {
      countdownTickerRef.current();
      countdownTickerRef.current = null;
    }

    if (tickFnRef.current) {
      gsap.ticker.remove(tickFnRef.current);
      tickFnRef.current = null;
    }
  };

  const resetCountdown = (): void => {
    countdownSignal.value = 100;
  };

  useEffect(() => {
    return (): void => {
      stopAutoSlide();
    };
  }, []);

  const value: SliderContextData = useMemo(() => {
    return {
      prevIndexSignal,
      activeIndexSignal,
      isAnimatingSignal,
      countdownSignal,
      handleNext,
      handlePrev,
      registerTween,
      startAutoSlide,
      startAutoSlideWithDelay,
      stopAutoSlide,
      resetCountdown,
    };
  }, [
    prevIndexSignal,
    activeIndexSignal,
    isAnimatingSignal,
    countdownSignal,
    handleNext,
    handlePrev,
    registerTween,
    startAutoSlide,
    startAutoSlideWithDelay,
    stopAutoSlide,
    resetCountdown,
  ]);

  return <SliderContext value={value}>{children}</SliderContext>;
};

export const useSlider = (): SliderContextData => {
  const context = use(SliderContext);

  if (context === undefined) {
    throw new Error('useSlider must be used within a SliderProvider');
  }

  return context;
};
