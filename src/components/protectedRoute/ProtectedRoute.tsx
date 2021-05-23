import { useEffect } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
} & RouteProps;

export default function ProtectedRoute({
  isAuthenticated,
  authenticationPath,
  redirectPath,
  setRedirectPath,
  ...routeProps
}: ProtectedRouteProps) {
  const currentLocation = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(currentLocation.pathname);
    }
  }, [isAuthenticated, setRedirectPath, currentLocation]);

  // if (isAuthenticated && redirectPath === currentLocation.pathname)
  if (isAuthenticated) return <Route {...routeProps} />;

  return (
    <Redirect
      to={{ pathname: isAuthenticated ? redirectPath : authenticationPath }}
    />
  );
}
