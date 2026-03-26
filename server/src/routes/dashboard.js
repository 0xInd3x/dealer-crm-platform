const router = require("express").Router();
const Lead = require("../models/Lead");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Dealer = require("../models/Dealer");
const authenticate = require("../middleware/auth");

router.use(authenticate);

function scopeByRole(user, dealerOverride) {
  if (dealerOverride) return { dealer: dealerOverride };
  if (user.role === "dealer") return { dealer: user.dealer };
  if (user.role === "sales") return { createdBy: user.id };
  return {};
}

router.get("/summary", async (req, res) => {
  const dealerId = req.user.role === "admin" ? req.query.dealerId : null;
  const leadMatch = scopeByRole(req.user, dealerId);
  const orderMatch = scopeByRole(req.user, dealerId);
  const paymentMatch = dealerId ? { dealer: dealerId } : req.user.role === "dealer" ? { dealer: req.user.dealer } : {};

  const leadCounts = await Lead.aggregate([
    { $match: leadMatch },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const orders = await Order.aggregate([
    { $match: orderMatch },
    { $group: { _id: null, total: { $sum: "$total" }, paid: { $sum: "$paidAmount" }, count: { $sum: 1 }, incentive: { $sum: "$incentiveEarned" } } }
  ]);
  const payments = await Payment.aggregate([
    { $match: paymentMatch },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  let userTotals = null;
  if (req.user.role === "admin") {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const total = await User.countDocuments();
    const new7 = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    userTotals = { total, new7 };
  }

  let dealerInfo = null;
  if (dealerId) {
    dealerInfo = await Dealer.findById(dealerId).select("name code area").lean();
  }

  res.json({
    leadCounts,
    orderTotals: orders[0] || { total: 0, paid: 0, count: 0, incentive: 0 },
    paymentTotal: payments[0]?.total || 0,
    outstanding: orders[0] ? Math.max(orders[0].total - orders[0].paid, 0) : 0,
    userTotals,
    dealerInfo
  });
});

module.exports = router;