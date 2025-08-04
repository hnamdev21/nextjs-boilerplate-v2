import '@styles/app.scss';

import { Locale as LocaleType, routing } from '@i18n/routing';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
};

export const generateMetadata = async (_: Props): Promise<Metadata> => {
  return {
    title: 'Home',
    description: 'Home',
    metadataBase: new URL('https://www.example.com'),
    alternates: {
      canonical: 'https://www.example.com',
    },
    openGraph: {
      title: 'Home',
    },
  };
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body>
        <NextIntlClientProvider messages={messages}>
          <main>{children}</main>
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
