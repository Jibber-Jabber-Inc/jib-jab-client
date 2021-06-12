const proxy = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    proxy("/api/post", {
      target: "http://localhost:8081",
    })
  );

  app.use(
    proxy("/api/user", {
      target: "http://localhost:8080",
    })
  );

  app.use(
    proxy("/api/message", {
      target: "http://localhost:8082",
    })
  );

  // app.use(
  //   proxy("/ws", {
  //     target: "http://localhost:8082",
  //   })
  // );
};
