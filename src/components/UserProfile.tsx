import { useParams } from "react-router-dom";
import { useUserInfoById } from "../api/users";
import { usePostsByUserId } from "../api/post";
import { PostList } from "./PostList";
import { Typography } from "@material-ui/core";
import { CreatePost } from "./CreatePost";

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUserInfoById(id);
  const { data: posts, isLoading: isPostsLoading } = usePostsByUserId(id);
  // const { data: { id: loggedUserId } = {} } = useLoggedUser();

  if (isLoading) return <h4>loading...</h4>;
  if (isPostsLoading) return <h4>loading...</h4>;
  if (!user) return <h4>Error</h4>;
  if (!posts) return <h4>Error</h4>;

  return (
    <div
      style={{
        marginTop: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Typography variant={"h4"}>@{user.username}</Typography>
      </div>
      <div
        style={{
          marginTop: 20,
        }}
      >
        <Typography variant={"h6"}>
          {user.firstName} {user.lastName}
        </Typography>
      </div>
      <div
        style={{
          marginTop: 30,
        }}
      >
        <CreatePost />
      </div>

      <div
        style={{
          marginTop: 30,
        }}
      >
        <PostList posts={posts} />
      </div>
    </div>
  );
};
