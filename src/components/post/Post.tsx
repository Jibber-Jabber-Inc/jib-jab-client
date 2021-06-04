import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { PostData } from "../../entities/entities";
import { formatDistanceToNow } from "date-fns";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles({
  root: {},
});

type PostProps = {
  post: PostData;
};

export const Post = ({
  post: {
    content,
    creationDate,
    userInfoDto: { username },
  },
}: PostProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {username}
        </Typography>
        <Divider />
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatDistanceToNow(new Date(creationDate + "Z"))}
        </Typography>
      </CardContent>
    </Card>
  );
};
