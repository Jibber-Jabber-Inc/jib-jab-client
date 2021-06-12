import { useUsers } from "../api/users";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { useState } from "react";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import { User } from "../entities/entities";
import { Button, Typography } from "@material-ui/core";
import { useLoggedUser } from "../api/auth";
import { useChatStore } from "../store/session";

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

const filterUsers = (users: User[], input: string | null) => {
  if (input === "" || input == null) return users;
  return users.filter(
    ({ email, firstName, lastName }) =>
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

  const { activeContactId, setActiveContactId } = useChatStore(
    ({ activeContactId, setActiveContactId }) => ({
      activeContactId,
      setActiveContactId,
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
        {filterUsers(users, userSearch).map(({ username, id }) =>
          currentUserId === id ? null : (
            <div>
              <Button
                onClick={() => {
                  setActiveContactId(id);
                }}
              >
                <Typography variant={"h5"}>{username}</Typography>
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
