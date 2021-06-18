import axios from "axios";
import { useQuery, UseQueryOptions } from "react-query";
import { ChatMessage } from "../entities";

export const useGetMessagesById = (
  id: string | null,
  userId: string,
  options?:
    | UseQueryOptions<ChatMessage[], unknown, ChatMessage[], (string | null)[]>
    | undefined
) =>
  useQuery(
    ["message", id],
    async () => {
      const { data } = await axios.get<ChatMessage[]>(
        `/message/messages/${id}?userId=${userId}`
      );
      return data;
    },
    {
      enabled: !!(id && userId),
      ...options,
    }
  );
