import { useRef, useCallback } from "react";

export function useThrottleCallback<T extends (...args: any) => void>(
    callback: T,
    delay = 500
    ) {
    const lastExecuted = useRef<number>(0);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        callback(...args);
        }
    }, [callback, delay]);
}