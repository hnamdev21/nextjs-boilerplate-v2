import LenisScroller from '@components/animation/lenis';
import { CursorProvider } from '@providers/cursor-provider';
import { WindowSizeProvider } from '@providers/window-size-provider';
import { PropsWithChildren } from 'react';

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <WindowSizeProvider>
      <CursorProvider>
        <LenisScroller>{children}</LenisScroller>
      </CursorProvider>
    </WindowSizeProvider>
  );
};

export default MainProviders;
