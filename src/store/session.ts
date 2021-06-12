import create from "zustand";
import Stomp from "stompjs";
import SockJs from "sockjs-client";
import { pipe } from "ramda";
import { devtools } from "zustand/middleware";
import { User } from "../entities/entities";

const createStore = pipe(devtools, create);

interface SessionState {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

export const useSessionStore = createStore<SessionState>((set) => ({
  redirectPath: "",
  setRedirectPath: (path) => set({ redirectPath: path }),
}));

export interface ChatMessageCreation {
  senderId: string;
  content: string;
}

export enum ChatMessageStatus {
  RECEIVED = "RECEIVED",
  READ = "READ",
}

export interface ChatMessage {
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: Date;
  status: ChatMessageStatus;
}

interface ChatState {
  activeContactId: string | null;
  messagesByUserId: { [userId: string]: ChatMessage[] };
  stompClient: Stomp.Client | null;

  initChat(
    userId: string,
    onMessageReceived?: (message: ChatMessage) => void
  ): void;

  sendMessage(message: ChatMessageCreation): boolean;
  setActiveContactId: (id: string) => void;
}

export const useChatStore = createStore<ChatState>((set, get) => ({
  activeContactId: null,
  messagesByUserId: {},
  stompClient: null,
  initChat(userId, onMessageReceived) {
    const socket = new SockJs("http://localhost:8082/api/message/ws");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/user/" + userId + "/queue/messages",
        (message) => {
          const chatMessage = JSON.parse(message.body) as ChatMessage;

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
          onMessageReceived?.(chatMessage);
        }
      );
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
}));
