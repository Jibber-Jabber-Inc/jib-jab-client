import { Container } from "@material-ui/core";
import { CreatePost } from "../createPost/CreatePost";
import { PostList } from "../postList/PostList";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

export const Home = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <CreatePost />
      <PostList />
    </Container>
  );
};
