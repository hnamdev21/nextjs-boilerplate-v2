import type { HeadingProps } from '@chakra-ui/react';

export enum HeadingVariant {
  LG = 'lg',
  MD = 'md',
  SM = 'sm',
  XS = 'xs',
}

export const HeadingStyles: Record<HeadingVariant, HeadingProps> = Object.freeze({
  [HeadingVariant.LG]: {
    as: 'h1',
  },
  [HeadingVariant.MD]: {
    as: 'h2',
  },
  [HeadingVariant.SM]: {
    as: 'h3',
  },
  [HeadingVariant.XS]: {
    as: 'h4',
  },
});

export const getHeadingStyles = (variant?: HeadingVariant): HeadingProps => {
  return HeadingStyles[variant ?? HeadingVariant.LG];
};
