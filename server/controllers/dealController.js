import asyncHandler from "express-async-handler";
import Deal from "../models/Deal.js";

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
export const getDeals = asyncHandler(async (req, res) => {
  const { stage } = req.query;
  const query = { owner: req.user._id };
  if (stage) query.stage = stage;

  const deals = await Deal.find(query).populate("contact lead").sort({ createdAt: -1 });
  res.json({ success: true, count: deals.length, data: deals });
});

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
export const getDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id }).populate("contact lead");
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }
  res.json({ success: true, data: deal });
});

// @desc    Create deal
// @route   POST /api/deals
// @access  Private
export const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: deal });
});

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
export const updateDeal = asyncHandler(async (req, res) => {
  let deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id });
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }
  deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: deal });
});

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id });
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }
  await deal.deleteOne();
  res.json({ success: true, data: {} });
});
