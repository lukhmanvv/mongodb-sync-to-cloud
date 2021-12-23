var express = require("express");
var app = express();
var Salesitem = require("./models/salesitem.js");
var Collections = require("./models/collection.js");
const mongoose = require("mongoose");
var netConnectivity = require("dns");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

mongoose.connect(process.env.MONGO_LOCAL_URL);

// Connection cloud databse URL
const url = process.env.MONGO_CLOUD_URL;
// cloud Database Name
const dbName = process.env.MONGO_CLOUD_DATABSE;

connect();
async function connect() {
  netConnectivity.resolve(process.env.RESOLVED_ADDRESS, function (err) {
    if (err) {
      console.log("Failed to connect internet at " + Date());
      setTimeout(function () {
        connect();
      }, 20000);
    } else {
      MongoClient.connect(url, function (err, client) {
        if (err) {
          setTimeout(function () {
            console.log(
              "Can't connect to database. Check your connection and try again " +
                Date()
            );
            connect();
          }, process.env.SET_TIMEOUT);
        } else {
          const db = client.db(dbName);
          mirrorDb(db);
        }
      });
      mirrorDb = async (db) => {
        const localData = await Salesitem.find({});
        const countLocalData = await Salesitem.find(
          {}
        ).estimatedDocumentCount();
        const cloudData = await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
          .find()
          .toArray();
        let isEdit = await Salesitem.find({ isEdited: true });
        let isDelete = await Salesitem.find({ isDeleted: true });
        if (
          isEdit.length == 0 &&
          isDelete.length == 0 &&
          cloudData.length == countLocalData
        ) {
        } else {
          if (isDelete.length >= 1) {
            await db
              .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
              .findOneAndDelete(
                { _id: isDelete[0]._id },
                async function (err, docs) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(
                      "This documents has been deleted from local and cloud Databbase : ",
                      docs
                    );
                    await Salesitem.findOneAndDelete({ _id: isDelete[0]._id });
                    connect();
                  }
                }
              );
          } else {
            console.log("Copying");
            for (let index = 0; index < countLocalData; index++) {
              let localDataId = await Salesitem.findOne({
                _id: localData[index]._id,
              });
              let isMatched = await db
                .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
                .findOne({ _id: localData[index]._id });
              if (isMatched) {
                let localData = await Salesitem.findOne({ _id: isMatched._id });
                if (localData) {
                  if (localData.isEdited == true) {
                    console.log("Found edited document " + localData._id);
                    await db
                      .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
                      .deleteOne({ _id: isMatched._id });
                  }
                }
              } else {
                console.log(
                  "Document copied successfully " + localData[index]._id
                );
                const filter = { _id: localData[index]._id };
                const isEdited = { isEdited: 0 };
                await Salesitem.findOneAndUpdate(filter, isEdited);
                await db
                  .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
                  .insertOne(localData[index]);
              }
            }
            console.log("Sales Sync successfully");
          }
        }
        secondProgram(db);
        setTimeout(function () {
          connect();
        }, 30000);
      };
      secondProgram = async (db) => {
        const localData = await Collections.find({});
        const countLocalData = await Collections.find(
          {}
        ).estimatedDocumentCount();
        const cloudData = await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
          .find()
          .toArray();
        let isEdit = await Collections.find({ isEdited: true });
        let isDelete = await Collections.find({ isDeleted: true });
        if (
          isEdit.length == 0 &&
          isDelete == 0 &&
          cloudData.length == countLocalData
        ) {
        } else {
          if (isDelete.length >= 1) {
            await db
              .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
              .findOneAndDelete(
                { _id: isDelete[0]._id },
                async function (err, docs) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(
                      "This documents has been deleted from local and cloud Databbase : ",
                      docs
                    );
                    await Collections.findOneAndDelete({
                      _id: isDelete[0]._id,
                    });
                    connect();
                  }
                }
              );
          } else {
            console.log("Copying");
            for (let index = 0; index < countLocalData; index++) {
              let localDataId = await Collections.findOne({
                _id: localData[index]._id,
              });
              let isMatched = await db
                .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
                .findOne({ _id: localData[index]._id });
              if (isMatched) {
                let localData = await Collections.findOne({
                  _id: isMatched._id,
                });
                if (localData) {
                  if (localData.isEdited == true) {
                    console.log("Found edited document " + localData._id);
                    await db
                      .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
                      .deleteOne({ _id: isMatched._id });
                  }
                }
              } else {
                console.log(
                  "Document copied successfully " + localData[index]._id
                );
                const filter = { _id: localData[index]._id };
                const isEdited = { isEdited: 0 };
                await Collections.findOneAndUpdate(filter, isEdited);
                await db
                  .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
                  .insertOne(localData[index]);
              }
            }
            console.log("Collections Sync successfully");
          }
        }
      };
    }
  });
}

// for web api
// app.listen(process.env.APP_PORT, () => {
//   console.log(`App started with port ${process.env.APP_PORT}`);
// });

console.log("Running.....Please wait");

module.exports = app;
