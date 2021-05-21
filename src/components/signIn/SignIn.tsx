import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorMessages, urls } from "../../constants";
import { Link, useHistory } from "react-router-dom";
import { useSignIn } from "../../api/auth";
import { actions, useAppDispatch } from "../../store";
import { ErrorAlert } from "../ErrorAlert";

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
  email: yup
    .string()
    .email(errorMessages.email)
    .required(errorMessages.required),
  password: yup.string().required(errorMessages.required),
});

type SignInFormData = yup.InferType<typeof schema>;

export const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { mutateAsync, isLoading, isError } = useSignIn();

  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      // const signInRes = await mutateAsync(data);
      // dispatch(actions.user.setUser(signInRes));

      const mockUser = {
        id: new Date().toISOString(),
        email: data.email,
      };
      dispatch(actions.user.setUser(mockUser));
      history.push(`/${urls.home}`);
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
            <Controller
              name={"email"}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  margin={"normal"}
                  label="Email Address"
                  autoComplete="email"
                  error={invalid}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name={"password"}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField
                  variant="outlined"
                  margin={"normal"}
                  type="password"
                  fullWidth
                  label="Password"
                  autoComplete="current-password"
                  error={invalid}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            {/*<FormControlLabel*/}
            {/*  control={<Checkbox value="remember" color="primary" />}*/}
            {/*  label="Remember me"*/}
            {/*/>*/}
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
              <Grid item xs>
                {/*<MLink href="#" variant="body2">*/}
                {/*  Forgot password?*/}
                {/*</MLink>*/}
              </Grid>
              <Grid item>
                <Link to={`/${urls.signUp}`}>
                  <MLink variant="body2">
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
