var express = require("express");
var router = express.Router();
var Salesitem = require("../models/salesitem.js");
var Collections = require("../models/collection.js");
const { PrismaClient } = require("@prisma/client");
var fs = require("fs");
const prisma = new PrismaClient();
var loginStatus = false;
var settings = null;
const MongoClient = require("mongodb").MongoClient;
var db = null; //cloud db connection declaration
// Connection cloud databse URL
const url = process.env.MONGO_CLOUD_URL;
// cloud Database Name
const dbName = process.env.MONGO_CLOUD_DATABSE;
var stepOne = false;
var connectionSuccess = false;

connect = () => {
  MongoClient.connect(url, (err, client) => {
    //for cloud connection
    try {
      if (err) {
        console.log(
          "Can't connect to database. Check your connection and Please refresh this page, " +
            "you can't login without internet or not connected with database"
        );
        connectionSuccess = false;
      } else {
        connectionSuccess = true;
        console.log("Database Connection established");
        db = client.db(dbName);
      }
    } catch (error) {
      console.log("eroor");
    }
  });
};
token = (req, res, next) => {
  let user = req.body.username;
  let pass = req.body.password;
  if (
    user == process.env.ADMIN_USERNAME &&
    pass == process.env.ADMIN_PASSWORD
  ) {
    loginStatus = true;
    next();
  } else {
    loginStatus = false;
    console.log("Incorrect Password, Authentication failed");
    res.redirect("/admin");
  }
};
tokenVerify = async (req, res, next) => {
  if (loginStatus && connectionSuccess) {
    await fs.readFile(".env", (err, data) => {
      settings = data.toString("utf8");
    });
    next();
  } else {
    res.redirect("/admin");
  }
};
nocache = (req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

router.get("/", nocache, (req, res) => {
  connect();
  res.render("login");
});

router.post("/admin-login", token, nocache, (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", tokenVerify, nocache, (req, res) => {
  res.render("dashboard", { settings });
});

router.post("/test", (req, res) => {
  res.redirect("/admin/hi");
});
router.get("/hi", (req, res) => {
  console.log("hi");
});

router.get("/logout", (req, res) => {
  loginStatus = false;
  res.redirect("/admin");
});

router.get("/delete-local-mongodb", tokenVerify, nocache, async (req, res) => {
  await Salesitem.deleteMany()
    .then(async () => {
      await Collections.deleteMany();
      res.redirect("/admin/dashboard");
      console.log("Step 1 is Completed");
      stepOne = true;
    })
    .catch(async (err) => {
      console.log("An Error found or Query already executed,Please run step 2");
      stepOne = true;
      // res.redirect("/admin/dashboard");
    });
});

router.get("/delete-cloud-mongodb", tokenVerify, nocache, async (req, res) => {
  if (stepOne) {
    await db
      .collection(process.env.MONGO_CLOUD_COLLECTION_SALES)
      .deleteMany()
      .then(async () => {
        await db
          .collection(process.env.MONGO_CLOUD_COLLECTION_COLLECTION)
          .deleteMany()
          .catch((err) => {
            console.log("Check your connection and try again");
          });
        res.redirect("/admin/dashboard");
        console.log("Step 2 is Completed");
      })
      .catch((err) => {
        console.log("1. Check your connection 2.Query already executed ");
        // res.redirect("/admin/dashboard");
      });
  } else {
    res.redirect("/admin/dashboard");
    console.log("Please run step 1");
    res.end();
  }
});

router.get("/copy-local-mysql", tokenVerify, nocache, async (req, res) => {
  await prisma.salesitem
    .findMany({})
    .then(async (result, err) => {
      await Salesitem.insertMany(result);
      await Salesitem.updateMany(
        {},
        { $set: { isEdited: false, isUploaded: false, isDeleted: false } }
      );
      console.log(
        "Sales Items Copied successfully from mysql to Local Mongo DB"
      );
    })
    .catch((err) => {
      console.log(
        "An error occured. Please run step 1 and 2. Error is " + err.message
      );
    });
  await prisma.collection
    .findMany({})
    .then(async (result, err) => {
      await Collections.insertMany(result);
      await Collections.updateMany(
        {},
        { $set: { isEdited: false, isUploaded: false, isDeleted: false } }
      );
      console.log(
        "Collection Item's Copied successfully from mysql to Local Mongo DB"
      );
      res.redirect("/admin/dashboard");
      res.end();
    })
    .catch((err) => {
      console.log(
        "An error occured. Please run step 1 and 2. Error is " + err.message
      );
      res.redirect("/admin/dashboard");
      res.end();
    });
});

router.get("/copy-cloud-mongodb", tokenVerify, nocache, async (req, res) => {
  res.redirect("/api/backup/sales");
  loginStatus = false;
});

module.exports = router;
