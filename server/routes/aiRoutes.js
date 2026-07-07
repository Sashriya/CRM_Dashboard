import express from "express";
import {
  chatWithAI,
  scoreLead,
  generateEmailDraft,
  summarizeText,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/chat", chatWithAI);
router.post("/leads/:id/score", scoreLead);
router.post("/email-draft", generateEmailDraft);
router.post("/summarize", summarizeText);

export default router;
