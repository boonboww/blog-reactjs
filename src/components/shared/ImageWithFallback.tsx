import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

// Simple function to encode spaces in URL (most common issue)
// Don't use new URL() as it auto-encodes and causes double-encoding
function encodeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  // Just replace spaces with %20 - the most common issue
  return url.replace(/ /g, "%20");
}

// Inner component that handles the actual image loading
function ImageWithFallbackInner(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const { src, alt, style, className, ...rest } = props;
  const [didError, setDidError] = useState(false);
  const encodedSrc = encodeImageUrl(src);

  const handleError = () => {
    setDidError(true);
  };

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${
          className ?? ""
        }`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            {...rest}
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      src={encodedSrc}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}

// Wrapper component that uses key to reset state when src changes
export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  // Using src as key forces component to remount when src changes,
  // which resets the error state automatically
  return <ImageWithFallbackInner key={props.src} {...props} />;
}
