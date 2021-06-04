import { NavBar } from "../components/navBar/NavBar";
import { Route, Switch } from "react-router-dom";
import { Home } from "../components/main/Home";
import { NotExists } from "../components/notExists/NotExists";
import { SignUp } from "../components/signUp/SignUp";
import { makeStyles } from "@material-ui/core/styles";
import { urls } from "../constants";
import { LogIn } from "../components/logIn/LogIn";
import { Profile } from "../components/profile/Profile";
import { actions, useAppDispatch, useAppSelector } from "../store";
import { selectSession } from "../store/slices/user";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "../components/protectedRoute/ProtectedRoute";
import { Redirect } from "react-router";
import { useLoggedUser } from "../api/auth";

const useStyles = makeStyles({
  root: {
    marginTop: 70,
  },
});

const App = () => {
  const classes = useStyles();
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();

  const { data: user, isLoading } = useLoggedUser();

  if (isLoading) return <span>Loading...</span>;
  if (user) dispatch(actions.session.setUser(user));

  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: session.isAuthenticated,
    authenticationPath: urls.logIn,
    redirectPath: session.redirectPath,
    setRedirectPath: (path) => dispatch(actions.session.setRedirectPath(path)),
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path={urls.notFound} component={NotExists} />
        <Route exact path={urls.signUp} component={SignUp} />
        <Route exact path={urls.logIn} component={LogIn} />
        <div>
          <NavBar />
          <div className={classes.root}>
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact
              path={urls.viewProfile}
              component={Profile}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact
              path={urls.home}
              component={Home}
            />
          </div>
        </div>

        {/*not working*/}
        <Redirect to={urls.notFound} />
      </Switch>
    </div>
  );
};

export default App;
