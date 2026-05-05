import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzePriority(title, description) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Defaulting to 'Low' priority.");
      return "Low";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a complaint management assistant. 
      Analyze the following complaint and categorize its priority as "Low", "Medium", or "High".
      
      Criteria:
      - High: Urgent issues affecting safety, critical infrastructure, or major functionality (e.g., AC broken in summer, electrical fire hazard, total internet outage for a manager).
      - Medium: Important but not life-threatening issues (e.g., flickering lights, minor plumbing leaks, recurring software bugs).
      - Low: Minor inconveniences or non-urgent requests (e.g., dirty floor, furniture polish, information requests).

      Complaint Title: "${title}"
      Complaint Description: "${description}"

      Return ONLY the priority word ("Low", "Medium", or "High").
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Validate the response
    if (["Low", "Medium", "High"].includes(text)) {
      return text;
    }

    // Fallback if AI gives a long explanation
    if (text.toLowerCase().includes("high")) return "High";
    if (text.toLowerCase().includes("medium")) return "Medium";
    
    return "Low";
  } catch (error) {
    console.error("AI Priority Analysis Error:", error);
    return "Low"; // Fallback
  }
}
