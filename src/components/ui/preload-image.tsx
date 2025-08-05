import { useAsset } from '@providers/asset.provider';
import Image, { ImageProps } from 'next/image';
import { useEffect } from 'react';

type Props = ImageProps;

const PreloadImage: React.FC<Props> = ({ ...props }) => {
  const { loadAsset, completeAsset } = useAsset();

  useEffect(() => {
    loadAsset();
  }, []);

  return <Image sizes="100vw" {...props} onLoad={completeAsset} onError={completeAsset} />;
};

export default PreloadImage;
