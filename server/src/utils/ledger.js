const Payment = require("../models/Payment");
const Order = require("../models/Order");

async function refreshOrderPayments(orderId) {
  const payments = await Payment.aggregate([
    { $match: { order: orderId } },
    { $group: { _id: "$order", total: { $sum: "$amount" } } }
  ]);
  const paid = payments[0]?.total || 0;
  await Order.findByIdAndUpdate(orderId, { paidAmount: paid });
  return paid;
}

module.exports = { refreshOrderPayments };