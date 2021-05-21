import { Button, Modal, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@material-ui/core/TextField";
import { errorMessages } from "../../constants";
import { useAppSelector } from "../../store";
import { useChangePassword } from "../../api/auth";
import { selectUser } from "../../store/slices/user";
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
      transform: `translate(-50%, -70%)`,
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
export const ChangePassword = () => {
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
        Change password
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

const schema = yup.object({
  oldPassword: yup.string().required(errorMessages.required),
  newPassword: yup.string().required(errorMessages.required),
});

type ChangePasswordFormData = yup.InferType<typeof schema>;

const Inside = ({ closeModal }: InsideProps) => {
  const classes = useStyles();

  const user = useAppSelector(selectUser);

  const { control, handleSubmit } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const { mutateAsync, isLoading, isError } = useChangePassword();

  if (!user) return null;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const { id } = user;
    try {
      await mutateAsync({ id, ...data });
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
                name={"oldPassword"}
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
              <Controller
                name={"newPassword"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextField
                    variant="outlined"
                    margin={"normal"}
                    type="password"
                    fullWidth
                    label="New password"
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
