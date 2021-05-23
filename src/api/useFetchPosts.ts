import { useQuery } from "react-query";
import axios from "axios";
import { PostData } from "../entities/entities";

export const usePosts = () =>
  useQuery<PostData[], Error, PostData[]>("posts", async () => {
    const { data } = await axios.get<PostData[]>("/post/posts");
    return data;
  });
