const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");

const FILE_PATH = "./data/video-details.json";

const videoDetails = JSON.parse(fs.readFileSync(FILE_PATH));

const videoList = videoDetails.map((video) => {
  return {
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  };
});

// GET videos
router.get("/", (_req, res) => {
  res.send(videoList);
});

// POST videos
router.post("/", (req, res) => {
  const videoObj = req.body;
  const newVideo = {
    id: uuid(),
    title: videoObj.title,
    channel: "You",
    image: "http://localhost:8080/images/Upload-video-preview.jpg",
    description: videoObj.description,
    views: "1",
    likes: "0",
    duration: "4:01",
    timestamp: new Date(),
    comments: [
      {
        id: uuid(),
        name: "Dylan Walter",
        comment: "Awesome Video",
        likes: 0,
        timestamp: new Date(),
      },
      {
        id: uuid(),
        name: "Taylor Jade",
        comment: "Great Watch!",
        likes: 0,
        timestamp: new Date(),
      },
    ],
  };
  videoDetails.push(newVideo);

  fs.writeFileSync(FILE_PATH, JSON.stringify(videoDetails));

  res.status(201).json(newVideo);
});

router.get("/:id", (req, res) => {
  const vid = videoDetails.find((video, i) => {
    return video.id === req.params.id;
  });
  if (!vid) {
    res.status(404).send("video not found");
  } else {
    res.send(vid);
  }
});

module.exports = router;
