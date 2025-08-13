import type { Metadata } from 'next';

import type { Locale } from '@/i18n/routing';

export type BaseMetadata = {
  title?: string;
  description?: string;
  seo?: {
    keywords?: string[];
    siteUrl?: string;
  };
  ogImage?: string;
};

export type OverrideMetadata = {
  title?: string;
  description?: string;
  heading?: string;
  keywords?: string[];
  ogImage?: string;
};

export type ExtractMetadataParams = {
  baseMetadata: BaseMetadata;
  overrideMetadata?: OverrideMetadata;
  locale: Locale;
  imageUrl?: string;
};

export const extractMetadata = (params: ExtractMetadataParams): Metadata => {
  const { baseMetadata, overrideMetadata, locale, imageUrl } = params;

  const finalTitle = overrideMetadata?.heading || overrideMetadata?.title || baseMetadata.title;
  const finalDescription = overrideMetadata?.description || baseMetadata.description;
  const finalKeywords = overrideMetadata?.keywords || baseMetadata.seo?.keywords;
  const finalImage = imageUrl || overrideMetadata?.ogImage || baseMetadata.ogImage;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: finalImage,
      type: 'website',
      siteName: baseMetadata.title,
      locale: locale,
      url: baseMetadata.seo?.siteUrl,
    },
  };
};
