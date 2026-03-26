const router = require("express").Router();
const Dealer = require("../models/Dealer");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

router.use(authenticate);

router.get("/", async (req, res) => {
  const filter = {};
  if (req.user.role === "dealer") {
    filter._id = req.user.dealer;
  }
  if (req.query.area) filter.area = req.query.area;
  const dealers = await Dealer.find(filter).lean();
  res.json(dealers);
});

router.post("/", allowRoles("admin"), async (req, res) => {
  const dealer = await Dealer.create(req.body);
  res.status(201).json(dealer);
});

router.put("/:id", allowRoles("admin"), async (req, res) => {
  const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dealer);
});

router.get("/:id/ledger", async (req, res) => {
  const dealerId = req.params.id;
  if (req.user.role === "dealer" && dealerId !== String(req.user.dealer)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const orders = await Order.find({ dealer: dealerId });
  const payments = await Payment.find({ dealer: dealerId });
  const totalOrders = orders.reduce((sum, o) => sum + o.total, 0);
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = Math.max(totalOrders - paid, 0);
  res.json({ totalOrders, paid, outstanding, orders, payments });
});

module.exports = router;