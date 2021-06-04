import { Button, Modal, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@material-ui/core/TextField";
import { errorMessages } from "../../constants";
import { useEditProfile, useLoggedUser } from "../../api/auth";
import { ErrorAlert } from "../ErrorAlert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: 600,
      height: "auto",
      backgroundColor: theme.palette.background.paper,
      // border: "2px solid #000",
      borderRadius: "40px",
      boxShadow: theme.shadows[1],
      padding: "3em",
    },
    center: {
      position: "absolute",
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    },
    inputs: {
      marginTop: "30px",
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: "0.7em",
    },
  })
);
export const EditProfile = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button
        fullWidth
        variant={"outlined"}
        color={"primary"}
        onClick={handleOpen}
      >
        Edit profile
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Inside closeModal={handleClose} />
      </Modal>
    </div>
  );
};

const getDefault = (field: string | undefined, defaultValue: string) =>
  field == null || field === "" ? defaultValue : field;

const schema = yup.object({
  password: yup.string().required(errorMessages.required),
  email: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
});

type EditProfileFormData = yup.InferType<typeof schema>;

const Inside = ({ closeModal }: InsideProps) => {
  const classes = useStyles();
  const { data: user } = useLoggedUser();

  const { control, handleSubmit } = useForm<EditProfileFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const { mutateAsync, isLoading, isError } = useEditProfile();

  const onSubmit = handleSubmit(async (form) => {
    const { email, lastName, firstName } = user!;
    try {
      await mutateAsync({
        password: form.password,
        email: getDefault(form.email, email),
        firstName: getDefault(form.firstName, firstName),
        lastName: getDefault(form.lastName, lastName),
      });
      closeModal();
    } catch (e) {}
  });

  return (
    <div>
      <div className={classes.center}>
        <div className={classes.paper}>
          <Typography variant={"h4"}>Change password</Typography>
          <form onSubmit={onSubmit}>
            <div className={classes.inputs}>
              <Controller
                name={"email"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
                    margin={"normal"}
                    type="email"
                    fullWidth
                    label="Email"
                    error={invalid}
                    helperText={error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name={"firstName"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
                    margin={"normal"}
                    type="text"
                    fullWidth
                    label="First name"
                    error={invalid}
                    helperText={error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name={"lastName"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
                    margin={"normal"}
                    type="text"
                    fullWidth
                    label="Last name"
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
                    label="Current password"
                    autoComplete="current-password"
                    error={invalid}
                    helperText={error?.message}
                    {...field}
                  />
                )}
              />
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
            </div>
          </form>
        </div>
      </div>
      <div>
        <ErrorAlert error={isError}>There was an error!</ErrorAlert>
      </div>
    </div>
  );
};

interface InsideProps {
  closeModal: () => void;
}
