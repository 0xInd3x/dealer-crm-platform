const router = require("express").Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const authenticate = require("../middleware/auth");
const { refreshOrderPayments } = require("../utils/ledger");
const { sendWhatsApp } = require("../utils/notify");

router.use(authenticate);

function roleFilter(req) {
  if (req.user.role === "dealer") return { dealer: req.user.dealer };
  if (req.user.role === "sales") return { createdBy: req.user.id }; // via order.creator
  return {};
}

router.get("/", async (req, res) => {
  const filter = roleFilter(req);
  const payments = await Payment.find(filter).populate("order dealer").lean();
  res.json(payments);
});

router.post("/", async (req, res) => {
  const { order: orderId, amount, method, reference, note } = req.body;
  if (!orderId || !amount) return res.status(400).json({ message: "order and amount required" });
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (req.user.role === "dealer" && String(order.dealer) !== String(req.user.dealer)) return res.status(403).json({ message: "Forbidden" });
  if (req.user.role === "sales" && String(order.createdBy) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });

  const payment = await Payment.create({ order: orderId, dealer: order.dealer, amount, method, reference, note, createdBy: req.user.id });
  const paid = await refreshOrderPayments(orderId);
  const outstanding = Math.max(order.total - paid, 0);
  sendWhatsApp("dealer", "payment_recorded", { orderId, amount, outstanding });
  res.status(201).json({ ...payment.toObject(), outstanding });
});

module.exports = router;