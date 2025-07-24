import '@styles/app.scss';

import { routing } from '@i18n/routing';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Locale as LocaleType } from '@i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
};

export const generateMetadata = async ({ params }: Props) => {
  const { locale } = await params;

  return {
    title: 'Home',
    description: 'Home',
    locale,
  };
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for the locale
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS to prevent layout shift */
              body {
                font-family: var(--font-din), "Helvetica Neue", Arial, sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.5;
              }
              h1, h2, h3, h4, h5 {
                font-family: var(--font-copernicus), Georgia, "Times New Roman", serif;
                margin: 0;
              }
              * { box-sizing: border-box; }
            `,
          }}
        />
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
