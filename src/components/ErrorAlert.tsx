import React, { ReactNode, useEffect, useState } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

interface ErrorAlertProps {
  error: boolean;
  children: ReactNode;
}

export const ErrorAlert = ({ error, children }: ErrorAlertProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert
        onClose={handleClose}
        severity="error"
        elevation={6}
        variant="filled"
        children={children}
      />
    </Snackbar>
  );
};
