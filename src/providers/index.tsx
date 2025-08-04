import LenisScroller from '@components/animation/lenis';
import { ChakraProvider } from '@providers/chakra-provider';
import { CursorProvider } from '@providers/cursor-provider';
import { WindowSizeProvider } from '@providers/window-size-provider';
import { PropsWithChildren } from 'react';

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <WindowSizeProvider>
      <ChakraProvider>
        <CursorProvider>
          <LenisScroller>{children}</LenisScroller>
        </CursorProvider>
      </ChakraProvider>
    </WindowSizeProvider>
  );
};

export default MainProviders;
