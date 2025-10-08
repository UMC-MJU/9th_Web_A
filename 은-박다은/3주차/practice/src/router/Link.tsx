import React from "react";

type LinkProps = {
  to: string;
  children: React.ReactNode;
};

export function Link({ to, children }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
