import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Post } from "./Post";
import { List, ListItem } from "@material-ui/core";
import { PostData } from "../entities";

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

interface PostListProps {
  posts: PostData[];
}

export const PostList = ({ posts }: PostListProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {posts.map((post) => (
          <ListItem key={post.id}>
            <Post post={post} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
