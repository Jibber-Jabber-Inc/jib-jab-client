import { Button, TextField } from "@material-ui/core";
import { ChangeEvent, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useCreatePost } from "../../api/useCreatePost";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
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

  const handleSubmit = () => {
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
          className={classes.button}
        >
          {isLoading ? "Loading..." : "Send"}
        </Button>
      </form>
    </div>
  );
};
