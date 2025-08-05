import '@/styles/app.scss';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Locale as LocaleType } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import MainLayout from '@/modules/Layouts';
import MainProviders from '@/providers/index';
import { extractMetadata } from '@/utils/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
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
          <MainProviders>
            <MainLayout>
              {children}

              <SpeedInsights />
            </MainLayout>
          </MainProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
