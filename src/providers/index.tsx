import LenisScroller from '@components/animation/lenis';
import { AssetProvider } from '@providers/asset.provider';
import { ChakraProvider } from '@providers/chakra.provider';
import { CursorProvider } from '@providers/cursor.provider';
import { FontProvider } from '@providers/font.provider';
import { PageStateProvider } from '@providers/page-state.provider';
import { WindowSizeProvider } from '@providers/window-size.provider';
import { PropsWithChildren } from 'react';

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider>
      <WindowSizeProvider>
        <AssetProvider>
          <FontProvider>
            <PageStateProvider>
              <CursorProvider>
                <LenisScroller>{children}</LenisScroller>
              </CursorProvider>
            </PageStateProvider>
          </FontProvider>
        </AssetProvider>
      </WindowSizeProvider>
    </ChakraProvider>
  );
};

export default MainProviders;
