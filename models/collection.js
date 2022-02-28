var mongoose = require("mongoose");
mongoose.pluralize(null);
mongoose.connect(process.env.MONGO_LOCAL_URL);
const Collectionschema = mongoose.Schema(
  {
    BillNo: {
      type: Number,
      require: false,
    },

    TransactionType: {
      type: String,
      require: false,
    },
    SiNo: {
      type: Number,
      require: false,
    },
    Date1: {
      type: Date,
      require: false,
    },
    timestamp: {
      type: String,
      require: false,
    },
    Id_User: {
      type: Number,
      require: false,
    },
    StoreName: {
      type: String,
      require: false,
    },

    PartyName: {
      type: String,
      require: false,
    },
    NetTotal: {
      type: Number,
      require: false,
    },
    ChequeNo: {
      type: String,
      require: false,
    },
    Employee: {
      type: String,
      require: false,
    },
    Typ: {
      type: String,
      require: false,
    },
    BillForm: {
      type: String,
      require: false,
    },
    Stat: {
      type: Number,
      require: false,
    },
    CashFlow: {
      type: String,
      require: false,
    },
    godown: {
      type: String,
      require: false,
    },
    local_app_user_entry_id: {
      type: String,
      require: false,
    },
    image_data: {
      type: String,
      require: false,
    },
    bill_time: {
      type: String,
      require: false,
    },
    Reminder: {
      type: String,
      require: false,
    },
    RetNo: {
      type: String,
      require: false,
    },
    uniqueId: {
      type: Number,
      require: false,
      unique: true,
    },
    TaxP: {
      type: Number,
      require: false,
    },
    TaxAmt: {
      type: Number,
      require: false,
    },
    Code1: {
      type: Number,
      require: false,
    },
    Amount: {
      type: Number,
      require: false,
    },
    Narration: {
      type: String,
      require: false,
    },
    isEdited: {
      type: Boolean,
      require: false,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      require: false,
      default: false,
    },
    isUploaded: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  { versionKey: process.env.MONGOOSE_SALES_CURRENT_VER }
);

const Collections = mongoose.model(
  process.env.MONGO_LOCAL_COLLECTION_COLLECTION,
  Collectionschema
);

module.exports = Collections;
