const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    code: {
      type: String,
      unique: true,
      required: true
    },

    area: {
      type: String,
      required: true
    },

    contactName: String,
    phone: String,
    email: String,
    address: String,

    assignedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    active: {
      type: Boolean,
      default: true
    },

    incentive: {
      leadRate: {
        type: Number,
        default: 0
      },
      
      salesRate: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dealer", dealerSchema);