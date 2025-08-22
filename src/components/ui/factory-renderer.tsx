'use client';

import { CLIENT_VARS } from '@/constants/client-only';

type Props = {
  local: React.ReactNode;
  prod: React.ReactNode;
};

const FactoryRenderer: React.FC<Props> = ({ local, prod }) => {
  const isProduction = CLIENT_VARS.ENVIRONMENT === 'production';

  return isProduction ? prod : local;
};

export default FactoryRenderer;
