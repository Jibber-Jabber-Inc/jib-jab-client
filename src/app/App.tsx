import { Route, Switch } from "react-router-dom";
import { NotExists } from "../components/NotExists";
import { SignUp } from "../components/SignUp";
import { urls } from "../constants";
import { LogIn } from "../components/LogIn";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "../components/ProtectedRoute";
import { useLoggedUser } from "../api/auth";
import { LoggedIn } from "../components/LoggedIn";
import { useSessionStore } from "../store/session";

const App = () => {
  const { redirectPath, setRedirectPath } = useSessionStore();

  const { data: user, isLoading } = useLoggedUser();

  if (isLoading) return <span>Loading...</span>;

  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: user != null,
    authenticationPath: urls.logIn,
    redirectPath,
    setRedirectPath,
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path={urls.signUp} component={SignUp} />
        <Route exact path={urls.logIn} component={LogIn} />
        <Route exact path={urls.notFound} component={NotExists} />
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          path={urls.home}
          component={LoggedIn}
        />
        <Route component={NotExists} />
      </Switch>
    </div>
  );
};

export default App;
