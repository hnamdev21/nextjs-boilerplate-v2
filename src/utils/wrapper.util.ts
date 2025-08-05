import { isProduction } from '@/constants/client-env';

type FactoryParams<T> = {
  local: T;
  prod: T;
};

export const factory = <T>({ local, prod }: FactoryParams<T>): T => {
  return isProduction ? prod : local;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
