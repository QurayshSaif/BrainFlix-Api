require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videosRoutes = require("./routes/videos.js");

//environment variables
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Allow requests from client url
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/videos", videosRoutes);

app.listen(PORT, () => {
  console.log("server has started");
});
