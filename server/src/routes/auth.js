const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Dealer = require("../models/Dealer");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, dealer: user.dealer },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function makeDealerCode() {
  return `DLR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = signToken(user);
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, dealer: user.dealer } });
});

// Public signup: allows role selection (sales/dealer/admin). Admin role should be used cautiously.
router.post("/signup", async (req, res) => {
  const { name, email, password, role = "sales", dealer, areas = [], dealerArea, dealerPhone } = req.body;
  const allowedRoles = ["sales", "dealer", "admin"];
  if (!allowedRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });
  const hash = await bcrypt.hash(password, 10);

  let dealerId = dealer;
  if (role === "dealer" && !dealerId) {
    const createdDealer = await Dealer.create({
      name,
      code: makeDealerCode(),
      area: dealerArea || areas[0] || "Unassigned",
      phone: dealerPhone || "",
      incentive: { leadRate: 0, salesRate: 0 }
    });
    dealerId = createdDealer._id;
  }

  const user = await User.create({ name, email, passwordHash: hash, role, dealer: dealerId, areas });
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, dealer: user.dealer } });
});

router.post("/register", authenticate, allowRoles("admin"), async (req, res) => {
  const { name, email, password, role = "sales", dealer, areas = [] } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, role, dealer, areas });
  res.status(201).json({ id: user._id, name: user.name, role: user.role, dealer: user.dealer });
});

module.exports = router;