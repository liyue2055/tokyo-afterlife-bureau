import type { ImgHTMLAttributes } from "react";

type StaticImage = { src: string; width?: number; height?: number };
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticImage;
  alt: string;
  fill?: boolean;
  unoptimized?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
  onLoadingComplete?: unknown;
};

export default function Image({
  src,
  alt,
  fill,
  unoptimized: _unoptimized,
  priority,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  loader: _loader,
  onLoadingComplete: _onLoadingComplete,
  width,
  height,
  style,
  loading,
  ...attributes
}: ImageProps) {
  const image = typeof src === "string" ? { src } : src;
  return (
    <img
      {...attributes}
      src={image.src}
      alt={alt}
      width={width ?? image.width}
      height={height ?? image.height}
      loading={loading ?? (priority ? "eager" : "lazy")}
      fetchPriority={priority ? "high" : attributes.fetchPriority}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              ...style,
            }
          : style
      }
    />
  );
}
