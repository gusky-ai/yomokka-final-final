import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callOpenAI(messages, model = "gpt-3.5-turbo") {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model,
            messages,
            max_tokens: 600,
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`OpenAI API error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return content || "";
}

async function callGroq(messages, model = "llama-3.3-70b-versatile") {
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model,
            messages,
            max_tokens: 600,
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Groq API error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return content || "";
}

// AI返信を短縮する関数（2文以内、100文字以内に拡張）
function shortenForChat(text) {
    if (!text) return "";

    // 句点で分割して2文まで取得
    const sentences = text.split(/[。！？]/).filter(s => s.trim());
    let shortened = sentences.slice(0, 2).join("。");
    if (shortened && !shortened.match(/[。！？]$/)) {
        shortened += "。";
    }

    // 100文字でカット（深掘り質問のため少し長めに）
    if (shortened.length > 100) {
        return shortened.substring(0, 100) + "...";
    }

    return shortened;
}

// AI 人格の分岐プロンプト（深掘りモード）
export function personalityPrompt(type) {
    // 新形式: { characterType, scores, mbti } または 旧形式: "INFP" 文字列
    const mbtiType = typeof type === 'string' ? type : (type?.mbti || '');

    const tone =
        mbtiType && mbtiType.includes("T")
            ? "あなたは静かで理性的な壁打ちパートナーです。感情ではなく、思考の整理を手伝います。"
            : "あなたは柔らかく寄り添うカウンセラーです。温かく、静かに心を受け止めます。";

    // 新形式の場合、性格タイプ情報も追加
    const personalityInfo = type?.characterType
        ? `\n【ユーザーの性格タイプ】\n${type.characterType}\n`
        : '';

    return `
あなたは「熟練の選書カウンセラー（Book Therapist）」です。
あなたの役割は、ユーザーが言葉にできない内面のモヤモヤを言語化し、本当に必要な一冊を処方することです。
話し方は穏やかで丁寧、しかし常に会話の主導権を握り、次の一歩を提示するファシリテーターとして振る舞ってください。
${personalityInfo}
【対話の絶対ルール】
1) 主導権を握る：ユーザーの返答をただ待つのではなく、必ず会話を広げるアクションを取り、会話の方向性を提示してください。
2) 即答禁止：ユーザーが最初の悩みを述べた直後に本を紹介しないこと。提案する前に、少なくとも合計で「3回の深掘り質問（ユーザーの応答を促す質問）」を行い、ユーザーの状況とニーズを掘り下げてください。
   - これら3回の深掘りは複数ターンにまたがって構わないため、会話履歴を参照して過去の質問数を推定しながら進めてください。
3) 「共感」＋「質問」のセット：ユーザーの発言に必ず短い共感（例：「それはお辛いですね」「よくわかります」など）を挟んでから、次の質問を1つだけ投げかけてください。
4) 質問は一つずつ：一度のターンで投げる質問は必ず1つに絞り、尋問のようにならないよう配慮してください。
5) 最終出力：ユーザーのニーズが明確になった（深掘り質問が十分に行われ、回答から核心が把握できた）段階で初めて本を提示してください。

【追加の振る舞いルール】
- ユーザーが本を早くほしいと明確に求めた場合を除き、自発的に本を推薦してはいけません。その場合でもまず短い確認（1問）をしてから提示してください。
- 各応答は日本語で簡潔に。共感は短く1文以内、続く質問も1文で表現すること。
- ユーザーの語りから得たキーワードや情緒（例：孤独、焦燥、不安、喪失、希求など）をメモし、次の深掘りで参照して具体化してください。
- 会話の主導を保つために、必要に応じて選択肢（例：「仕事について深掘りする」「人間関係について深掘りする」など）を提示して方向性を決めさせることは許容されますが、提示する際も必ず共感→質問の順に行ってください。

【出力の形式と制約】
- 各ターンの出力は「共感の短い一文」＋「質問（1つ）」、またはニーズが明確になった場合は「共感の短い一文」＋「本の推薦（1冊、著者名を含む）と推薦理由2-3文」のどちらかの形式にしてください。
- 質問や共感はいずれも過度に長くせず、簡潔に表現してください。

${tone}
`;
}

// メインチャット
export async function getGeminiResponse(type, history, message) {
    try {
        // Prefer Groq if available, then OpenAI, then Gemini SDK
        if (GROQ_API_KEY) {
            const hist = history || [];
            const isFirstTurn = hist.length === 0;
            const messages = [];
            if (isFirstTurn) {
                messages.push({ role: "system", content: personalityPrompt(type) });
            }
            for (const h of hist) {
                messages.push({ role: h.role === "assistant" ? "assistant" : "user", content: h.content });
            }
            messages.push({ role: "user", content: message });

            console.log(`🤖 Calling Groq chat with ${messages.length} messages`);
            const responseText = await callGroq(messages);
            console.log(`📝 Raw response: "${(responseText || "").substring(0, 100)}..."`);
            const shortened = shortenForChat(responseText);
            console.log(`✂️ Shortened to: "${shortened}"`);
            return shortened;
        }

        // If OPENAI API key is provided, use OpenAI chat completions
        if (OPENAI_API_KEY) {
            const hist = history || [];
            const isFirstTurn = hist.length === 0;
            const messages = [];
            if (isFirstTurn) {
                messages.push({ role: "system", content: personalityPrompt(type) });
            }
            // map history to OpenAI roles (assume history roles are 'user'|'assistant')
            for (const h of hist) {
                messages.push({ role: h.role === "assistant" ? "assistant" : "user", content: h.content });
            }
            messages.push({ role: "user", content: message });

            console.log(`🤖 Calling OpenAI chat with ${messages.length} messages`);
            const responseText = await callOpenAI(messages);
            console.log(`📝 Raw response: "${(responseText || "").substring(0, 100)}..."`);
            const shortened = shortenForChat(responseText);
            console.log(`✂️ Shortened to: "${shortened}"`);
            return shortened;
        }

        // Fallback: Gemini SDK path
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        // frontend から来た履歴を SDK 形式に変換
        // assistant → model に変換して、Gemini のロール仕様に合わせる
        const safeHistory = (history || []).map((h) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
        }));

        console.log(`🤖 Starting chat with ${safeHistory.length} history items`);

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

        console.log(`📝 Raw response: "${responseText.substring(0, 100)}..."`);

        // 強制短縮
        const shortened = shortenForChat(responseText);
        console.log(`✂️ Shortened to: "${shortened}"`);

        return shortened;
    } catch (error) {
        console.error("❌ Error in getGeminiResponse:", error);
        throw new Error(`Gemini API call failed: ${error.message}`);
    }
}

// Gemini による選書機能
export async function getBookPrescription(personality, history) {
    try {
        // If OPENAI is configured, use it
        const conversationSummary = (history || [])
            .map((h) => `${h.role === "user" ? "ユーザー" : "薬剤師"}: ${h.content}`)
            .join("\n");

        console.log(
            `📖 Generating prescription with ${history?.length || 0} conversation turns`
        );

        const prompt = `
あなたは深夜の言葉の薬局「Fateful Book」の薬剤師です。
以下のユーザー情報から、今のこの人に最も心に効く本を世界中の実在する本から1冊だけ選んでください。

【診断結果】
${personality || "不明"}

【カウンセリング記録】
${conversationSummary}

以下の点を重視してください：
- 実在する本であること（架空の本は絶対に避けてください）
- 著者名も正確に含めること
- その人の今の心の状態に深く寄り添う本であること
- 小説、哲学書、エッセイ、詩集など幅広いジャンルから選んでください
- 会話の中で見えた「核心」に響く本を選んでください

必ず以下のJSON形式「のみ」で返してください（他の文章は一切不要）：
{
  "book": "本のタイトル",
  "author": "著者名",
  "line": "その本から心に刺さる一文、または本の雰囲気を表す短い言葉",
  "reason": "なぜこの本が今のこの人に効くのか。こころの状態とどう響き合うのか、2-3文で説明"
}
`;

        if (GROQ_API_KEY) {
            const messages = [{ role: "system", content: prompt }];
            const text = await callGroq(messages);
            console.log(`📚 Prescription response received`);
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const prescription = JSON.parse(jsonMatch[0]);
                    console.log(
                        `✅ Prescription parsed: "${prescription.book}" by ${prescription.author}`
                    );
                    return prescription;
                }
                throw new Error("JSON not found in response");
            } catch (parseError) {
                console.error("❌ Failed to parse prescription response:", text);
                console.error("Parse error:", parseError);
                return {
                    book: "世界の終りとハードボイルド・ワンダーランド",
                    author: "村上春樹",
                    line: "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
                    reason:
                        "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。",
                };
            }
        }

        if (OPENAI_API_KEY) {
            const messages = [{ role: "system", content: prompt }];
            const text = await callOpenAI(messages);
            console.log(`📚 Prescription response received`);
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const prescription = JSON.parse(jsonMatch[0]);
                    console.log(
                        `✅ Prescription parsed: "${prescription.book}" by ${prescription.author}`
                    );
                    return prescription;
                }
                throw new Error("JSON not found in response");
            } catch (parseError) {
                console.error("❌ Failed to parse prescription response:", text);
                console.error("Parse error:", parseError);
                return {
                    book: "世界の終りとハードボイルド・ワンダーランド",
                    author: "村上春樹",
                    line: "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
                    reason:
                        "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。",
                };
            }
        }

        // Fallback: Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log(`📚 Prescription response received`);

        try {
            // JSONのみを抽出（マークダウンのコードブロックなどを除去）
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const prescription = JSON.parse(jsonMatch[0]);
                console.log(
                    `✅ Prescription parsed: "${prescription.book}" by ${prescription.author}`
                );
                return prescription;
            }
            throw new Error("JSON not found in response");
        } catch (parseError) {
            console.error("❌ Failed to parse prescription response:", text);
            console.error("Parse error:", parseError);
            // フォールバック：デフォルトの本を返す
            return {
                book: "世界の終りとハードボイルド・ワンダーランド",
                author: "村上春樹",
                line: "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
                reason:
                    "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。",
            };
        }
    } catch (error) {
        console.error("❌ Error in getBookPrescription:", error);
        throw new Error(`Book prescription failed: ${error.message}`);
    }
}

// 2回目以降の「クイック返信候補」を出す機能
export async function getFollowupSuggestions(personality, history) {
    try {
        const conversationSummary = (history || [])
            .map((h) => `${h.role === "user" ? "ユーザー" : "薬剤師"}: ${h.content}`)
            .join("\n");

        console.log(
            `💬 Generating follow-up suggestions with ${history?.length || 0} conversation turns`
        );

        const prompt = `
あなたは深夜の言葉の薬局「Fateful Book」の薬剤師です。

以下の会話履歴とMBTIタイプから、
ユーザーが次に押したくなる「クイック返信候補」を4つ考えてください。

【MBTI】
${personality || "不明"}

【ここまでの会話】
${conversationSummary}

ルール：
- 候補はすべて日本語
- 1つあたり30文字以内
- 押したらそのまま送信できる文章にする（語尾は話し言葉でOK）
- ユーザーの今の感情・テーマに沿ったものにする
- 新しい話題に切り替える選択肢が1つあってもよい

必ず次のJSON「だけ」を返してください：

{
  "options": [
    "候補1",
    "候補2",
    "候補3",
    "候補4"
  ]
}
`;

        if (GROQ_API_KEY) {
            const messages = [{ role: "system", content: prompt }];
            const text = await callGroq(messages);

            console.log("💡 Raw suggestions:", text);

            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const obj = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(obj.options) && obj.options.length > 0) {
                        return obj.options;
                    }
                }
            } catch (e) {
                console.error("❌ Failed to parse suggestions JSON:", e);
            }
        }

        if (OPENAI_API_KEY) {
            const messages = [{ role: "system", content: prompt }];
            const text = await callOpenAI(messages);

            console.log("💡 Raw suggestions:", text);

            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const obj = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(obj.options) && obj.options.length > 0) {
                        return obj.options;
                    }
                }
            } catch (e) {
                console.error("❌ Failed to parse suggestions JSON:", e);
            }
        }

        // Fallback: Gemini path
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("💡 Raw suggestions:", text);

        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const obj = JSON.parse(jsonMatch[0]);
                if (Array.isArray(obj.options) && obj.options.length > 0) {
                    return obj.options;
                }
            }
        } catch (e) {
            console.error("❌ Failed to parse suggestions JSON:", e);
        }

        // パースに失敗したり、変な形式のときのフォールバック
        return [
            "さっきの話をもう少し具体的に話したいです",
            "別の悩みのことも話していいですか？",
            "今の気持ちを一言で言うとこうです",
            "うまく言葉にならないけど、モヤモヤしています",
        ];
    } catch (error) {
        console.error("❌ Error in getFollowupSuggestions:", error);
        return [
            "さっきの話をもう少し具体的に話したいです",
            "別の悩みのことも話していいですか？",
            "今の気持ちを一言で言うとこうです",
            "うまく言葉にならないけど、モヤモヤしています",
        ];
    }
}
