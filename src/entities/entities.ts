export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type PostData = {
  id: string;
  content: string;
  creationDate: string;
  userInfoDto: User;
  isLiked: boolean;
  amountLikes: number;
};
