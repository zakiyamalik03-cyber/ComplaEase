
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment.");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Note: The JS SDK doesn't have a direct listModels method on the genAI instance 
    // that works the same way as the REST API easily, but we can try to fetch a known model's info
    // or just try common names.
    
    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    console.log("Testing model availability...");
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a very simple prompt
        await model.generateContent("test");
        console.log(`✅ Model "${modelName}" is available.`);
      } catch (e) {
        console.log(`❌ Model "${modelName}" is NOT available. Error: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
