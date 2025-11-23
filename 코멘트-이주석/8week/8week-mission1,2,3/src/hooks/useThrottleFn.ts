import { useRef, useCallback } from "react";

export default function useThrottleFn(fn: () => void, delay: number) {
  const lastRan = useRef<number>(0);

  return useCallback(() => {
    const now = Date.now();

    if (now - lastRan.current >= delay) {
      fn();
      lastRan.current = now;
    }
  }, [fn, delay]);
}
