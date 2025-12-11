// 性格診断質問データ - 16問（ビジュアル8 + シチュエーション8）

// ============================================
// ビジュアル診断（8問） - 抽象 vs 具体 を測定
// ============================================

export const visualQuestions = [
    {
        id: 1,
        type: "visual",
        question: "どちらの絵に惹かれますか？",
        optionA: {
            text: "抽象的な幾何学模様",
            emoji: "🌀",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            axis: "abstractConcrete",
            score: 1,
        },
        optionB: {
            text: "写実的な風景画",
            emoji: "🏔️",
            color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            axis: "abstractConcrete",
            score: -1,
        },
    },
    {
        id: 2,
        type: "visual",
        question: "どちらの色が好きですか？",
        optionA: {
            text: "深い紺・紫（神秘的）",
            emoji: "🌙",
            color: "#1e1b4b",
            axis: "abstractConcrete",
            score: 1,
        },
        optionB: {
            text: "明るいオレンジ・黄色（活力的）",
            emoji: "☀️",
            color: "#f59e0b",
            axis: "abstractConcrete",
            score: -1,
        },
    },
    {
        id: 3,
        type: "visual",
        question: "どちらのキャラが好き？",
        optionA: {
            text: "月を見上げる詩人",
            emoji: "🌙",
            color: "linear-gradient(135deg, #4c4ea3 0%, #1e1b4b 100%)",
            axis: "emotionLogic",
            score: 1,
        },
        optionB: {
            text: "機械を組み立てるエンジニア",
            emoji: "⚙️",
            color: "linear-gradient(135deg, #6b7280 0%, #1f2937 100%)",
            axis: "emotionLogic",
            score: -1,
        },
    },
    {
        id: 4,
        type: "visual",
        question: "どちらの雰囲気が好き？",
        optionA: {
            text: "静かな森の中",
            emoji: "🌲",
            color: "linear-gradient(135deg, #166534 0%, #064e3b 100%)",
            axis: "actionReflection",
            score: -1,
        },
        optionB: {
            text: "賑やかな街の中心",
            emoji: "🏙️",
            color: "linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)",
            axis: "actionReflection",
            score: 1,
        },
    },
    {
        id: 5,
        type: "visual",
        question: "どちらのペースが心地いい？",
        optionA: {
            text: "ゆっくり流れる川",
            emoji: "🏞️",
            color: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            axis: "tempoFastSlow",
            score: -1,
        },
        optionB: {
            text: "速く流れる滝",
            emoji: "💧",
            color: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
            axis: "tempoFastSlow",
            score: 1,
        },
    },
    {
        id: 6,
        type: "visual",
        question: "どちらの言葉の響きが好き？",
        optionA: {
            text: "「夢」「希望」「物語」",
            emoji: "✨",
            color: "linear-gradient(135deg, #f472b6 0%, #c084fc 100%)",
            axis: "abstractConcrete",
            score: 1,
        },
        optionB: {
            text: "「目標」「計画」「実績」",
            emoji: "📊",
            color: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            axis: "abstractConcrete",
            score: -1,
        },
    },
    {
        id: 7,
        type: "visual",
        question: "どちらの場所に行きたい？",
        optionA: {
            text: "静かな図書館",
            emoji: "📚",
            color: "linear-gradient(135deg, #78716c 0%, #57534e 100%)",
            axis: "actionReflection",
            score: -1,
        },
        optionB: {
            text: "活気あるイベント会場",
            emoji: "🎉",
            color: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
            axis: "actionReflection",
            score: 1,
        },
    },
    {
        id: 8,
        type: "visual",
        question: "どちらの時間が好き？",
        optionA: {
            text: "静寂の深夜",
            emoji: "🌃",
            color: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            axis: "tempoFastSlow",
            score: -1,
        },
        optionB: {
            text: "活動的な朝",
            emoji: "🌅",
            color: "linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)",
            axis: "tempoFastSlow",
            score: 1,
        },
    },
];

// ============================================
// シチュエーション診断（8問）
// ============================================

export const situationQuestions = [
    {
        id: 9,
        type: "situation",
        question: "落ち込んだ時、どちらの言葉が欲しい？",
        optionA: {
            text: "「大丈夫、あなたならできるよ」",
            emoji: "🤗",
            color: "linear-gradient(135deg, #f472b6 0%, #fb923c 100%)", // 温かいピンク〜オレンジ
            axis: "emotionLogic",
            score: 1,
        },
        optionB: {
            text: "「まず何が問題か整理しよう」",
            emoji: "🧠",
            color: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)", // 冷静な青
            axis: "emotionLogic",
            score: -1,
        },
    },
    {
        id: 10,
        type: "situation",
        question: "新しい挑戦をする時、どちらが背中を押す？",
        optionA: {
            text: "「失敗しても死なないよ、やってみよう」",
            emoji: "🚀",
            color: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)", // エネルギッシュな赤〜オレンジ
            axis: "actionReflection",
            score: 1,
        },
        optionB: {
            text: "「本当にやりたいこと？考えてみよう」",
            emoji: "🤔",
            color: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)", // 内省的な紫
            axis: "actionReflection",
            score: -1,
        },
    },
    {
        id: 11,
        type: "situation",
        question: "本を選ぶ時、何を重視する？",
        optionA: {
            text: "「心に響くストーリー」",
            emoji: "💖",
            color: "linear-gradient(135deg, #ec4899 0%, #c084fc 100%)", // 感情的なピンク〜紫
            axis: "emotionLogic",
            score: 1,
        },
        optionB: {
            text: "「役立つ知識・スキル」",
            emoji: "💼",
            color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", // 実用的な青緑
            axis: "emotionLogic",
            score: -1,
        },
    },
    {
        id: 12,
        type: "situation",
        question: "仕事や勉強で行き詰まった時、どうする？",
        optionA: {
            text: "じっくり考えて、納得してから進む",
            emoji: "🕰️",
            color: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", // 深い青紫（じっくり）
            axis: "tempoFastSlow",
            score: -1,
        },
        optionB: {
            text: "とりあえずやってみて、修正しながら進む",
            emoji: "⚡",
            color: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)", // 明るい黄色（速い）
            axis: "tempoFastSlow",
            score: 1,
        },
    },
    {
        id: 13,
        type: "situation",
        question: "友達に本を勧める時、どう伝える？",
        optionA: {
            text: "「この世界観が最高だよ」（比喩・雰囲気）",
            emoji: "🌈",
            color: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", // 抽象的な紫〜ピンク
            axis: "abstractConcrete",
            score: 1,
        },
        optionB: {
            text: "「〇〇のシーンが良かったよ」（具体例）",
            emoji: "🎬",
            color: "linear-gradient(135deg, #10b981 0%, #059669 100%)", // 具体的な緑
            axis: "abstractConcrete",
            score: -1,
        },
    },
    {
        id: 14,
        type: "situation",
        question: "休日の過ごし方、どちらが好き？",
        optionA: {
            text: "一人で静かに過ごす",
            emoji: "🧘",
            color: "linear-gradient(135deg, #64748b 0%, #475569 100%)", // 静かなグレー
            axis: "actionReflection",
            score: -1,
        },
        optionB: {
            text: "外に出て色々体験する",
            emoji: "🌎",
            color: "linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)", // 活動的なオレンジ
            axis: "actionReflection",
            score: 1,
        },
    },
    {
        id: 15,
        type: "situation",
        question: "説明を受ける時、どちらが理解しやすい？",
        optionA: {
            text: "図やイメージで全体像を見せてもらう",
            emoji: "🖼️",
            color: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", // 全体像の紫
            axis: "abstractConcrete",
            score: 1,
        },
        optionB: {
            text: "ステップごとに具体的に説明してもらう",
            emoji: "📋",
            color: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", // ステップの青緑
            axis: "abstractConcrete",
            score: -1,
        },
    },
    {
        id: 16,
        type: "situation",
        question: "話を聞くとき、何が気になる？",
        optionA: {
            text: "話し手の感情や気持ち",
            emoji: "❤️",
            color: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)", // 感情のピンク
            axis: "emotionLogic",
            score: 1,
        },
        optionB: {
            text: "話の結論や要点",
            emoji: "🎯",
            color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // 論理の青
            axis: "emotionLogic",
            score: -1,
        },
    },
];

// ============================================
// キャラクタータイプ定義（8タイプ）
// ============================================

export const characterTypes = {
    dreamyStoryteller: {
        id: "dreamyStoryteller",
        name: "夢見がちなストーリーテイラー",
        catchphrase: "物語の海で、感情の波に揺られる人",
        description:
            "比喩や世界観に心が動き、じっくり味わうタイプ。内面の変化を大切にする。",
        icon: "🌙",
        color: "#6b46c1",
        scoreRange: {
            emotionLogic: [60, 100],
            tempoFastSlow: [0, 40],
            abstractConcrete: [60, 100],
            actionReflection: [0, 40],
        },
        mbti: "INFP",
    },
    actionDreamer: {
        id: "actionDreamer",
        name: "現実を変える行動派ドリーマー",
        catchphrase: "情熱で世界を塗り替える、理想主義者",
        description:
            "ビジョンに心が燃え、結論ファーストが好き。背中を押されたい。",
        icon: "🔥",
        color: "#dc2626",
        scoreRange: {
            emotionLogic: [60, 100],
            tempoFastSlow: [60, 100],
            abstractConcrete: [60, 100],
            actionReflection: [60, 100],
        },
        mbti: "ENFP",
    },
    realist: {
        id: "realist",
        name: "日常を整えるリアリスト",
        catchphrase: "データと事実で、静かに人生を設計する人",
        description:
            "実例やデータを重視し、じっくり考えるのが好き。心を整えたい。",
        icon: "📊",
        color: "#1e40af",
        scoreRange: {
            emotionLogic: [0, 40],
            tempoFastSlow: [0, 40],
            abstractConcrete: [0, 40],
            actionReflection: [0, 40],
        },
        mbti: "ISTJ",
    },
    problemSolver: {
        id: "problemSolver",
        name: "爆速で動く問題解決マシン",
        catchphrase: "即断即決、課題を秒で片付ける実行者",
        description:
            "結論と実例がセット。テンポ重視で、すぐ行動したい。",
        icon: "⚡",
        color: "#ea580c",
        scoreRange: {
            emotionLogic: [0, 40],
            tempoFastSlow: [60, 100],
            abstractConcrete: [0, 40],
            actionReflection: [60, 100],
        },
        mbti: "ESTJ",
    },
    wordMagician: {
        id: "wordMagician",
        name: "言葉の魔術師",
        catchphrase: "一つ一つの言葉に、心を委ねる繊細な人",
        description:
            "具体的な情景描写に心が動き、ゆっくり味わう。内省的。",
        icon: "🪶",
        color: "#f472b6",
        scoreRange: {
            emotionLogic: [60, 100],
            tempoFastSlow: [0, 40],
            abstractConcrete: [0, 40],
            actionReflection: [0, 40],
        },
        mbti: "ISFP",
    },
    passionCoach: {
        id: "passionCoach",
        name: "熱血コーチ",
        catchphrase: "心を燃やし、今すぐ動き出すあなたへ",
        description:
            "実体験ストーリーに感動し、結論ファースト。背中を押されたい。",
        icon: "📣",
        color: "#facc15",
        scoreRange: {
            emotionLogic: [60, 100],
            tempoFastSlow: [60, 100],
            abstractConcrete: [0, 40],
            actionReflection: [60, 100],
        },
        mbti: "ESFP",
    },
    philosopher: {
        id: "philosopher",
        name: "哲学者の散歩道",
        catchphrase: "思考の迷宮を、静かに歩き続ける探究者",
        description:
            "概念や理論に惹かれ、じっくり考える。内省的。",
        icon: "🤔",
        color: "#166534",
        scoreRange: {
            emotionLogic: [0, 40],
            tempoFastSlow: [0, 40],
            abstractConcrete: [60, 100],
            actionReflection: [0, 40],
        },
        mbti: "INTP",
    },
    visionaryLeader: {
        id: "visionaryLeader",
        name: "ビジョナリー・リーダー",
        catchphrase: "未来を描き、システムで世界を動かす人",
        description:
            "フレームワークや大局観が好き。結論ファーストで行動志向。",
        icon: "🌍",
        color: "#2563eb",
        scoreRange: {
            emotionLogic: [0, 40],
            tempoFastSlow: [60, 100],
            abstractConcrete: [60, 100],
            actionReflection: [60, 100],
        },
        mbti: "ENTJ",
    },
};

// ============================================
// スコア計算関数
// ============================================

export function calculateScores(answers) {
    const allQuestions = [...visualQuestions, ...situationQuestions];

    const axisScores = {
        emotionLogic: 50,
        tempoFastSlow: 50,
        abstractConcrete: 50,
        actionReflection: 50,
    };

    answers.forEach((answer, index) => {
        const question = allQuestions[index];
        if (!question) return;

        const selectedOption = answer === "A" ? question.optionA : question.optionB;
        const axis = selectedOption.axis;
        const score = selectedOption.score;

        axisScores[axis] += score * 6.25;
    });

    Object.keys(axisScores).forEach((axis) => {
        axisScores[axis] = Math.max(0, Math.min(100, axisScores[axis]));
    });

    return axisScores;
}

export function determineCharacterType(scores) {
    let bestMatch = null;
    let bestScore = -1;

    Object.values(characterTypes).forEach((type) => {
        let matchScore = 0;

        Object.keys(scores).forEach((axis) => {
            const userScore = scores[axis];
            const [min, max] = type.scoreRange[axis];

            if (userScore >= min && userScore <= max) {
                matchScore += 100;
            } else {
                const distance = Math.min(
                    Math.abs(userScore - min),
                    Math.abs(userScore - max)
                );
                matchScore += Math.max(0, 100 - distance);
            }
        });

        if (matchScore > bestScore) {
            bestScore = matchScore;
            bestMatch = type;
        }
    });

    return bestMatch || characterTypes.realist;
}
