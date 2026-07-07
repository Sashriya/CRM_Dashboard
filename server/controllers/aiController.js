import asyncHandler from "express-async-handler";
import groq, { GROQ_MODEL } from "../config/groq.js";
import Lead from "../models/Lead.js";

/**
 * Helper: call Groq chat completions
 */
const callGroq = async (messages, options = {}) => {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error(
      "GROQ_API_KEY is not configured on the server. Add it to your .env file and restart the server."
    );
    err.statusCode = 500;
    throw err;
  }

  const completion = await groq.chat.completions.create({
    model: options.model || GROQ_MODEL,
    messages,
    temperature: options.temperature ?? 0.5,
    max_tokens: options.max_tokens ?? 800,
    response_format: options.json ? { type: "json_object" } : undefined,
  });

  return completion.choices[0]?.message?.content?.trim() || "";
};

// @desc    General AI chat assistant for the CRM dashboard
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  const systemPrompt = {
    role: "system",
    content:
      "You are an AI assistant embedded inside a CRM dashboard. You help sales reps with lead insights, " +
      "task prioritization, deal strategy, and writing communications. Be concise, practical, and professional.",
  };

  const messages = [
    systemPrompt,
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const reply = await callGroq(messages, { temperature: 0.6, max_tokens: 700 });

  res.json({ success: true, data: { reply } });
});

// @desc    Score a lead's quality using AI, based on available data
// @route   POST /api/ai/leads/:id/score
// @access  Private
export const scoreLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id }).populate("contact");

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  const prompt = `You are a CRM AI that scores sales leads from 0-100 based on likelihood to convert.
Return ONLY a JSON object with keys "score" (integer 0-100) and "summary" (a 2-3 sentence rationale).

Lead data:
Name: ${lead.name}
Company: ${lead.company || "Unknown"}
Source: ${lead.source}
Status: ${lead.status}
Deal Value Estimate: ${lead.value || "Unknown"}
Notes: ${lead.contact?.notes || "None"}`;

  const raw = await callGroq(
    [
      { role: "system", content: "You are a precise CRM lead-scoring engine. Always respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    { json: true, temperature: 0.3, max_tokens: 300 }
  );

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    res.status(502);
    throw new Error("AI returned an unparseable response. Please try again.");
  }

  lead.aiScore = parsed.score;
  lead.aiSummary = parsed.summary;
  await lead.save();

  res.json({ success: true, data: lead });
});

// @desc    Generate a draft outreach/follow-up email using AI
// @route   POST /api/ai/email-draft
// @access  Private
export const generateEmailDraft = asyncHandler(async (req, res) => {
  const { recipientName, context, tone = "professional", purpose = "follow-up" } = req.body;

  if (!recipientName || !context) {
    res.status(400);
    throw new Error("Please provide recipientName and context");
  }

  const prompt = `Write a ${tone} ${purpose} email to ${recipientName}.
Context: ${context}

Keep it concise (under 150 words), include a subject line, and end with a clear call to action.
Format the response as:
Subject: <subject line>

<email body>`;

  const draft = await callGroq(
    [
      { role: "system", content: "You are an expert sales copywriter helping a CRM user write effective emails." },
      { role: "user", content: prompt },
    ],
    { temperature: 0.7, max_tokens: 500 }
  );

  res.json({ success: true, data: { draft } });
});

// @desc    Summarize free-text notes/call transcripts into structured CRM notes
// @route   POST /api/ai/summarize
// @access  Private
export const summarizeText = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Please provide text to summarize");
  }

  const prompt = `Summarize the following sales call/notes into a structured CRM entry with:
- Key Points (bullet list)
- Action Items (bullet list)
- Sentiment (one word: positive/neutral/negative)

Text:
"""${text}"""`;

  const summary = await callGroq(
    [
      { role: "system", content: "You are a CRM assistant that converts raw notes into structured summaries." },
      { role: "user", content: prompt },
    ],
    { temperature: 0.4, max_tokens: 500 }
  );

  res.json({ success: true, data: { summary } });
});
