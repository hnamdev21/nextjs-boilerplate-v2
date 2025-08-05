import { BoxProps } from '@chakra-ui/react/box';
import { Grid } from '@chakra-ui/react/grid';
import { Container } from '@constants/vars';
import { RefObject } from 'react';

type Props = BoxProps & {
  ref?: RefObject<HTMLDivElement | null>;
};

const SectionContent: React.FC<Props> = ({ children, ref, ...props }) => {
  return (
    <Grid
      as="div"
      ref={ref}
      templateColumns={{
        base: `repeat(${Container.GRID_COLUMNS}, 1fr)`,
      }}
      columnGap={{ base: Container.GRID_GAP }}
      {...props}
    >
      {children}
    </Grid>
  );
};

SectionContent.displayName = 'SectionContent';

export default SectionContent;
