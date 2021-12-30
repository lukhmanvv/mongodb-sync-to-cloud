var express = require("express");
var app = express();
const Handlebars = require("handlebars");
var exphbs = require("express-handlebars"); //for layout setup
var path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
var Salesitem = require("./models/salesitem.js");
var Collections = require("./models/collection.js");
var Logger = require("./models/logger.js");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const checkInternetConnected = require("check-internet-connected");
var db = null; //cloud db connection declaration

mongoose.connect(process.env.MONGO_LOCAL_URL);
// Connection cloud databse URL
const url = process.env.MONGO_CLOUD_URL;
// cloud Database Name
const dbName = process.env.MONGO_CLOUD_DATABSE;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var adminRouter = require("./routes/admin");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutDir: __dirname + "/views/",
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRouter);

//function for internet connectivity
connectivity = (req, res, next) => {
  checkInternetConnected() //when connection succeeded goto next step
    .then((result) => {
      MongoClient.connect(url, (err, client) => {
        //for cloud connection
        if (err) {
          console.log(
            "Can't connect to database. Check your connection and try again " +
              Date()
          );
        } else {
          console.log("Connecting to Cloud");
          db = client.db(dbName);
          next();
        }
      });
    })
    .catch((ex) => {
      //when connection failed
      res
        .send("Failed to connect internet at " + Date())
        .status(504)
        .end();
      console.log("No Internet"); // cannot connect to a server or error occurred.
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
          .catch(console.log("File Delted "+ isDelete[index]._id))
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
    });
};
salesItems = async () => {
  console.log("Database Connected, Working");
  // const localData = await Salesitem.find({});
  const countLocalData = await Salesitem.find({}).estimatedDocumentCount();
  const cloudData = await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
    .countDocuments();
  let isEdit = await Salesitem.find({ isEdited: true });
  let isDelete = await Salesitem.find({ isDeleted: true });
  let isUpload = await Salesitem.find({ isUploaded: false });
  if (
    isEdit.length == 0 &&
    isDelete.length == 0 &&
    isUpload.length == 0 &&
    cloudData == countLocalData
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
    } else {
      console.log("an error occured please contact support");
      console.log("Support: Both Database count are wrong. Run DB Reset Task");
    }
  }
};
//functions for collection table
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
          .catch(console.log("an error found, check data is deleted"))
      )
      .catch("Unknown Error");
  }
};
collectionUpload = async (isUpload) => {
  let localDataId = await Collections.find({ isUploaded: false });
  console.log(localDataId.length);
  const isEdited = { isEdited: false, isUploaded: true };
  await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
    .insertMany(localDataId)
    .then(async () => {
      await Collections.updateMany(isEdited);
      console.log("Document copied successfully ");
    })
    .catch((error) => {
      console.log(error.message);
      console.log("Check your connection and try again");
    });
};
collectionItems = async () => {
  console.log("Database Connected, Working");
  const countLocalData = await Collections.find({}).estimatedDocumentCount();
  const cloudData = await db
    .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
    .countDocuments();
  let isEdit = await Collections.find({ isEdited: true });
  let isDelete = await Collections.find({ isDeleted: true });
  let isUpload = await Collections.find({ isUploaded: false });
  if (
    isEdit.length == 0 &&
    isDelete.length == 0 &&
    isUpload.length == 0 &&
    cloudData == countLocalData
  ) {
    console.log("Nothing to Upload in collection items");
  } else {
    if (isDelete.length >= 1) {
      collectionItemDelete(isDelete);
    } else if (isEdit.length >= 1) {
      for (let index = 0; index < isEdit.length; index++) {
        console.log("in loop");
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
      collectionUpload(isUpload);
    } else if (isUpload.length >= 1) {
      console.log("Copying");
      collectionUpload(isUpload);
    } else {
      console.log("an error occured please contact support");
    }
  }
};

app.get("/api/backup/sales", connectivity, (req, res) => {
  res.render("backup");
  salesItems();
});

app.get("/api/backup/collection", connectivity, (req, res) => {
  res.render("backup");
  collectionItems();
});

app.listen(process.env.APP_PORT, () => {
  console.log(`App started with port ${process.env.APP_PORT}`);
});

// console.log("Running.....Please wait");

module.exports = app;
