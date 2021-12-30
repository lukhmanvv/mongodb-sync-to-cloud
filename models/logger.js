var mongoose = require("mongoose");
require("dotenv").config();
const LoggerSchema = mongoose.Schema(
  {
    Operation: {
      type: String,
      require: true,
    },
    Status: {
      type: String,
      require: true,
    },
    DateTime: {
      type: String,
      require: true,
    },
  },
  { versionKey: process.env.MONGOOSE_SALES_CURRENT_VER }
);

const Logger = mongoose.model(
  process.env.MONGO_LOCAL_COLLECTION_LOGGER,
  LoggerSchema
);

module.exports = Logger;
