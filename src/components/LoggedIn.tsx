import { urls } from "../constants";
import { Profile } from "./profile/Profile";
import { Home } from "./main/Home";
import { UserProfile } from "./userProfile/UserProfile";
import { Route, Switch } from "react-router-dom";
import { NotExists } from "./notExists/NotExists";
import { NavBar } from "./navBar/NavBar";
import { UserSearch } from "./UserSearch";

export const LoggedIn = () => {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path={urls.viewProfile} component={Profile} />
        <Route exact path={urls.searchUsers} component={UserSearch} />
        <Route exact path={urls.home} component={Home} />
        <Route exact path={urls.user.path} component={UserProfile} />
        <Route component={NotExists} />
      </Switch>
    </div>
  );
};
