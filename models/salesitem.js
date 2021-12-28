var mongoose = require("mongoose");
require("dotenv").config();
const SalesItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    isEdited: {
      type: Boolean,
      require: true,
    },
    ItemNo: {
      type: String,
      require: true,
      unique: true,
    },
    ItemNameTextField: {
      type: String,
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
    ItemC: {
      type: String,
      require: true,
    },
    StockInMain: {
      type: String,
      require: true,
    },
    StockInGoDown: {
      type: String,
      require: true,
    },
    Cost: {
      type: String,
      require: true,
    },
    Rate1: {
      type: String,
      require: true,
    },
    Rate2: {
      type: String,
      require: true,
    },
    Rate3: {
      type: String,
      require: true,
    },
    Disc: {
      type: String,
      require: true,
    },
    Tax1: {
      type: String,
      require: true,
    },
    DiscP: {
      type: String,
      require: true,
    },
    Color: {
      type: String,
      require: true,
    },
    Size: {
      type: String,
      require: true,
    },
    MfgDate: {
      type: String,
      require: true,
    },
    CostRs: {
      type: String,
      require: true,
    },
    Typ: {
      type: String,
      require: true,
    },
    Stat: {
      type: String,
      require: true,
    },
    Pack: {
      type: String,
      require: true,
    },
    prod_typ: {
      type: String,
      require: true,
    },
    photo: {
      type: String,
      require: true,
    },
    RatePerInch: {
      type: String,
      require: true,
    },
    photo1: {
      type: String,
      require: true,
    },
    curr_stock: {
      type: String,
      require: true,
    },
    SecUnit: {
      type: String,
      require: true,
    },
    SecCostRate: {
      type: String,
      require: true,
    },
    SecRetailRate: {
      type: String,
      require: true,
    },
    SecWholesaleRate: {
      type: String,
      require: true,
    },
    ThirdUnit: {
      type: String,
      require: true,
    },
    ThirdCost: {
      type: String,
      require: true,
    },
    ThirdRate1: {
      type: String,
      require: true,
    },
    ThirdRate2: {
      type: String,
      require: true,
    },
    ThirdPack: {
      type: String,
      require: true,
    },
    SecBarcode: {
      type: String,
      require: true,
    },
    ThirdBarcode: {
      type: String,
      require: true,
    },
    SecRate2: {
      type: String,
      require: true,
    },
    NewItemCode: {
      type: String,
      require: true,
    },
    Company: {
      type: String,
      require: true,
    },
    ArabicName: {
      type: String,
      require: true,
    },
    local_app_user_entry_id: {
      type: String,
      require: true,
    },
    EmpCode: {
      type: String,
      require: true,
    },
    subCategory: {
      type: String,
      require: true,
    },
    carmaker: {
      type: String,
      require: true,
    },
    model: {
      type: String,
      require: true,
    },
    year1: {
      type: String,
      require: true,
    },
    varient: {
      type: String,
      require: true,
    },
    varient_compactible: {
      type: String,
      require: true,
    },
  },
  { versionKey: process.env.MONGOOSE_SALES_CURRENT_VER }
);

const Salesitem = mongoose.model(
  process.env.MONGO_LOCAL_COLLECTION_SALES,
  SalesItemSchema
);

module.exports = Salesitem;
