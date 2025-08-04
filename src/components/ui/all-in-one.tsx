import { Grid, type GridProps } from '@chakra-ui/react/grid';
import React from 'react';

const AllInOne = ({
  ref,
  children,
  css,
  ...props
}: GridProps & { ref?: React.RefObject<HTMLDivElement> }): React.ReactElement => {
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
