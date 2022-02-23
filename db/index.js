const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const SeedPost = require("../seed/postSeed");

let gfs;

function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);
      console.log("Mockgoose connection");
      mockgoose.prepareStorage().then(() => {
        mongoose
          .connect(process.env.DB_URL, {
            useNewUrlParser: true,
          })
          .then((res, err) => {
            if (err) return reject(err);
            console.log("Connection Done ...");
            SeedPost().then(() => resolve());
          });
      });
    } else {
      mongoose
        .connect(process.env.DB_URL, {
          useNewUrlParser: true,
        })
        .then((res, err) => {
          if (err) return reject(err);
          gridfsBucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
              bucketName: "uploads",
            }
          );
          console.log("Connection : " + mongoose.connection.db);
          gfs = Grid(mongoose.connection.db, mongoose.mongo);
          gfs.collection("uploads");
          console.log("Grid FS created");
          resolve();
        });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + file.detectedFileExtension;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer();

module.exports = { connect, close, gfs, storage, upload };
