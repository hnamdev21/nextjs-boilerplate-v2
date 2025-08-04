'use client';

import {
  ChakraProvider as Chakra,
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import React from 'react';

interface ChakraProviderProps {
  children: ReactNode;
}

const customConfig = defineConfig({
  cssVarsPrefix: 'ck',
  utilities: {},
  theme: {
    breakpoints: {
      sm: '768px',
      md: '1200px',
      lg: '1440px',
    },
  },
});

const optimizedSystem = createSystem(defaultBaseConfig, customConfig);

export function ChakraProvider({ children }: ChakraProviderProps): React.ReactElement {
  return <Chakra value={optimizedSystem}>{children}</Chakra>;
}
