import type { RefObject } from 'react';
import { Grid, type GridProps } from '@chakra-ui/react/grid';

type Props = GridProps & {
  ref?: RefObject<HTMLDivElement | null>;
};

const AllInOne: React.FC<Props> = ({ ref, children, css, ...props }) => {
  return (
    <Grid
      ref={ref}
      templateColumns={'1fr'}
      templateRows={'1fr'}
      css={{
        '& > *': {
          gridColumn: '1 / -1',
          gridRow: '1 / -1',
        },
        ...css,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

AllInOne.displayName = 'AllInOne';

export default AllInOne;
