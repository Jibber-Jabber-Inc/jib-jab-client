export interface User {
  id: string;
  email: string;
}

export type PostData = {
  id: number;
  content: string;
  creationDate: Date;
};
