import asyncHandler from "express-async-handler";
import Lead from "../models/Lead.js";

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req, res) => {
  const { status, source } = req.query;
  const query = { owner: req.user._id };
  if (status) query.status = status;
  if (source) query.source = source;

  const leads = await Lead.find(query).populate("contact").sort({ createdAt: -1 });
  res.json({ success: true, count: leads.length, data: leads });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id }).populate("contact");
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, data: lead });
});

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: lead });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req, res) => {
  let lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: lead });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  await lead.deleteOne();
  res.json({ success: true, data: {} });
});
