"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  containerClassName?: string;
  useSkeleton?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}

export default function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  useSkeleton = true,
  loading,
  fetchPriority,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Performance: If priority is true, loading must be 'eager' (default for priority), otherwise 'lazy'
  const loadStrategy = priority ? "eager" : loading || "lazy";

  return (
    <div className={cn(
      props.fill ? "absolute inset-0 h-full w-full" : "relative",
      "overflow-hidden", 
      containerClassName
    )}>
      {useSkeleton && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse z-0" />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "duration-700 ease-in-out",
          useSkeleton && !isLoaded ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        priority={priority}
        loading={loadStrategy}
        decoding="async"
        {...(fetchPriority && { fetchPriority } as Record<string, string>)}
        {...props}
      />
    </div>
  );
}
