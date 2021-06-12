export const urls = {
  signUp: "/signup",
  logIn: "/login",
  editProfile: "/editProfile",
  viewProfile: "/profile",
  home: "/",
  notFound: "/notfound",
  user: {
    path: `/user/:id`,
    byId: (id: string) => `/user/${id}`,
  },
  searchUsers: "/searchUser",
  chat: {
    path: "/chat/:userId",
    byId: (id: string) => `/chat/${id}`,
  },
};

export const errorMessages = {
  required: "This field is required",
  field: "The email is not valid",
};
