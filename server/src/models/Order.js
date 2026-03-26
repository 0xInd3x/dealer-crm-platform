const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: String,
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer", required: true
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead"
    },

    items: [itemSchema],
    total: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    incentiveEarned: {
      type: Number,
      default: 0
    },
    
    status: {
      type: String,
      enum: ["draft", "confirmed", "shipped", "delivered", "cancelled"],
      default: "confirmed"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expectedDelivery: Date
  },
  { timestamps: true }
);

orderSchema.virtual("outstanding").get(function () {
  return Math.max(this.total - this.paidAmount, 0);
});

module.exports = mongoose.model("Order", orderSchema);