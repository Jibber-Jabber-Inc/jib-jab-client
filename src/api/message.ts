import axios from "axios";
import { useQuery, UseQueryOptions } from "react-query";
import { ChatMessage } from "../entities";

export const useGetMessagesById = (
  id: string | null,
  options?:
    | UseQueryOptions<ChatMessage[], unknown, ChatMessage[], (string | null)[]>
    | undefined
) =>
  useQuery(
    ["message", id],
    async () => {
      const { data } = await axios.get<ChatMessage[]>(
        `/message/messages/${id}`
      );
      return data;
    },
    {
      enabled: id != null,
      ...options,
    }
  );
