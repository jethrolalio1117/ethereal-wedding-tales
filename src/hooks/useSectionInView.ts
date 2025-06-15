
import { useEffect, useRef, useState } from "react";

/**
 * Hook to detect if section is in viewport.
 * @returns [ref, inView]
 */
export function useSectionInView(threshold = 0.4) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );
    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, inView] as const;
}
