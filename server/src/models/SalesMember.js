const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    phone: {
      type: String
    },

    areas: [{
      type: String
    }],

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesMember", salesSchema);