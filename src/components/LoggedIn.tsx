import { urls } from "../constants";
import { Profile } from "./Profile";
import { Home } from "./Home";
import { UserProfile } from "./UserProfile";
import { Route, Switch } from "react-router-dom";
import { NotExists } from "./NotExists";
import { NavBar } from "./NavBar";
import { UserSearch } from "./UserSearch";

export const LoggedIn = () => {
  console.log("logged in");
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
