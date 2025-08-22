import { useEffect } from 'react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

import { useAsset } from '@/providers/asset.provider';

type Props = ImageProps;

const PreloadImage: React.FC<Props> = ({ ...props }) => {
  const { loadAsset, completeAsset } = useAsset();

  useEffect(() => {
    loadAsset();
  }, []);

  return (
    <Image
      sizes="100vw"
      quality={100}
      loading="eager"
      {...props}
      onLoad={completeAsset}
      onError={completeAsset}
    />
  );
};

export default PreloadImage;
