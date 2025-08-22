import type { BoxProps } from '@chakra-ui/react/box';
import { Box } from '@chakra-ui/react/box';

const Scroller = ({ children, ...props }: BoxProps) => {
  return (
    <Box {...props} data-lenis-prevent>
      {children}
    </Box>
  );
};

export default Scroller;
