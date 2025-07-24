import { Locale } from '@i18n/routing';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: Props) => {
  const { locale } = await params;

  return {
    title: 'Home',
    description: 'Home',
    locale,
  };
};

export default async function Page() {
  return <div>Home</div>;
}
