import { Avatar, Container, Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useAppSelector } from "../../store";
import { selectUser } from "../../store/slices/user";
import { ChangePassword } from "../editProfile/ChangePassword";

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
    },
    email: {
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
    },
  })
);

export const Profile = () => {
  const classes = useStyles();

  const user = useAppSelector(selectUser);

  const { email } = user!;

  return (
    <Container>
      <Grid container xs={12}>
        <div className={classes.iconContainer}>
          <Avatar className={classes.large} />
        </div>
        <div className={classes.data}>
          <div className={classes.email}>
            <div>
              <Typography variant={"h4"}>Email: </Typography>
            </div>
            <div>
              <Typography variant={"h5"}>{email}</Typography>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <div>
              <ChangePassword />
            </div>
          </div>
        </div>
      </Grid>
    </Container>
  );
};
