const app = require("express")();

app
  .use("/ping", (req, res) => {
    console.log("pong");
    res.send("pong");
  })
  .listen(9100, () => {
    console.log(`🌏 Server started on http://localhost:9100 🙃`);
  });
