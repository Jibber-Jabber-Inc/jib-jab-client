import { Avatar, Container, Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ChangePassword } from "./ChangePassword";
import { EditProfile } from "./EditProfile";
import { useLoggedUser } from "../api/auth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      width: "100%",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    data: {
      marginTop: "3em",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      gap: 3,
    },
    field: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      "& > *": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 30,
      },
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      fontsize: "2em",
      marginTop: "3em",
      gap: "2em",
    },
  })
);

export const Profile = () => {
  const classes = useStyles();

  const { data: user } = useLoggedUser();

  const { email, username, firstName, lastName } = user!;

  return (
    <Container>
      <Grid container>
        <div className={classes.iconContainer}>
          <Avatar className={classes.large} />
        </div>
        <div className={classes.data}>
          <div className={classes.field}>
            <div>
              <Typography variant={"h4"}>Email: </Typography>
            </div>
            <div>
              <Typography variant={"h5"}>{email}</Typography>
            </div>
          </div>
          <div className={classes.field}>
            <div>
              <Typography variant={"h4"}>Username: </Typography>
            </div>
            <div>
              <Typography variant={"h5"}>{username}</Typography>
            </div>
          </div>
          <div className={classes.field}>
            <div>
              <Typography variant={"h4"}>First name: </Typography>
            </div>
            <div>
              <Typography variant={"h5"}>{firstName}</Typography>
            </div>
          </div>
          <div className={classes.field}>
            <div>
              <Typography variant={"h4"}>Last name: </Typography>
            </div>
            <div>
              <Typography variant={"h5"}>{lastName}</Typography>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <div>
              <EditProfile />
            </div>
            <div>
              <ChangePassword />
            </div>
          </div>
        </div>
      </Grid>
    </Container>
  );
};
