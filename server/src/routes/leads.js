const router = require("express").Router();
const Lead = require("../models/Lead");
const Dealer = require("../models/Dealer");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { sendWhatsApp } = require("../utils/notify");

router.use(authenticate);

function buildLeadFilter(user, query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (user.role === "dealer") filter.dealer = user.dealer;
  if (user.role === "sales" && user.areas?.length) filter.area = { $in: user.areas };
  return filter;
}

router.get("/", async (req, res) => {
  const leads = await Lead.find(buildLeadFilter(req.user, req.query)).populate("dealer").lean();
  res.json(leads);
});

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.phone || !body.area) return res.status(400).json({ message: "name, phone, area required" });
  body.createdBy = req.user.id;
  if (req.user.role === "dealer") body.dealer = req.user.dealer;
  if (body.area && !body.dealer) {
    const dealer = await Dealer.findOne({ area: body.area, active: true });
    if (dealer) {
      body.dealer = dealer._id;
      body.assignedAt = new Date();
    }
  }
  const lead = await Lead.create(body);
  if (lead.dealer) sendWhatsApp("dealer", "lead_assigned", { leadId: lead._id, dealer: lead.dealer });
  res.status(201).json(lead);
});

router.put("/:id", async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  const isDealerOwner = req.user.role === "dealer" && String(lead.dealer) === String(req.user.dealer);
  const isCreator = String(lead.createdBy) === String(req.user.id);

  if (req.user.role === "admin") {
    Object.assign(lead, req.body);
  } else {
    // non-admin: only status update on owned/created leads
    if (!isDealerOwner && !isCreator) return res.status(403).json({ message: "Forbidden" });
    if (!req.body.status) return res.status(400).json({ message: "Only status update allowed" });
    lead.status = req.body.status;
    if (lead.status === "converted") lead.closedAt = new Date();
  }
  await lead.save();
  res.json(lead);
});

// Admin-only assign or reassign
router.post("/:id/assign", allowRoles("admin"), async (req, res) => {
  const { dealerId } = req.body;
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  if (dealerId) {
    lead.dealer = dealerId;
  } else if (lead.area) {
    const dealer = await Dealer.findOne({ area: lead.area, active: true });
    if (!dealer) return res.status(400).json({ message: "No dealer in area" });
    lead.dealer = dealer._id;
  }
  lead.assignedAt = new Date();
  await lead.save();
  sendWhatsApp("dealer", "lead_assigned", { leadId: lead._id, dealer: lead.dealer });
  res.json(lead);
});

router.delete("/:id", allowRoles("admin"), async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;