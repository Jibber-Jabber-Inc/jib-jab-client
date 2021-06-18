import { Button, Typography } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { equals, filter, identity, last, map, not, pipe, sortBy } from "ramda";
import { useState } from "react";
import { useLoggedUser } from "../api/auth";
import { useUsers } from "../api/users";
import { ChatMessage, ChatMessageStatus, User } from "../entities";
import { useChatStore } from "../store/chat";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  })
);
type MessagesByUserId = { [userId: string]: ChatMessage[] };

const processUsers = (
  users: User[],
  {
    input,
    currentUserId,
    messagesByUserId,
  }: {
    input: string | null;
    currentUserId: string;
    messagesByUserId: MessagesByUserId;
  }
) => {
  return pipe(
    removeCurrentUser(currentUserId),
    inputFilter(input),
    addNotifications(messagesByUserId),
    sortByMessagesDate(messagesByUserId)
  )(users);
};

type UserWithNotifications = User & { notifications: number };

const addNotifications = (messagesByUserId: MessagesByUserId) =>
  map((user: User): UserWithNotifications => {
    const notifications =
      messagesByUserId[user.id]?.filter((m) =>
        not(equals(m.status, ChatMessageStatus.READ))
      )?.length ?? 0;

    return {
      ...user,
      notifications,
    };
  });

const sortByMessagesDate = (messagesByUserId: MessagesByUserId) =>
  sortBy(
    (user: UserWithNotifications) =>
      last(messagesByUserId[user.id] ?? [])?.timestamp ?? false
  );

const removeCurrentUser = (currentUserId: string) => (users: User[]) =>
  users.filter(({ id }) => !equals(id, currentUserId));

const inputFilter = (input: string | null) => {
  if (input === "" || input == null) return identity;
  return filter(
    ({ email, firstName, lastName }: User) =>
      email.includes(input) ||
      firstName.includes(input) ||
      lastName.includes(input)
  );
};

export const UserChatSearch = () => {
  const classes = useStyles();
  const [userSearch, setUserSearch] = useState("");
  const { data: user } = useLoggedUser();
  const { id: currentUserId } = user!;
  const { data: users, isLoading } = useUsers();

  const { activeContactId, setActiveContactId, messagesByUserId } =
    useChatStore(
      ({ activeContactId, setActiveContactId, messagesByUserId }) => ({
        activeContactId,
        setActiveContactId,
        messagesByUserId,
      })
    );

  if (isLoading) return <h4>loading...</h4>;
  if (!users) return <h4>Error</h4>;

  return (
    <div>
      <div
        className={classes.search}
        style={
          {
            // marginTop: 100,
          }
        }
      >
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={userSearch}
          onChange={(event) => {
            setUserSearch(event.target.value);
          }}
          placeholder="Search users…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>

      <div
        style={{
          marginTop: 40,
          marginLeft: 40,
        }}
      >
        {processUsers(users, {
          input: userSearch,
          currentUserId,
          messagesByUserId,
        }).map(({ username, id, notifications }) => (
          <div key={id}>
            <Button
              style={{
                display: "flex",
                // width: "auto",
                // gap: 100,
              }}
              onClick={() => {
                activeContactId !== id && setActiveContactId(id);
              }}
            >
              <Typography
                style={{
                  color: activeContactId !== id ? "black" : "green",
                }}
                variant={"h5"}
              >
                {username}
              </Typography>
              {notifications !== 0 && id !== activeContactId && (
                <div
                  style={{
                    marginLeft: 10,
                    // display: "inline-block",
                    padding: 10,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    display: "grid",
                    placeContent: "center",
                  }}
                >
                  {notifications}
                </div>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
