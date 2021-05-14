import { PrimarySearchAppBar } from "../components/navBar/SearchNavBar";
import { PostList } from "../components/postList/PostList";
import { CreatePost } from "../components/createPost/CreatePost";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <div className="App">
      <PrimarySearchAppBar />
      <Container className={classes.root}>
        <CreatePost />
        <PostList />
      </Container>
    </div>
  );
};

export default App;
