import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getGeminiResponse, getBookPrescription } from "./services/gemini.js";
import { fetchBookCover } from "./services/books.js";

dotenv.config();

const app = express();

// CORS 全許可 & JSON パース
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = 3000;

// 起動時のAPIキーチェック
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is not set in .env file");
  console.error("Please create a .env file with your Gemini API key.");
  console.error("Get your key at: https://makersuite.google.com/app/apikey");
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY loaded successfully");

// 履歴を整える関数
// - 先頭が user 以外なら削る
// - 最後の user（今回の発言）は history から外して sendMessage にだけ渡す
function sanitizeHistory(history) {
  const copy = Array.isArray(history) ? [...history] : [];

  // 先頭が user 以外なら削る
  while (copy.length > 0 && copy[0].role !== "user") {
    copy.shift();
  }

  // 最後が user なら、今回の発言なので history から外す
  if (copy.length > 0 && copy[copy.length - 1].role === "user") {
    copy.pop();
  }

  return copy;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { history = [], personality, message } = req.body;

    if (!message) {
      console.warn("⚠️ Chat request missing message field");
      return res.status(400).json({
        error: "Message is required",
        details: "メッセージが入力されていません"
      });
    }

    console.log(`📨 Chat request - Personality: ${personality}, Message: "${message.substring(0, 50)}..."`);

    const cleanedHistory = sanitizeHistory(history);

    const reply = await getGeminiResponse(
      personality,
      cleanedHistory,
      message
    );

    console.log(`✅ Chat response generated: "${reply.substring(0, 50)}..."`);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API Error in /api/chat:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      personality: req.body.personality,
      historyLength: req.body.history?.length
    });

    res.status(500).json({
      error: "Internal server error",
      details: `通信エラー: ${err.message}`,
      suggestion: "APIキーが正しく設定されているか確認してください"
    });
  }
});

// 選書エンドポイント
app.post("/api/prescription", async (req, res) => {
  try {
    const { personality, history } = req.body;

    if (!personality) {
      console.warn("⚠️ Prescription request missing personality field");
      return res.status(400).json({
        error: "Personality is required",
        details: "性格診断が未実施です"
      });
    }

    console.log(`📚 Prescription request - Personality: ${personality}, History length: ${history?.length || 0}`);

    const prescription = await getBookPrescription(personality, history);

    console.log(`✅ Book prescribed: "${prescription.book}" by ${prescription.author}`);

    // Google Books API から表紙画像を取得
    const imageUrl = await fetchBookCover(
      prescription.book,
      prescription.author
    );

    res.json({
      ...prescription,
      imageUrl
    });
  } catch (err) {
    console.error("❌ Prescription Error in /api/prescription:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      personality: req.body.personality,
      historyLength: req.body.history?.length
    });

    res.status(500).json({
      error: "Failed to generate prescription",
      details: `処方エラー: ${err.message}`,
      suggestion: "しばらく待ってから再試行してください"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌙 Fateful Book Backend running on port ${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - POST http://localhost:${PORT}/api/chat`);
  console.log(`   - POST http://localhost:${PORT}/api/prescription`);
});
