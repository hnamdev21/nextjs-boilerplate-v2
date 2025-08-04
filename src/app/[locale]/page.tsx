import { Locale } from '@i18n/routing';
import HomePage from '@modules/Home';
import { extractMetadata } from '@utils/metadata';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: Locale }>;
}

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
