import type { PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react/box';

import { Toaster } from '@/components/ui/toaster';
import Footer from '@/modules/Layouts/footer';
import Header from '@/modules/Layouts/header';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
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

      <Box as="main" flex={1}>
        {children}
      </Box>

      <Footer />

      <Toaster />
    </Box>
  );
};

export default MainLayout;
