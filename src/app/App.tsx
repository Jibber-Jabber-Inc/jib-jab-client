import { NavBar } from "../components/navBar/NavBar";
import { Route, Switch } from "react-router-dom";
import { Home } from "../components/main/Home";
import { NotExists } from "../components/notExists/NotExists";
import { SignUp } from "../components/signUp/SignUp";
import { makeStyles } from "@material-ui/core/styles";
import { urls } from "../constants";
import { SignIn } from "../components/signIn/SignIn";
import { EditProfile } from "../components/editProfile/EditProfile";
import { Profile } from "../components/profile/Profile";

const useStyles = makeStyles({
  root: {
    marginTop: 70,
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <div className="App">
      <Switch>
        <Route exact path={`/${urls.signUp}`} component={SignUp} />
        <Route exact path={`/${urls.signIn}`} component={SignIn} />
        <div>
          <NavBar />
          <div className={classes.root}>
            <Route exact path={`/${urls.home}`} component={Home} />
            <Route exact path={`/${urls.viewProfile}`} component={Profile} />
            <Route
              exact
              path={`/${urls.editProfile}`}
              component={EditProfile}
            />
          </div>
        </div>
        <Route component={NotExists} />
      </Switch>
    </div>
  );
};

export default App;
