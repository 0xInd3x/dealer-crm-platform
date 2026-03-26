const router = require("express").Router();
const Scheme = require("../models/Scheme");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

router.use(authenticate);

router.get("/", async (req, res) => {
  const schemes = await Scheme.find(req.query.active ? { active: true } : {}).lean();
  res.json(schemes);
});

router.post("/", allowRoles("admin"), async (req, res) => {
  const scheme = await Scheme.create(req.body);
  res.status(201).json(scheme);
});

router.put("/:id", allowRoles("admin"), async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(scheme);
});

module.exports = router;