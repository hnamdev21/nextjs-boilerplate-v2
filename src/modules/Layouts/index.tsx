import { Box } from '@chakra-ui/react';
import Footer from '@modules/Layouts/footer';
import Header from '@modules/Layouts/header';
import { PropsWithChildren } from 'react';

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

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
    </Box>
  );
};

export default MainLayout;
