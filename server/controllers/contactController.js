import asyncHandler from "express-async-handler";
import Contact from "../models/Contact.js";

// @desc    Get all contacts (owned by user)
// @route   GET /api/contacts
// @access  Private
export const getContacts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { owner: req.user._id };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 });
  res.json({ success: true, count: contacts.length, data: contacts });
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.json({ success: true, data: contact });
});

// @desc    Create contact
// @route   POST /api/contacts
// @access  Private
export const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: contact });
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = asyncHandler(async (req, res) => {
  let contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: contact });
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  await contact.deleteOne();
  res.json({ success: true, data: {} });
});
