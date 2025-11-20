import { useState, useCallback } from "react";

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // 데스크탑 기본값 true

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
