"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  placeholderHeight?: string;
}

export default function LazySection({
  children,
  threshold = 0.1,
  className,
  placeholderHeight = "min-h-[200px]"
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold } // Pre-load 200px before
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={ref} className={cn(className, !isVisible && placeholderHeight)}>
      {isVisible ? children : null}
    </div>
  );
}
