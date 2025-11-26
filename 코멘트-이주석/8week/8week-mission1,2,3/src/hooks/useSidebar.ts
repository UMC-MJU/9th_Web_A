// src/hooks/useSidebar.ts
import { useCallback, useEffect, useState } from "react";

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 열기
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // 🔥 닫기
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 🔥 토글
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // 🔥 ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  return { isOpen, open, close, toggle };
};

export default useSidebar;
