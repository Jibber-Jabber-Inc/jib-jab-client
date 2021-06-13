import React from "react";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link, useHistory } from "react-router-dom";
import { urls } from "../constants";
import { useLoggedUser, useLogOut } from "../api/auth";
import { Badge } from "@material-ui/core";
import { Notifications } from "@material-ui/icons";
import { ChatMessageStatus, useChatStore } from "../store/session";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      marginBottom: "70px",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
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

export const NavBar = () => {
  const classes = useStyles();
  const history = useHistory();

  const { data: { id } = {} } = useLoggedUser();
  const { mutateAsync } = useLogOut();

  const notifications = useChatStore((state) => {
    return Object.values(state.messagesByUserId ?? {})
      .map(
        (messages) =>
          messages.filter(
            (message) =>
              message.status === ChatMessageStatus.RECEIVED &&
              message.senderId !== id
          ).length
      )
      .reduce((a, b) => a + b, 0);
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    handleMenuClose();
    history.push(urls.viewProfile);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await mutateAsync();
    history.push(urls.logIn);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleViewProfile}>Settings</MenuItem>
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Link
            to={urls.home}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            <Typography className={classes.title} variant="h5" noWrap>
              jibber jabber
            </Typography>
          </Link>
          <div
            style={{
              width: 40,
            }}
          />
          <Link
            to={urls.searchUsers}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" noWrap>
              Search users
            </Typography>
          </Link>

          <div
            style={{
              width: 40,
            }}
          />
          <Link
            to={urls.user.byId(id!)}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" noWrap>
              My profile
            </Typography>
          </Link>
          <div
            style={{
              width: 40,
            }}
          />
          <Link
            to={urls.chat}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" noWrap>
              Chat
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div>
            <IconButton color="inherit">
              <Badge badgeContent={notifications} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
};
