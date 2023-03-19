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

// POST a new comment to a video
router.post("/:id/comments", (req, res) => {
  const videoId = req.params.id;
  const video = videoDetails.find((v) => v.id === videoId);

  if (!video) {
    res.status(404).send("Video not found");
  } else {
    const commentObj = req.body;
    const newComment = {
      id: uuid(),
      name: commentObj.name,
      comment: commentObj.comment,
      likes: 0,
      timestamp: new Date(),
    };
    video.comments.push(newComment);

    fs.writeFileSync(FILE_PATH, JSON.stringify(videoDetails));

    res.status(201).json(newComment);
  }
});

// DELETE a comment from a video
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
  const video = videoDetails.find((v) => v.id === videoId);

  if (!video) {
    res.status(404).send("Video not found");
  } else {
    const commentIndex = video.comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) {
      res.status(404).send("Comment not found");
    } else {
      video.comments.splice(commentIndex, 1);

      fs.writeFileSync(FILE_PATH, JSON.stringify(videoDetails));

      res.sendStatus(204);
    }
  }
});

module.exports = router;
