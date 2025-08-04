import { Box } from '@chakra-ui/react';
import Footer from '@modules/Layouts/footer';
import Header from '@modules/Layouts/header';
import { CursorProvider } from '@providers/cursor-provider';
import { WindowSizeProvider } from '@providers/window-size-provider';
import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <WindowSizeProvider>
      <CursorProvider>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          css={{
            '& > div': {
              width: '100%',
            },
          }}
        >
          <Header />

          <main style={{ flex: 1 }}>{children}</main>

          <Footer />
        </Box>
      </CursorProvider>
    </WindowSizeProvider>
  );
};

export default MainLayout;
