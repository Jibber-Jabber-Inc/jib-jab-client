import { useQuery } from "react-query";
import axios from "axios";

export const usePosts = () =>
  useQuery<PostData[]>("posts", async () => {
    const { data } = await axios.get<PostData[]>(
      "http://localhost:8080/api/post"
    );
    return data;
  });

export type PostData = {
  id: number;
  content: string;
  creationDate: Date;
};
