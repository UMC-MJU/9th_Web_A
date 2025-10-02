import React, { useEffect, useState, Children, isValidElement } from "react";
import type { RouteProps } from "./Route";

export function Routes({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  let Match: React.ComponentType | null = null;

  Children.forEach(children, (child) => {
    if (Match || !isValidElement<RouteProps>(child)) return;
    if (child.props.path === currentPath) {
      Match = child.props.component;
    }
  });

  if (Match) {
    const C: React.ComponentType = Match;
    return <C />;
  }

  return <h1>404 Not Found</h1>;
}
