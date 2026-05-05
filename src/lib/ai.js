import { GoogleGenerativeAI } from "@google/generative-ai";



export async function analyzePriority(title, description) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Defaulting to 'Low'.");
      return "Low";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a specialized complaint management assistant for an educational institution. 
      Analyze the following complaint and categorize its priority as "Low", "Medium", or "High".
      
      Criteria:
      - High: CRITICAL issues. Safety hazards (fire, exposed wires), total infrastructure failure (no water, no power), or SIGNIFICANT educational disruption (teacher absent for weeks, exams in danger, major harassment).
      - Medium: IMPORTANT issues. Functional problems (flickering lights, minor plumbing leaks, classroom equipment malfunctions, missing textbooks).
      - Low: ROUTINE issues. Minor inconveniences (dirty floor, furniture polish, general info requests).

      Examples:
      - Title: "Broken Window", Description: "Someone threw a ball and broke the classroom window." -> Priority: Medium
      - Title: "No Water", Description: "The whole department has no running water since morning." -> Priority: High
      - Title: "Light bulb", Description: "One of the four bulbs in the hall is fused." -> Priority: Low
      - Title: "Teacher Absent", Description: "Our math teacher hasn't come for 3 weeks and exams are near." -> Priority: High

      Complaint Title: "${title}"
      Complaint Description: "${description}"

      Return ONLY the word "Low", "Medium", or "High".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/[.,!?;:]/g, ""); // Remove punctuation

    console.log(`AI Priority Analysis for "${title}": Raw Response = "${text}"`);

    // Validate the response
    if (["Low", "Medium", "High"].includes(text)) {
      return text;
    }

    // Fallback if AI gives a long explanation or different formatting
    const lowerText = text.toLowerCase();
    if (lowerText.includes("high")) return "High";
    if (lowerText.includes("medium")) return "Medium";
    if (lowerText.includes("low")) return "Low";
    
    return "Low";
  } catch (error) {
    console.error("AI Priority Analysis Error:", error);
    
    // Keyword-based fallback if AI fails (Safety net for free tier)
    const fullText = `${title} ${description}`.toLowerCase();
    if (fullText.includes("teacher") || fullText.includes("exam") || fullText.includes("fire") || fullText.includes("safety") || fullText.includes("harassment") || fullText.includes("leak") || fullText.includes("explosion") || fullText.includes("dangerous")) {
      return "High";
    }
    if (fullText.includes("broken") || fullText.includes("water") || fullText.includes("light") || fullText.includes("plumbing") || fullText.includes("software")) {
      return "Medium";
    }
    
    return "Low";
  }
}