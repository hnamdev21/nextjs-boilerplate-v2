import type { RefObject } from 'react';
import type { BoxProps } from '@chakra-ui/react/box';
import { Box } from '@chakra-ui/react/box';

type Props = BoxProps & {
  ref?: RefObject<HTMLDivElement | null>;
};

const Section: React.FC<Props> = ({ children, ref, ...props }) => {
  return (
    <Box as="section" ref={ref} {...props}>
      {children}
    </Box>
  );
};

Section.displayName = 'Section';

export default Section;
