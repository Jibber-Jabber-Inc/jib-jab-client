import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useLoggedUser } from "../api/auth";
import { UserChatSearch } from "./UserChatSearch";
import { formatDistanceToNow } from "date-fns";
import { DoneAllRounded, DoneRounded } from "@material-ui/icons";
import { ChatMessageStatus, ChatMessage } from "../entities";
import { useChatStore } from "../store/chat";
import { useGetMessagesById } from "../api/message";
import { equals } from "ramda";

export const Chat = () => {
  const { data: currentUser } = useLoggedUser();

  const {
    messages = [],
    sendMessage,
    activeContactId,
    addMessages,
    removeContact,
    readMessage,
  } = useChatStore((state) => ({
    messages: state.activeContactId
      ? state.messagesByUserId[state.activeContactId]
      : [],
    sendMessage: state.sendMessage,
    activeContactId: state.activeContactId,
    addMessages: state.addMessages,
    removeContact: () => state.setActiveContactId(null),
    readMessage: state.readMessage,
  }));

  useGetMessagesById(activeContactId, {
    onSuccess(messages) {
      addMessages(messages);
    },
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    messages.forEach((m) => {
      if (
        equals(m.recipientId, currentUser!.id) &&
        equals(m.status, ChatMessageStatus.RECEIVED)
      )
        readMessage(m);
    });
  }, [currentUser, messages, readMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return removeContact;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = () => {
    if (input === "") return;
    const message = {
      senderId: currentUser!.id,
      content: input,
    };
    const isSent = sendMessage(message);
    if (isSent) {
      console.log("sent");
      setInput("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 40,
        marginTop: 100,
      }}
    >
      <div>
        <UserChatSearch />
      </div>
      {activeContactId && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              width: "100%",
              height: "75vh",
              overflowY: "scroll",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf:
                    message.senderId === currentUser!.id
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <MessageBox message={message} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ position: "absolute", bottom: 20, width: "70vw" }}>
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  // console.log(e);
                  e.key === "Enter" && send();
                }}
              />
              <Button
                onClick={() => {
                  send();
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MessageBoxProps {
  message: ChatMessage;
}

const MessageBox = ({ message }: MessageBoxProps) => {
  return (
    <div
      style={{
        maxWidth: "200px",
        padding: "7px",
        border: "1px solid aliceblue",
        backgroundColor: "aliceblue",
        borderRadius: 10,
        color: "dimgrey",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            // width: " 100%",
            overflowX: "hidden",
          }}
        >
          {message.content}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
            }}
          >
            {formatDistanceToNow(new Date())}
          </span>
          <div>{getStatus(message.status)}</div>
        </div>
      </div>
    </div>
  );
};

const getStatus = (status: ChatMessageStatus) => {
  switch (status) {
    case ChatMessageStatus.RECEIVED:
      return <DoneRounded style={{ fontSize: 15 }} />;
    case ChatMessageStatus.READ:
      return <DoneAllRounded style={{ fontSize: 15 }} />;
  }
};
