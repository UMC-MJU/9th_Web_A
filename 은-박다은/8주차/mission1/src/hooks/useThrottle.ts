import { useRef, useCallback } from "react";

function useThrottleFn<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  const lastExecuted = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        fn(...args);
      }
    },
    [fn, delay]
  );
}

export default useThrottleFn;
