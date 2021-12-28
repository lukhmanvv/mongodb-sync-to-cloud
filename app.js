var express = require("express");
var app = express();
var Salesitem = require("./models/salesitem.js");
var Collections = require("./models/collection.js");
const mongoose = require("mongoose");
var netConnectivity = require("dns");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
// var jwt = require("jsonwebtoken");
var db = null;
mongoose.connect(process.env.MONGO_LOCAL_URL);
// Connection cloud databse URL
const url = process.env.MONGO_CLOUD_URL;
// cloud Database Name
const dbName = process.env.MONGO_CLOUD_DATABSE;
//function for internet connectivity
connectivity = (req, res, next) => {
  netConnectivity.resolve(process.env.RESOLVED_ADDRESS, (err) => {
    if (err) {
      res
        .send("Failed to connect internet at " + Date())
        .status(504)
        .end();
    } else {
      MongoClient.connect(url, (err, client) => {
        if (err) {
          console.log(
            "Can't connect to database. Check your connection and try again " +
              Date()
          );
          res
            .send("Failed to connect internet at " + Date())
            .status(504)
            .end();
        } else {
          console.log("Connecting to Cloud");
          db = client.db(dbName);
          next();
        }
      });
    }
  });
};
//functions for sales table
salesItemDelete = async (isDelete) => {
  // isDelete.length--;
  for (let index = 0; index < isDelete.length; index++) {
    await Salesitem.findOneAndDelete({ _id: isDelete[index]._id })
      .then(
        await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
          .findOneAndDelete({
            _id: isDelete[index]._id,
          })
          .catch(console.log("May be file not found or network error"))
      )
      .catch("Unknown Error");
  }
};
salesUpload = async (isUpload) => {
  let localDataId = await Salesitem.find({ isUploaded: false });
  console.log(localDataId.length);
  const isEdited = { isEdited: false, isUploaded: true };
  await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
    .insertMany(localDataId)
    .then(async () => {
      await Salesitem.updateMany(isEdited);
      console.log("Document copied successfully ");
    })
    .catch((error) => {
      console.log(error.message);
      console.log("Check your connection and try again");
      index = countLocalData + 1;
    });
};
salesItems = async () => {
  console.log("Database Connected, Working");
  const localData = await Salesitem.find({});
  const countLocalData = await Salesitem.find({}).estimatedDocumentCount();
  const cloudData = await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
    .find()
    .toArray();
  let isEdit = await Salesitem.find({ isEdited: true });
  let isDelete = await Salesitem.find({ isDeleted: true });
  let isUpload = await Salesitem.find({ isUploaded: false });
  if (
    isEdit.length == 0 &&
    isDelete.length == 0 &&
    isUpload.length == 0 &&
    cloudData.length == countLocalData
  ) {
    console.log("Nothing to Upload in sales items");
  } else {
    if (isDelete.length >= 1) {
      salesItemDelete(isDelete);
    } else if (isEdit.length >= 1) {
      for (let index = 0; index < isEdit.length; index++) {
        console.log("in loop");
        const isEdited = { isUploaded: false };
        await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
          .deleteOne({ _id: isEdit[index]._id })
          .finally(
            await Salesitem.findOneAndUpdate(
              { _id: isEdit[index]._id },
              isEdited
            )
          );
      }
      salesUpload(isUpload);
    } else if (isUpload.length >= 1) {
      console.log("Copying");
      salesUpload(isUpload);
      console.log("Sales Sync successfully");
    }
  }
};
//functions for collection table
collectionItems = async () => {
  console.log("Database Connected, Working");
  const localData = await Collections.find({});
  const countLocalData = await Collections.find({}).estimatedDocumentCount();
  const cloudData = await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
    .find()
    .toArray();
  let isEdit = await Collections.find({ isEdited: true });
  let isDelete = await Collections.find({ isDeleted: true });
  let isUpload = await Collections.find({ isUploaded: false });
  if (
    isEdit.length == 0 &&
    isDelete.length == 0 &&
    isUpload.length == 0 &&
    cloudData.length == countLocalData
  ) {
    console.log("Nothing to Upload in Collections");
  } else {
    if (isDelete.length >= 1) {
      salesItemDelete(isDelete);
    } else if (isEdit.length >= 1) {
      for (let index = 0; index < isEdit.length; index++) {
        const isEdited = { isUploaded: false };
        await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
          .deleteOne({ _id: isEdit[index]._id })
          .finally(
            await Collections.findOneAndUpdate(
              { _id: isEdit[index]._id },
              isEdited
            )
          );
      }
      salesUpload(isUpload);
    } else if (isUpload.length >= 1) {
      console.log("Copying");
      salesUpload(isUpload);
      console.log("Collection Sync successfully");
    }
  }
};
collectionItemDelete = async (isDelete) => {
  // isDelete.length--;
  for (let index = 0; index < isDelete.length; index++) {
    await Collections.findOneAndDelete({ _id: isDelete[index]._id })
      .then(
        await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
          .findOneAndDelete({
            _id: isDelete[index]._id,
          })
      )
      .catch(console.log("May be file not found or network error"));
  }
};
collectionUpload = async (isUpload) => {
  let localDataId = await Collections.find({ isUploaded: false });
  console.log(localDataId.length);
  const isEdited = { isEdited: 0, isUploaded: true };
  await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
    .insertMany(localDataId)
    .then(async () => {
      await Collections.updateMany(isEdited);
      console.log("Document's copied successfully");
    })
    .catch((error) => {
      console.log(error.message);
      console.log("Check your connection and try again");
      index = countLocalData + 1;
    });
};
app.get("/api/backup/sales", connectivity, (req, res) => {
  salesItems();
  res.send("Sales Backup Started").status(200).end();
});

app.get("/api/backup/collection", connectivity, (req, res) => {
  collectionItems();
  res.send("Collection Backup Started").status(200).end();
});

app.listen(process.env.APP_PORT, () => {
  console.log(`App started with port ${process.env.APP_PORT}`);
});

// console.log("Running.....Please wait");

module.exports = app;
