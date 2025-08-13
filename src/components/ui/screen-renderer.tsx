'use client';

import type React from 'react';

import useWindowScreen from '@/hooks/useWindowScreen';

type Props = {
  desktop: React.ReactElement;
  tablet?: React.ReactElement;
  mobile?: React.ReactElement;
};

const ScreenRenderer: React.FC<Props> = ({ desktop, tablet, mobile }) => {
  const { isMobile, isTablet } = useWindowScreen();

  if (isMobile && typeof mobile !== 'undefined') {
    return mobile;
  }

  if (isTablet) {
    if (typeof tablet !== 'undefined') {
      return tablet;
    }

    if (typeof mobile !== 'undefined') {
      return mobile;
    }
  }

  return desktop;
};

export default ScreenRenderer;
