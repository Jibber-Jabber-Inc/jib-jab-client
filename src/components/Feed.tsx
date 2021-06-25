import { usePosts } from "../api/post";
import { PostList } from "./PostList";

export const Feed = () => {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <h4>Loading...</h4>;
  if (!posts) return <h4>Error</h4>;

  return <PostList posts={posts} />;
};
