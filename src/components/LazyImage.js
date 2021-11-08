import React, { useState, useEffect } from "react";

const LazyImage = ({
  src,
  alt = "",
  ImageComponent,
  onLoad = () => {},
  onError = () => {},
}) => {
  const [imageSrc, setImageSrc] = useState();
  const [imageRef, setImageRef] = useState();

  const onLoadListener = (event) => onLoad(event);
  const onErrorListener = (event) => onError(event);

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: "75%",
          }
        );
        observer.observe(imageRef);
      } else {
        // Old browsers fallback
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);
  return (
    <ImageComponent
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      onLoad={onLoadListener}
      onError={onErrorListener}
    />
  );
};

export default LazyImage;
