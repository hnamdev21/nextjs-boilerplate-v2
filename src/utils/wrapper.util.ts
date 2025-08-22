import { CLIENT_VARS } from '@/constants/client-only';

type FactoryParams<T> = {
  local: T;
  prod: T;
};

export const factory = <T>({ local, prod }: FactoryParams<T>): T => {
  return CLIENT_VARS.ENVIRONMENT === 'production' ? prod : local;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
