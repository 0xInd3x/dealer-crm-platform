const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", required: true
    },

    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer", required: true
    },

    amount: {
      type: Number,
      required: true
    },

    method: {
      type: String,
      default: "online"
    },

    reference: String,

    paidOn: {
      type: Date,
      default: Date.now
    },
    
    note: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);