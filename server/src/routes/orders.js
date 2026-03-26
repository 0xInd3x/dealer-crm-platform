const router = require("express").Router();
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Dealer = require("../models/Dealer");
const authenticate = require("../middleware/auth");

router.use(authenticate);

function roleFilter(req) {
  if (req.user.role === "dealer") return { dealer: req.user.dealer };
  if (req.user.role === "sales") return { createdBy: req.user.id };
  return {};
}

router.get("/", async (req, res) => {
  const filter = roleFilter(req);
  const orders = await Order.find(filter).populate("dealer lead").lean();
  res.json(orders.map(o => ({ ...o, outstanding: Math.max(o.total - o.paidAmount, 0) })));
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate("dealer lead");
  if (!order) return res.status(404).json({ message: "Not found" });
  if (req.user.role === "dealer" && String(order.dealer._id) !== String(req.user.dealer)) return res.status(403).json({ message: "Forbidden" });
  if (req.user.role === "sales" && String(order.createdBy) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });
  const payments = await Payment.find({ order: order._id });
  res.json({ ...order.toObject(), outstanding: Math.max(order.total - order.paidAmount, 0), payments });
});

router.post("/", async (req, res) => {
  const payload = req.body;
  payload.createdBy = req.user.id;
  if (req.user.role === "dealer") payload.dealer = req.user.dealer;
  if (!payload.dealer) return res.status(400).json({ message: "dealer is required" });
  const total = (payload.items || []).reduce((sum, i) => sum + (i.qty || 1) * (i.price || 0), 0);
  payload.total = total;
  // incentive: dealer.salesRate as percentage
  const dealer = await Dealer.findById(payload.dealer);
  if (dealer?.incentive?.salesRate) {
    payload.incentiveEarned = Number(((dealer.incentive.salesRate / 100) * total).toFixed(2));
  }
  const order = await Order.create(payload);
  res.status(201).json({ ...order.toObject(), outstanding: total });
});

router.put("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  if (req.user.role === "dealer" && String(order.dealer) !== String(req.user.dealer)) return res.status(403).json({ message: "Forbidden" });
  if (req.user.role === "sales" && String(order.createdBy) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });

  if (req.user.role === "dealer") {
    // dealers may only update status
    if (req.body.status) {
      order.status = req.body.status;
      await order.save();
      return res.json({ ...order.toObject(), outstanding: Math.max(order.total - order.paidAmount, 0) });
    }
    return res.status(403).json({ message: "Dealers can only update status" });
  }

  Object.assign(order, req.body);
  if (req.body.items) {
    order.total = req.body.items.reduce((sum, i) => sum + (i.qty || 1) * (i.price || 0), 0);
  }
  await order.save();
  res.json({ ...order.toObject(), outstanding: Math.max(order.total - order.paidAmount, 0) });
});

module.exports = router;