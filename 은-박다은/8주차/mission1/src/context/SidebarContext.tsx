import { createContext, useContext, type ReactNode } from "react";
import { useSidebar } from "../hooks/useSidbar";

// 1) useSidebar()가 반환하는 타입 정의
interface SidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// 2) createContext에 명확한 타입 넣기
const SidebarContext = createContext<SidebarContextType | null>(null);

// 3) Provider
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const sidebar = useSidebar(); // { isOpen, open, close, toggle }

  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  );
};

// 4) custom hook
export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebarContext must be used inside SidebarProvider");
  }
  return ctx;
};
