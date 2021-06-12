import { urls } from "../constants";
import { Profile } from "./Profile";
import { Home } from "./Home";
import { UserProfile } from "./UserProfile";
import { Route, Switch } from "react-router-dom";
import { NotExists } from "./NotExists";
import { NavBar } from "./NavBar";
import { UserSearch } from "./UserSearch";
import { ChatMessage, useChatStore } from "../store/session";
import { useEffect } from "react";
import { useLoggedUser } from "../api/auth";
import { useFollowedUsers } from "../api/users";
import { Chat } from "./Chat";

export const LoggedIn = () => {
  const { data: { id: loggedUserId } = {} } = useLoggedUser();
  const { data: { userInfoDto: followedUsers = [] } = {} } = useFollowedUsers();
  const initChat = useChatStore((state) => state.initChat);

  const onMessageReceived = (message: ChatMessage) => {};

  useEffect(() => {
    initChat(loggedUserId!, onMessageReceived);
  }, []);

  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path={urls.viewProfile} component={Profile} />
        <Route exact path={urls.searchUsers} component={UserSearch} />
        <Route exact path={urls.home} component={Home} />
        <Route exact path={urls.user.path} component={UserProfile} />
        <Route exact path={urls.chat} component={Chat} />
        <Route component={NotExists} />
      </Switch>
    </div>
  );
};
