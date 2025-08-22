import type { ButtonProps } from '@chakra-ui/react';

export enum CtaVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export const CtaStyles: Record<CtaVariant, ButtonProps> = Object.freeze({
  [CtaVariant.PRIMARY]: {
    //
  },
  [CtaVariant.SECONDARY]: {
    //
  },
  [CtaVariant.TERTIARY]: {
    //
  },
});

export const getCtaStyles = (variant?: CtaVariant): ButtonProps => {
  return CtaStyles[variant ?? CtaVariant.PRIMARY];
};
