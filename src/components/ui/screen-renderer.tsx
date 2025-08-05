'use client';

import useWindowScreen from '@hooks/useWindowScreen';
import type React from 'react';
import { cloneElement } from 'react';

interface Props {
  desktop: React.ReactElement;
  tablet?: React.ReactElement;
  mobile?: React.ReactElement;
}

const ScreenRenderer: React.FC<Props> = ({ desktop, tablet, mobile }) => {
  const { isMobile, isTablet } = useWindowScreen();

  if (isMobile && typeof mobile !== 'undefined') {
    return cloneElement(mobile, { key: 'mobile' });
  }

  if (isTablet) {
    if (typeof tablet !== 'undefined') {
      return cloneElement(tablet, { key: 'tablet' });
    }

    if (typeof mobile !== 'undefined') {
      return cloneElement(mobile, { key: 'tablet' });
    }
  }

  return cloneElement(desktop, { key: 'desktop' });
};

export default ScreenRenderer;
