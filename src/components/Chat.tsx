import { useParams } from "react-router-dom";
import { ChatMessage, useChatStore } from "../store/session";
import { useState } from "react";
import { Button } from "@material-ui/core";
import { useLoggedUser } from "../api/auth";
import { useUserInfoById } from "../api/users";

export const Chat = () => {
  const { userId: contactId } = useParams<{ userId: string }>();
  const { data: currentUser } = useLoggedUser();
  const { data: contact, isLoading: isContactLoading } =
    useUserInfoById(contactId);
  const { messages = [], sendMessage } = useChatStore((state) => ({
    messages: state.messagesByUserId[contactId],
    sendMessage: state.sendMessage,
  }));
  const [input, setInput] = useState("");

  if (isContactLoading) return <h4>loading...</h4>;
  if (!contact) return <h4>error</h4>;

  const send = () => {
    const message = {
      senderId: currentUser!.id,
      recipientId: contact.id,
      senderName: currentUser!.username,
      recipientName: contact.username,
      content: input,
      timestamp: new Date(),
    };
    const isSent = sendMessage(message);
    if (isSent) {
      console.log("sent");
      setInput("");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
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
      <div>
        <input
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
  );
};

interface MessageBoxProps {
  message: ChatMessage;
}

const MessageBox = ({ message }: MessageBoxProps) => {
  return (
    <div>
      <span>{message.content}</span>
    </div>
  );
};
