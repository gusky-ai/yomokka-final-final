import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const key = process.env.GEMINI_API_KEY;

console.log("--- ENV CHECK ---");
if (!key) {
    console.error("❌ GEMINI_API_KEY is MISSING in process.env");
    console.log("Current env vars:", Object.keys(process.env));
    process.exit(1);
} else {
    console.log(`✅ GEMINI_API_KEY found (Length: ${key.length})`);
    console.log(`Key starts with: ${key.substring(0, 4)}...`);
}

console.log("\n--- API TEST ---");
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

try {
    const result = await model.generateContent("Hello, are you working?");
    console.log("✅ API Call Successful!");
    console.log("Response:", result.response.text());
} catch (error) {
    console.error("❌ API Call FAILED");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
}
