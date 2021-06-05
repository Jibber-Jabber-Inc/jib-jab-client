import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import MLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorMessages, urls } from "../constants";
import { Link, useHistory } from "react-router-dom";
import { useSignIn } from "../api/auth";
import { useAppSelector } from "../store";
import { ErrorAlert } from "./ErrorAlert";
import { FormField } from "./FormField";
import { selectRedirectPath } from "../store/slices/user";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup.object({
  username: yup.string().required(errorMessages.required),
  password: yup.string().required(errorMessages.required),
});

type SignInFormData = yup.InferType<typeof schema>;

export const LogIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const redirectPath = useAppSelector(selectRedirectPath);

  const { mutateAsync, isLoading, isError } = useSignIn();

  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("before mutate");
      await mutateAsync(data);
      console.log("after mutate");
      history.push(redirectPath);
    } catch (e) {}
  });

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormField
                  control={control}
                  label={"Username"}
                  name={"username"}
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  control={control}
                  label={"Password"}
                  name={"password"}
                  type={"password"}
                  autoComplete={"current-password"}
                />
              </Grid>
            </Grid>
            <div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
            </div>
            <Grid container>
              <Grid item xs />
              <Grid item>
                <Link to={urls.signUp}>
                  <MLink variant="body2" component={"span"}>
                    {"Don't have an account? Sign Up"}
                  </MLink>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <ErrorAlert error={isError}>There was an error!</ErrorAlert>
    </Grid>
  );
};
