import type { PropsWithChildren } from 'react';

import LenisScroller from '@/components/animation/lenis';
import { AssetProvider } from '@/providers/asset.provider';
import { ChakraProvider } from '@/providers/chakra.provider';
import { CursorProvider } from '@/providers/cursor.provider';
import { FontProvider } from '@/providers/font.provider';
import { FrameProvider } from '@/providers/frame.provider';
import { PageStateProvider } from '@/providers/page-state.provider';
import { WindowSizeProvider } from '@/providers/window-size.provider';

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider>
      <WindowSizeProvider>
        <AssetProvider>
          <FontProvider>
            <PageStateProvider>
              <CursorProvider>
                <FrameProvider>
                  <LenisScroller>{children}</LenisScroller>
                </FrameProvider>
              </CursorProvider>
            </PageStateProvider>
          </FontProvider>
        </AssetProvider>
      </WindowSizeProvider>
    </ChakraProvider>
  );
};

export default MainProviders;
