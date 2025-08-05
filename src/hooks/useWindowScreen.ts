import { useMediaQuery } from '@chakra-ui/react';

import { Breakpoints } from '@/constants/breakpoints';

const useWindowScreen = () => {
  const [isTablet, isLaptop] = useMediaQuery(
    [`(min-width: ${Breakpoints.MIN_TABLET}px)`, `(min-width: ${Breakpoints.MIN_LAPTOP}px)`],
    {
      ssr: true,
      fallback: [false, false],
    }
  );

  const isMobile = !isTablet && !isLaptop;

  return {
    isTablet,
    isLaptop,
    isMobile,
  };
};

export default useWindowScreen;
