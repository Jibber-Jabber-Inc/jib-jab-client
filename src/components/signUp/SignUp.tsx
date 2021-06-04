import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import MLink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessages, urls } from "../../constants";
import { Link, useHistory } from "react-router-dom";
import { useSignUp } from "../../api/auth";
import { FormField } from "../forms/FormField";
import { ErrorAlert } from "../ErrorAlert";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup.object({
  username: yup.string().required(errorMessages.required),
  firstName: yup.string().required(errorMessages.required),
  lastName: yup.string().required(errorMessages.required),
  email: yup
    .string()
    .email(errorMessages.email)
    .required(errorMessages.required),
  password: yup.string().required(errorMessages.required),
});

type SignUpFormData = yup.InferType<typeof schema>;

export const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  const { mutateAsync, isError } = useSignUp();

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      history.push(urls.logIn);
    } catch (e) {}
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormField
                control={control}
                label={"First Name"}
                name={"firstName"}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                control={control}
                label={"Last Name"}
                name={"lastName"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                control={control}
                label={"Email"}
                name={"email"}
                autoComplete={"email"}
              />
            </Grid>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to={urls.logIn}>
                <MLink variant="body2">Already have an account? Sign in</MLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <ErrorAlert error={isError}>There was an error!</ErrorAlert>
    </Container>
  );
};
