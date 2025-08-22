import type { Metadata } from 'next';

import type { Locale } from '@/i18n/routing';
import LoginPage from '@/modules/LoginPage';
import { extractMetadata } from '@/utils/metadata.util';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;

  return extractMetadata({
    baseMetadata: {
      title: 'Login',
      description: 'Login',
    },
    locale,
  });
};

export default async function Page() {
  return <LoginPage />;
}
