const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("Req Received");
  res.send("Hello");
});

app.listen(8050, () => {
  console.log("server has started");
});
