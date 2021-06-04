export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type PostData = {
  id: number;
  content: string;
  creationDate: Date;
};
