var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_LOCAL_URL);
require("dotenv").config();
const Collectionschema = mongoose.Schema(
  {
    BillNo: {
      type: String,
      require: true,
    },
    isEdited: {
      type: Boolean,
      require: true,
    },
    isDeleted: {
      type: Boolean,
      require: true,
    },
    isUploaded: {
      type: Boolean,
      require: true,
    },
    TransactionType: {
      type: String,
      require: true,
    },
    SiNo: {
      type: String,
      require: true,
    },
    Date1: {
      type: Boolean,
      require: true,
    },
    PartyName: {
      type: String,
      require: true,
    },
    NetTotal: {
      type: String,
      require: true,
    },
    ChequeNo: {
      type: String,
      require: true,
    },
    Employee: {
      type: String,
      require: true,
    },
    Typ: {
      type: String,
      require: true,
    },
    BillForm: {
      type: String,
      require: true,
    },
    Stat: {
      type: String,
      require: true,
    },
    CashFlow: {
      type: String,
      require: true,
    },
    godown: {
      type: String,
      require: true,
    },
    local_app_user_entry_id: {
      type: String,
      require: true,
    },
    image_data: {
      type: String,
      require: true,
    },
    bill_time: {
      type: String,
      require: true,
    },
    Reminder: {
      type: String,
      require: true,
    },
    RetNo: {
      type: String,
      require: true,
    },
    uniqueId: {
      type: String,
      require: true,
      unique: true,
    },
    TaxP: {
      type: String,
      require: true,
    },
    TaxAmt: {
      type: String,
      require: true,
    },
    Code1: {
      type: String,
      require: true,
    },
  },
  { versionKey: process.env.MONGOOSE_SALES_CURRENT_VER }
);

const Collections = mongoose.model(
  process.env.MONGO_LOCAL_COLLECTION_COLLECTION,
  Collectionschema
);

module.exports = Collections;
