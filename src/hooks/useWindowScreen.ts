import { useMediaQuery } from '@chakra-ui/react';

const useWindowScreen = () => {
  const [isTablet, isDesktop] = useMediaQuery(['(min-width: 768px)', '(min-width: 1200px)'], {
    ssr: true,
    fallback: [false, false],
  });

  const isMobile = !isTablet && !isDesktop;

  return {
    isTablet,
    isDesktop,
    isMobile,
  };
};

export default useWindowScreen;
