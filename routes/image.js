const express = require("express");
const router = express.Router();
const getStream = require("get-stream");
const mongoose = require("mongoose");
const multer = require("multer");
const { storage, gfs } = require("../db/index");
const sharp = require("sharp");
const { Readable } = require("stream");
const Grid = require("gridfs-stream");

router.post("/resize", multer().single("image"), async (req, res) => {
  const file = req.file;
  // const { id } = file;
  console.log("Inside post /image/resize");
  // console.log("file:", req.file);
  // console.log("File Length:", req.file.buffer.length); // ok
  // const buffer = await getStream(req.file.stream);
  const buffer = await getStream.buffer(req.file.stream);

  // chain sharp methods

  sharp(buffer)
    .resize(200, 100)
    .jpeg({ quality: 50 })
    .toBuffer((err, data, info) => {
      // data here directly contains the buffer object.
      const fileStream = Readable.from(data);

      // write the resized stream to the database.
      storage.fromStream(fileStream, req, file).then(() => {
        res.json({ state: "ok" });
      });
    });
});

// @route GET /files
// @desc  Display all files in JSON
router.get("/files", (req, res) => {
  console.log("GET /files ");
  const gfs_local = Grid(mongoose.connection.db, mongoose.mongo);
  gfs_local.collection("uploads");
  gfs_local.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    console.log("Detected contentType : " + String(file.detectedFileExtension));
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
      // readstream.on("data", chunk => {
      //   res.render("newHandlebarFile", { image: chunk.toString("base64") });
      // });
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

module.exports = router;
