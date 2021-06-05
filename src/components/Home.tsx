import { Container } from "@material-ui/core";
import { CreatePost } from "./CreatePost";
import { makeStyles } from "@material-ui/core/styles";
import { Feed } from "./Feed";

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
      <Feed />
    </Container>
  );
};
