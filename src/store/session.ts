import create from "zustand";
import Stomp from "stompjs";
import SockJs from "sockjs-client";
import { pipe } from "ramda";
import { devtools } from "zustand/middleware";

const createStore = pipe(devtools, create);

interface SessionState {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

export const useSessionStore = createStore<SessionState>((set) => ({
  redirectPath: "",
  setRedirectPath: (path) => set({ redirectPath: path }),
}));

export interface ChatMessage {
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messagesByUserId: { [userId: string]: ChatMessage[] };
  stompClient: Stomp.Client | null;

  initChat(
    userId: string,
    onMessageReceived?: (message: ChatMessage) => void
  ): void;

  sendMessage(message: ChatMessage): boolean;
}

export const useChatStore = createStore<ChatState>((set, get) => ({
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
          set((state) => ({
            messagesByUserId: {
              ...state.messagesByUserId,
              [chatMessage.senderId]: [
                ...(state.messagesByUserId[chatMessage.senderId] ?? []),
                chatMessage,
              ],
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
    if (stompClient === null || !stompClient.connected) return false;
    console.log("about to send");
    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    set((state) => ({
      messagesByUserId: {
        ...state.messagesByUserId,
        [chatMessage.recipientId]: [
          ...(state.messagesByUserId[chatMessage.recipientId] ?? []),
          chatMessage,
        ],
      },
    }));
    return true;
  },
}));
