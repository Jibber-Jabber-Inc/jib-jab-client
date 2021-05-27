import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Post } from "../post/Post";
import { List, ListItem } from "@material-ui/core";
import { usePosts } from "../../api/post";

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    list: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: 200,
    },
  })
);

export const PostList = () => {
  const classes = useStyles();
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <h4>Loading...</h4>;
  if (!posts) return <h4>Error</h4>;

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {posts.map(({ id, content }) => (
          <ListItem key={id}>
            <Post description={content} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
