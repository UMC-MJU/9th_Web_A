import { useState, useEffect } from "react";
import { getCurrentPath } from "./utils";

export function useCurrentPath(): string {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onLocationChange = () => {
      setPath(getCurrentPath());
    };

    // 뒤로/앞으로 이동 시
    window.addEventListener("popstate", onLocationChange);
    // pushState / replaceState → 커스텀 이벤트
    window.addEventListener("locationchange", onLocationChange);

    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("locationchange", onLocationChange);
    };
  }, []);

  return path;
}
