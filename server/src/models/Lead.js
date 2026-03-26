const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    area: {
      type: String,
      required: true
    },

    requirement: String,

    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new"
    },

    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    notes: String,
    estimatedValue: Number,
    assignedAt: Date,
    closedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);