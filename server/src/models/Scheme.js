const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["lead", "sales"],
      default: "lead"
    },

    description: String,
    criteria: String,
    reward: String,

    active: {
      type: Boolean,
      default: true
    },
    
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", schemeSchema);