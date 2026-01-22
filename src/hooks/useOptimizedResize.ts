import { useState, useEffect, useCallback } from 'react';

export function useOptimizedResize<T>(
    callback: (entry: ResizeObserverEntry) => T,
    elementRef: React.RefObject<HTMLElement | null>
) {
    const [size, setSize] = useState<T | null>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        let frameId: number;

        const observer = new ResizeObserver((entries) => {
            // Wrap in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
            // and forced reflow in the same frame
            frameId = requestAnimationFrame(() => {
                const entry = entries[0];
                if (entry) {
                    setSize(callback(entry));
                }
            });
        });

        observer.observe(elementRef.current);

        return () => {
            observer.disconnect();
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [callback, elementRef]);

    return size;
}

// Simple debounce for standard window resize
export function useWindowResize(delay = 100) {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }, delay);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [delay]);

    return windowSize;
}
