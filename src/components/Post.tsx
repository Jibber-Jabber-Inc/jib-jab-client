import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { PostData } from "../entities/entities";
import { formatDistanceToNow } from "date-fns";
import { Button, Divider } from "@material-ui/core";
import { useDeletePost, useDislikePost, useLikePost } from "../api/post";
import { useLoggedUser } from "../api/auth";

const useStyles = makeStyles({
  root: {},
});

type PostProps = {
  post: PostData;
};

export const Post = ({
  post: {
    id: postId,
    content,
    creationDate,
    isLiked,
    amountLikes,
    userInfoDto: { username, id: userId },
  },
}: PostProps) => {
  const classes = useStyles();

  const { data: user } = useLoggedUser();
  const { id: loggedUserId } = user!;
  const { mutate: like } = useLikePost();
  const { mutate: dislike } = useDislikePost();
  const { mutate: deletePost } = useDeletePost();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {username}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          Likes: {amountLikes}
        </Typography>
        <Divider />
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatDistanceToNow(new Date(creationDate + "Z"))}
        </Typography>
        <Button
          onClick={() => {
            isLiked ? dislike(postId) : like(postId);
          }}
        >
          {isLiked ? "dislike" : "like"}
        </Button>
        {loggedUserId === userId && (
          <Button
            onClick={() => {
              deletePost(postId);
            }}
          >
            delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
