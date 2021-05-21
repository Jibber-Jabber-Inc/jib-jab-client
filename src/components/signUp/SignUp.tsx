import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MLink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessages, urls } from "../../constants";
import { Link, useHistory } from "react-router-dom";
import { useSignUp } from "../../api/auth";

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

  const { mutate } = useSignUp();

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutate(data);
    history.push(`/${urls.signIn}`);
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
            <Grid item xs={12}>
              <Controller
                name={"email"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Email Address"
                    autoComplete="email"
                    error={invalid}
                    helperText={error?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name={"password"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
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
              <Link to={`/${urls.signIn}`}>
                <MLink variant="body2">Already have an account? Sign in</MLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
