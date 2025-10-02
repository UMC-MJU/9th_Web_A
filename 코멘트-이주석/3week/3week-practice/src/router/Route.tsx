import { type ReactElement, Children, cloneElement, useMemo } from "react";
import { useCurrentPath } from "./useCurrentPath";

interface RouteProps {
  path: string;
  component: React.ComponentType<unknown>;
}

// 단일 Route는 단순히 component prop만 받는 형태
export function Route(props: RouteProps): ReactElement | null {
  const { component: Component } = props;
  return <Component />;
}

interface RoutesProps {
  children: ReactElement<RouteProps> | ReactElement<RouteProps>[];
}

export function Routes({ children }: RoutesProps) {
  const currentPath = useCurrentPath();
  const routes = Children.toArray(children) as ReactElement<RouteProps>[];

  // 현재 경로와 매칭되는 Route 찾기
  const activeRoute = useMemo(() => {
    return routes.find((route) => route.props.path === currentPath);
  }, [routes, currentPath]);

  if (!activeRoute) {
    // 매칭되는 라우트가 없으면 404 처리
    return <h1>404 Not Found</h1>;
  }

  // cloneElement 혹은 그냥 렌더링
  return cloneElement(activeRoute);
}
