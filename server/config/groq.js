import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️  GROQ_API_KEY is not set. AI routes will return an error until it's configured in .env"
  );
}

// Pass a placeholder when missing so the SDK doesn't throw on import/startup.
// Real requests will still fail with a clear 401 from Groq until a valid key is set.
const groq = new Groq({
  apiKey: apiKey || "missing-groq-api-key",
});

export const GROQ_MODEL = process.env.GROQ_MODEL;

export default groq;
