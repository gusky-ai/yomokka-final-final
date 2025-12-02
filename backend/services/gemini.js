import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI返信を短縮する関数（2文以内、80文字以内）
function shortenForChat(text) {
    if (!text) return "";

    // 句点で分割して2文まで取得
    const sentences = text.split(/[。！？]/).filter(s => s.trim());
    let shortened = sentences.slice(0, 2).join('。');
    if (shortened && !shortened.match(/[。！？]$/)) {
        shortened += '。';
    }

    // 80文字でカット
    if (shortened.length > 80) {
        return shortened.substring(0, 80) + '...';
    }

    return shortened;
}

// AI 人格の分岐プロンプト（設定文）
function personalityPrompt(type) {
    const tone =
        type && type.includes("T")
            ? "あなたは静かで理性的な壁打ちパートナーです。感情ではなく、思考の整理を手伝います。"
            : "あなたは柔らかく寄り添うカウンセラーです。温かく、静かに心を受け止めます。";

    return `
あなたは深夜の隠れ家本屋「Yomokka」の店主です。
話し方は落ち着いていて、静かな夜の空気のように穏やかです。
「MBTI」という表現は禁止です。
どこか哲学的で、余白を感じさせる語り口で応答してください。
${tone}

【重要】返答は必ず2文以内、80文字以内で簡潔にしてください。長文は絶対に禁止です。
`;
}

export async function getGeminiResponse(type, history, message) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    // frontend から来た履歴を SDK 形式に変換
    // assistant → model に変換して、Gemini のロール仕様に合わせる
    const safeHistory = (history || []).map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
    }));

    // ここまでの会話だけを渡してチャット開始
    const chat = model.startChat({
        history: safeHistory,
    });

    // 1ターン目だけは性格プロンプトをメッセージに混ぜる
    const isFirstTurn = safeHistory.length === 0;
    const userMessageText = isFirstTurn
        ? personalityPrompt(type) + "\n\n" + message
        : message;

    const result = await chat.sendMessage(userMessageText);
    const responseText = result.response.text();

    // 強制短縮
    return shortenForChat(responseText);
}

// Gemini による選書機能
export async function getBookPrescription(personality, history) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    // チャット履歴を要約
    const conversationSummary = (history || [])
        .map((h) => `${h.role === "user" ? "ユーザー" : "店主"}: ${h.content}`)
        .join("\n");

    const prompt = `
あなたは深夜の隠れ家本屋「Yomokka」の店主です。
以下のユーザー情報から、今のこの人に最も心に効く本を世界中の実在する本から1冊だけ選んでください。

【診断結果】
${personality || "不明"}

【会話履歴】
${conversationSummary}

以下の点を重視してください：
- 実在する本であること（架空の本は絶対に避けてください）
- 著者名も正確に含めること
- その人の今の心の状態に寄り添う本であること
- 小説、哲学書、エッセイなど幅広いジャンルから選んでください

必ず以下のJSON形式"のみ"で返してください（他の文章は一切不要）：
{
  "book": "本のタイトル",
  "author": "著者名",
  "line": "その本から心に刺さる一文、または本の雰囲気を表す短い言葉",
  "reason": "なぜこの本が今のこの人に効くのか。こころの状態とどう響き合うのか、2-3文で説明"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
        // JSONのみを抽出（マークダウンのコードブロックなどを除去）
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("JSON not found in response");
    } catch (parseError) {
        console.error("Failed to parse prescription response:", text);
        // フォールバック：デフォルトの本を返す
        return {
            book: "世界の終りとハードボイルド・ワンダーランド",
            author: "村上春樹",
            line: "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
            reason: "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。"
        };
    }
}

