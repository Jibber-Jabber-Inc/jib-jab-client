import { equals } from "ramda";
import SockJs from "sockjs-client";
import Stomp from "stompjs";
import { ChatMessage, ChatMessageCreation } from "../entities";
import { createStore } from "./utils";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "/api/message/ws"
    : "http://localhost:8082/api/message/ws";

interface ChatState {
  activeContactId: string | null;
  messagesByUserId: { [userId: string]: ChatMessage[] | undefined };
  stompClient: Stomp.Client | null;

  initChat(userId: string): void;

  sendMessage(message: ChatMessageCreation): boolean;
  setActiveContactId(id: string | null): void;
  addMessages(messages: ChatMessage[]): void;
  readMessage(message: ChatMessage): void;
}

export const useChatStore = createStore<ChatState>((set, get) => ({
  activeContactId: null,
  messagesByUserId: {},
  stompClient: null,
  initChat(userId) {
    const socket = new SockJs(socketUrl);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/user/" + userId + "/queue/messages",
        (message) => {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          chatMessage.timestamp = new Date(chatMessage.timestamp);

          const id =
            chatMessage.senderId === userId
              ? chatMessage.recipientId
              : chatMessage.senderId;

          set((state) => ({
            messagesByUserId: {
              ...state.messagesByUserId,
              [id]: [...(state.messagesByUserId[id] ?? []), chatMessage],
            },
          }));

          const contactId = get().activeContactId;

          if (
            equals(chatMessage.recipientId, userId) &&
            equals(chatMessage.senderId, contactId)
          )
            stompClient.send(
              "/app/read",
              {},
              JSON.stringify({
                id: userId,
                messageId: chatMessage.id,
              })
            );
        }
      );

      stompClient.subscribe("/user/" + userId + "/queue/read", (message) => {
        const chatMessage = JSON.parse(message.body) as ChatMessage;
        chatMessage.timestamp = new Date(chatMessage.timestamp);

        const id =
          chatMessage.senderId === userId
            ? chatMessage.recipientId
            : chatMessage.senderId;

        set((state) => ({
          messagesByUserId: {
            ...state.messagesByUserId,
            [id]: (state.messagesByUserId[id] ?? []).map((m) =>
              equals(m.id, chatMessage.id) ? chatMessage : m
            ),
          },
        }));
      });
    });

    set({ stompClient });
  },
  sendMessage(chatMessage) {
    const stompClient = get().stompClient;
    const activeContact = get().activeContactId;

    if (!stompClient?.connected || !activeContact) return false;
    stompClient.send(
      "/app/chat",
      {},
      JSON.stringify({
        ...chatMessage,
        recipientId: activeContact,
      })
    );
    return true;
  },
  setActiveContactId(id) {
    set({ activeContactId: id });
  },
  addMessages(messages) {
    const id = get().activeContactId;

    if (id == null) return;

    set((state) => ({
      messagesByUserId: {
        ...state.messagesByUserId,
        [id]: messages,
      },
    }));
  },
  readMessage(message) {
    const client = get().stompClient;
    if (client == null) return;
    client.send(
      "/app/read",
      {},
      JSON.stringify({
        messageId: message.id,
      })
    );
  },
}));
