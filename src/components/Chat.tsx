import { ChatMessage, ChatMessageStatus, useChatStore } from "../store/session";
import { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useLoggedUser } from "../api/auth";
import { UserChatSearch } from "./UserChatSearch";
import { formatDistanceToNow } from "date-fns";
import { DoneAllRounded, DoneRounded } from "@material-ui/icons";

export const Chat = () => {
  const { data: currentUser } = useLoggedUser();

  const {
    messages = [],
    sendMessage,
    activeContactId,
  } = useChatStore((state) => ({
    messages: state.activeContactId
      ? state.messagesByUserId[state.activeContactId]
      : [],
    sendMessage: state.sendMessage,
    activeContactId: state.activeContactId,
  }));
  const [input, setInput] = useState("");

  const send = () => {
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
        marginTop: 90,
      }}
    >
      <div>
        <UserChatSearch />
      </div>
      {activeContactId && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              width: 300,
              height: "75vh",
              overflowY: "scroll",
            }}
          >
            {messages.map((message) => (
              <div
                key={`${message.senderId}-${message.recipientId}-${message.timestamp}`}
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
          </div>
          <div style={{ position: "absolute", bottom: 40, width: 300 }}>
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
                  console.log(e);
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
            maxWidth: 280,
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
