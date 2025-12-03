
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy model to get client
        // Note: The SDK doesn't have a direct listModels method on the client instance easily accessible in all versions,
        // but we can try to use the model manager if available, or just try a known working model like 'gemini-pro' to see if it works,
        // or use the REST API directly if SDK fails.
        // Actually, for @google/generative-ai, we might not have a direct listModels helper in the high-level client.
        // Let's try a simple fetch to the API endpoint directly to be sure.

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes("gemini")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.error("Failed to list models:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
