import type { InputProps } from '@chakra-ui/react';

export enum InputVariant {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
}

export const InputStyles: Record<InputVariant, InputProps> = Object.freeze({
  [InputVariant.DEFAULT]: {
    //
  },
  [InputVariant.ERROR]: {
    //
  },
  [InputVariant.SUCCESS]: {
    //
  },
});

export const getInputStyles = (variant?: InputVariant): InputProps => {
  return InputStyles[variant ?? InputVariant.DEFAULT];
};
