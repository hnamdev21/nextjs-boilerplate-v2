import type { Metadata } from 'next';

import type { Locale } from '@/i18n/routing';
import HomePage from '@/modules/HomePage';
import { extractMetadata } from '@/utils/metadata.util';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;

  return extractMetadata({
    baseMetadata: {
      title: 'Home',
      description: 'Home',
    },
    locale,
  });
};

export default async function Page() {
  return <HomePage />;
}
