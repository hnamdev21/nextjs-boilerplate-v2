import type { RefObject } from 'react';
import type { BoxProps } from '@chakra-ui/react/box';
import { Box } from '@chakra-ui/react/box';
import { Grid } from '@chakra-ui/react/grid';

import { ContainerSpacing } from '@/constants/vars';

type Props = BoxProps & {
  ref?: RefObject<HTMLDivElement | null>;
};

const Section: React.FC<Props> & { Content: React.FC<Props> } = ({ children, ref, ...props }) => {
  return (
    <Box as="section" ref={ref} {...props}>
      {children}
    </Box>
  );
};

const SectionContent: React.FC<Props> = ({ children, ref, ...props }) => {
  return (
    <Grid
      as="div"
      ref={ref}
      templateColumns={{
        base: `repeat(${ContainerSpacing.GRID_COLUMNS}, 1fr)`,
      }}
      columnGap={{ base: ContainerSpacing.GRID_GAP }}
      {...props}
    >
      {children}
    </Grid>
  );
};

Section.Content = SectionContent;
Section.displayName = 'Section';
SectionContent.displayName = 'SectionContent';

export default Section;
