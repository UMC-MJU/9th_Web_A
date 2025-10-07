import { type MouseEvent } from "react";
import { getCurrentPath, navigateTo } from "./utils";

interface LinkProps {
  to: string;
  children: React.ReactNode;
}

export function Link({ to, children }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) {
      return; // 이미 같은 경로면 아무 동작 안 함
    }
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
