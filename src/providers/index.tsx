import LenisScroller from '@components/animation/lenis';
import { ChakraProvider } from '@providers/chakra.provider';
import { CursorProvider } from '@providers/cursor.provider';
import { PageProvider } from '@providers/page.provider';
import { WindowSizeProvider } from '@providers/window-size.provider';
import { PropsWithChildren } from 'react';

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider>
      <WindowSizeProvider>
        <PageProvider>
          <CursorProvider>
            <LenisScroller>{children}</LenisScroller>
          </CursorProvider>
        </PageProvider>
      </WindowSizeProvider>
    </ChakraProvider>
  );
};

export default MainProviders;
