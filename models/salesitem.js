var mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();
const SalesItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
    },
    isEdited: {
      type: Boolean,
      require: false,
    },
    ItemNo: {
      type: String,
      require: false,
      unique: true,
    },
    ItemNameTextField: {
      type: String,
      require: false,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      require: false,
    },
    isUploaded: {
      type: Boolean,
      require: false,
    },
    ItemC: {
      type: String,
      require: false,
    },
    StockInMain: {
      type: String,
      require: false,
    },
    StockInGoDown: {
      type: String,
      require: false,
    },
    Cost: {
      type: Number,
      require: false,
    },
    Rate1: {
      type: String,
      require: false,
    },
    Rate2: {
      type: String,
      require: false,
    },
    Rate3: {
      type: String,
      require: false,
    },
    Disc: {
      type: String,
      require: false,
    },
    Tax1: {
      type: String,
      require: false,
    },
    DiscP: {
      type: String,
      require: false,
    },
    Color: {
      type: String,
      require: false,
    },
    Size: {
      type: String,
      require: false,
    },
    MfgDate: {
      type: String,
      require: false,
    },
    CostRs: {
      type: String,
      require: false,
    },
    Typ: {
      type: String,
      require: false,
    },
    Stat: {
      type: String,
      require: false,
    },
    Pack: {
      type: String,
      require: false,
    },
    prod_typ: {
      type: String,
      require: false,
    },
    photo: {
      type: String,
      require: false,
    },
    RatePerInch: {
      type: String,
      require: false,
    },
    photo1: {
      type: String,
      require: false,
    },
    curr_stock: {
      type: Number,
      require: false,
    },
    SecUnit: {
      type: String,
      require: false,
    },
    SecCostRate: {
      type: String,
      require: false,
    },
    SecRetailRate: {
      type: String,
      require: false,
    },
    SecWholesaleRate: {
      type: String,
      require: false,
    },
    ThirdUnit: {
      type: String,
      require: false,
    },
    ThirdCost: {
      type: String,
      require: false,
    },
    ThirdRate1: {
      type: String,
      require: false,
    },
    ThirdRate2: {
      type: String,
      require: false,
    },
    ThirdPack: {
      type: String,
      require: false,
    },
    SecBarcode: {
      type: String,
      require: false,
    },
    ThirdBarcode: {
      type: String,
      require: false,
    },
    SecRate2: {
      type: String,
      require: false,
    },
    NewItemCode: {
      type: String,
      require: false,
    },
    Company: {
      type: String,
      require: false,
    },
    ArabicName: {
      type: String,
      require: false,
    },
    local_app_user_entry_id: {
      type: String,
      require: false,
    },
    EmpCode: {
      type: String,
      require: false,
    },
    subCategory: {
      type: String,
      require: false,
    },
    carmaker: {
      type: String,
      require: false,
    },
    model: {
      type: String,
      require: false,
    },
    year1: {
      type: String,
      require: false,
    },
    varient: {
      type: String,
      require: false,
    },
    varient_compactible: {
      type: String,
      require: false,
    },
  },
  { versionKey: process.env.MONGOOSE_SALES_CURRENT_VER }
);

const Salesitem = mongoose.model(
  process.env.MONGO_LOCAL_COLLECTION_SALES,
  SalesItemSchema
);

module.exports = Salesitem;
