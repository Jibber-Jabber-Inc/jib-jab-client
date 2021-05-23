import { Button, TextField } from "@material-ui/core";
import { ChangeEvent, FormEventHandler, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useCreatePost } from "../../api/useCreatePost";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      margin: theme.spacing(1),
    },
  })
);

export const CreatePost = () => {
  const classes = useStyles();
  const [content, setPost] = useState("");
  const { mutate, isLoading } = useCreatePost();

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPost(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate({ content });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="jib-create"
            label="Add Jib"
            multiline
            rows={4}
            defaultValue={content}
            variant="outlined"
            onChange={handleChange}
          />
        </div>
        <Button
          type={"submit"}
          variant="contained"
          color="primary"
          className={classes.buttonContainer}
        >
          {isLoading ? "Loading..." : "Send"}
        </Button>
      </form>
    </div>
  );
};
