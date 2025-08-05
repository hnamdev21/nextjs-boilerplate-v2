import { Box, BoxProps } from '@chakra-ui/react/box';
import { RefObject } from 'react';

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
