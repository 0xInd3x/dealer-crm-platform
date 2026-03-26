const router = require("express").Router();
const SalesMember = require("../models/SalesMember");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

router.use(authenticate);

router.get("/", async (req, res) => {
  const members = await SalesMember.find().lean();
  res.json(members);
});

router.post("/", allowRoles("admin"), async (req, res) => {
  const member = await SalesMember.create(req.body);
  res.status(201).json(member);
});

router.put("/:id", allowRoles("admin"), async (req, res) => {
  const member = await SalesMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(member);
});

module.exports = router;