'use client';

import {
  ChakraProvider as CkProvider,
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from '@chakra-ui/react';
import { Breakpoints } from '@constants/breakpoints';
import type { ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
}

const customConfig = defineConfig({
  cssVarsPrefix: 'ck',
  utilities: {},
  theme: {
    breakpoints: {
      sm: `${Breakpoints.MIN_TABLET}px`,
      md: `${Breakpoints.MIN_LAPTOP}px`,
    },
  },
});

const optimizedSystem = createSystem(defaultBaseConfig, customConfig);

export function ChakraProvider({ children }: Props): React.ReactElement {
  return <CkProvider value={optimizedSystem}>{children}</CkProvider>;
}
