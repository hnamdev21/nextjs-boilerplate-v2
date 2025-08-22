import type { TextProps } from '@chakra-ui/react';

export enum TextVariant {
  LG = 'lg',
  MD = 'md',
  SM = 'sm',
  XS = 'xs',
}

export const TextStyles: Record<TextVariant, TextProps> = Object.freeze({
  [TextVariant.LG]: {
    //
  },
  [TextVariant.MD]: {
    //
  },
  [TextVariant.SM]: {
    //
  },
  [TextVariant.XS]: {
    //
  },
});

export const getTextStyles = (variant?: TextVariant): TextProps => {
  return TextStyles[variant ?? TextVariant.MD];
};
