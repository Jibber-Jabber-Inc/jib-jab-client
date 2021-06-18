export interface ChatMessageCreation {
  senderId: string;
  content: string;
}

export enum ChatMessageStatus {
  RECEIVED = "RECEIVED",
  READ = "READ",
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: Date;
  status: ChatMessageStatus;
}

export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type PostData = {
  id: string;
  content: string;
  creationDate: string;
  userInfoDto: User;
  isLiked: boolean;
  amountLikes: number;
};
