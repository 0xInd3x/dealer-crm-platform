const router = require("express").Router();
const Ticket = require("../models/Ticket");
const authenticate = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  const filter = {};
  if (req.user.role === "dealer") filter.dealer = req.user.dealer;
  if (req.query.status) filter.status = req.query.status;
  const tickets = await Ticket.find(filter).populate("dealer lead assignedTo").lean();
  res.json(tickets);
});

router.post("/", async (req, res) => {
  const body = req.body;
  body.createdBy = req.user.id;
  if (req.user.role === "dealer") body.dealer = req.user.dealer;
  if (!body.dealer) return res.status(400).json({ message: "dealer is required" });
  if (!body.title) return res.status(400).json({ message: "title is required" });
  const ticket = await Ticket.create(body);
  return res.status(201).json(ticket);
});

router.put("/:id", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Not found" });
  if (req.user.role === "dealer" && String(ticket.dealer) !== String(req.user.dealer)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  Object.assign(ticket, req.body);
  await ticket.save();
  res.json(ticket);
});

module.exports = router;