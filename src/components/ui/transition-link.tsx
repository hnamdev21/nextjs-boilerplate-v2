'use client';

import React from 'react';
import type { LinkProps } from 'next/link';

import { Link, usePathname } from '@/i18n/navigation';

type Props = Omit<LinkProps, 'href' | 'prefetch' | 'locale'> & {
  href: string;
  children: React.ReactNode;
};

const TransitionLink: React.FC<Props> = ({ href, children, onClick, ...props }) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (pathname === href) {
      window.location.reload();
      return;
    }

    // Allow external links to work normally
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
