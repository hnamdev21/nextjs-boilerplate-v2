'use client';

import { useEffect } from 'react';

import type { UseAnimationFnProps } from './use-animate-fn.type';

const useAnimationFn = ({ ref, withTransform, withOpacity }: UseAnimationFnProps) => {
  useEffect(() => {
    ref.current?.classList.toggle('will-transform', withTransform);
    ref.current?.classList.toggle('will-opacity', withOpacity);
  }, [withTransform, withOpacity]);
};

export default useAnimationFn;
