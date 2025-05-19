import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

export const getLLMSummary = async (query: string, data: any[]) => {
  // Use the full dataset
  const prompt = `
You are a real estate analyst. Analyze the following dataset and generate a short, insightful summary for the user query: "${query}".

Data:
${JSON.stringify(data)}

Instructions:
- Identify trends in price or demand.
- Mention any interesting changes over time.
- Be concise and insightful.
`;

  // ✅ Log the prompt data before making the request
  console.log("Sending prompt to Gemini:\n", prompt);

  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Gemini error:", result);
    throw new Error(result.error?.message || "Gemini API failed");
  }

  return (
    result.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated."
  );
};
