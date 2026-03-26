const router = require("express").Router();
const User = require("../models/User");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

router.use(authenticate, allowRoles("admin"));

router.get("/", async (_req, res) => {
  const users = await User.find().populate("dealer").lean();
  res.json(users);
});

router.put("/:id", async (req, res) => {
  const updates = (({ name, role, dealer, areas, active }) => ({ name, role, dealer, areas, active }))(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(user);
});

module.exports = router;