import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";
import {
    visualQuestions,
    situationQuestions,
    calculateScores,
    determineCharacterType,
    characterTypes,
} from "../utils/personalityQuestions.js";
import Particles from "./Particles.jsx";

export default function Diagnosis({ onFinish, onBack }) {
    const [phase, setPhase] = useState("intro"); // intro | questions | analyzing | result
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState(null);
    const [characterType, setCharacterType] = useState(null);
    const resultRef = useRef(null); // 結果画面のキャプチャ用

    // SNSシェア関数
    const handleShare = async (platform) => {
        if (!resultRef.current) return;

        try {
            const canvas = await html2canvas(resultRef.current, {
                backgroundColor: "#f5f3f0",
                scale: 2, // 高解像度
            });

            canvas.toBlob((blob) => {
                const file = new File([blob], "personality-result.png", {
                    type: "image/png",
                });

                if (platform === "twitter") {
                    const text = `私の性格診断結果は「${characterType.name}」でした！\n${characterType.catchphrase}\n\n#Yomokka #性格診断`;
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    window.open(twitterUrl, "_blank");
                } else if (platform === "bluesky") {
                    const text = `私の性格診断結果は「${characterType.name}」でした！\n${characterType.catchphrase}`;
                    // Blueskyのシェア（画像添付は別途実装が必要）
                    alert("結果画像をダウンロードして、Blueskyに投稿してください！");
                    // 画像をダウンロード
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "personality-result.png";
                    a.click();
                    URL.revokeObjectURL(url);
                } else if (platform === "download") {
                    // 画像をダウンロード
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "personality-result.png";
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        } catch (error) {
            console.error("Share error:", error);
            alert("画像の生成に失敗しました");
        }
    };

    const allQuestions = [...visualQuestions, ...situationQuestions];
    const currentQuestion = allQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

    // キーボードショートカット（質問画面でのみ有効）
    useEffect(() => {
        if (phase !== "questions") return;

        const handleKeyPress = (e) => {
            // 1キーまたはAキーでオプションA
            if (e.key === "1" || e.key.toLowerCase() === "a") {
                handleAnswer("A");
            }
            // 2キーまたはBキーでオプションB
            else if (e.key === "2" || e.key.toLowerCase() === "b") {
                handleAnswer("B");
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [phase, currentQuestionIndex]);

    const handleStartDiagnosis = () => {
        setPhase("questions");
    };

    const handleAnswer = (choice) => {
        const newAnswers = [...answers, choice];
        setAnswers(newAnswers);

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 全ての質問が終わったら分析フェーズへ
            setPhase("analyzing");

            // 3秒後に結果を表示
            setTimeout(() => {
                const calculatedScores = calculateScores(newAnswers);
                const determinedType = determineCharacterType(calculatedScores);
                setScores(calculatedScores);
                setCharacterType(determinedType);
                setPhase("result");
            }, 3000);
        }
    };

    const handleFinish = () => {
        // 性格データをApp.jsxに引き渡す
        onFinish({
            characterType: characterType.name,
            scores,
            mbti: characterType.mbti, // 既存機能互換性のため
        });
    };

    // ============================================
    // イントロ画面
    // ============================================
    if (phase === "intro") {
        return (
            <div className="min-h-screen relative overflow-hidden font-serif flex items-center justify-center px-4 py-8">
                {/* ダークグラデーション背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 animate-gradient -z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 -z-10" />
                <Particles />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-center relative z-10"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glassmorphism-dark rounded-3xl p-10 shadow-2xl"
                    >
                        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            性格診断
                        </h1>

                        <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
                            16問の質問に答えて、あなたの性格タイプを診断します。
                            <br />
                            診断結果を元に、<span className="text-gold">最適な本</span>をご提案します。
                        </p>

                        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 mb-10 border border-white/20">
                            <h2 className="text-2xl font-semibold mb-6 text-white">診断の流れ</h2>
                            <ul className="space-y-4 text-left">
                                <li className="flex items-start gap-4">
                                    <span className="text-3xl">🎨</span>
                                    <span className="text-base text-white/80">
                                        <strong className="text-white">ビジュアル診断（8問）</strong>
                                        <br />
                                        画像や色彩から直感的に選択
                                    </span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-3xl">💭</span>
                                    <span className="text-base text-white/80">
                                        <strong className="text-white">シチュエーション診断（8問）</strong>
                                        <br />
                                        日常の場面での選択傾向を診断
                                    </span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-3xl">🎯</span>
                                    <span className="text-base text-white/80">
                                        <strong className="text-white">4軸スコア算出</strong>
                                        <br />
                                        「感情 vs 論理」「速 vs 遅」など
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-4 justify-center">
                            {onBack && (
                                <motion.button
                                    onClick={onBack}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transition-all"
                                >
                                    戻る
                                </motion.button>
                            )}
                            <motion.button
                                onClick={handleStartDiagnosis}
                                whileHover={{ scale: 1.08, boxShadow: "0 20px 60px rgba(255, 215, 0, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-4 bg-gradient-to-r from-gold via-yellow-500 to-gold text-purple-900 text-xl font-bold rounded-full shadow-2xl transition-all"
                            >
                                ✨ 診断を始める
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // 質問画面
    // ============================================
    if (phase === "questions") {
        const isVisual = currentQuestion.type === "visual";

        return (
            <div className="min-h-screen relative overflow-hidden font-serif flex flex-col px-4 py-8">
                {/* ダークグラデーション背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 animate-gradient -z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 -z-10" />
                <Particles />

                {/* プログレスバー */}
                <div className="w-full max-w-3xl mx-auto mb-6 relative z-10">
                    <div className="flex justify-between text-xs text-white/70 mb-2">
                        <span>
                            質問 {currentQuestionIndex + 1} / {allQuestions.length}
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-white/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold"
                            style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
                        />
                    </div>
                </div>

                {/* 質問カード */}
                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-4xl"
                        >
                            {/* 質問テキスト */}
                            <div className="text-center mb-8 relative z-10">
                                <p className="text-xs text-white/60 mb-3 uppercase tracking-wider font-sans">
                                    {isVisual ? "✨ Visual" : "💭 Situation"}
                                </p>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            {/* A or B選択 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Option A */}
                                <motion.button
                                    onClick={() => handleAnswer("A")}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -8,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-gold/20 transition-all border border-white/20"
                                    style={{
                                        background: currentQuestion.optionA.color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        minHeight: "260px",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 group-hover:from-white/20 transition-all" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-white">
                                        {currentQuestion.optionA.emoji && (
                                            <motion.div
                                                className="text-8xl mb-5 drop-shadow-2xl"
                                                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {currentQuestion.optionA.emoji}
                                            </motion.div>
                                        )}
                                        <div className="text-6xl mb-4 font-bold bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">A</div>
                                        <p className="text-lg font-semibold text-center leading-relaxed drop-shadow-lg">
                                            {currentQuestion.optionA.text}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                                    </div>
                                </motion.button>

                                {/* Option B */}
                                <motion.button
                                    onClick={() => handleAnswer("B")}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -8,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-gold/20 transition-all border border-white/20"
                                    style={{
                                        background: currentQuestion.optionB.color || "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                        minHeight: "260px",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 group-hover:from-white/20 transition-all" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-white">
                                        {currentQuestion.optionB.emoji && (
                                            <motion.div
                                                className="text-8xl mb-5 drop-shadow-2xl"
                                                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {currentQuestion.optionB.emoji}
                                            </motion.div>
                                        )}
                                        <div className="text-6xl mb-4 font-bold bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">B</div>
                                        <p className="text-lg font-semibold text-center leading-relaxed drop-shadow-lg">
                                            {currentQuestion.optionB.text}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // ============================================
    // 分析中アニメーション
    // ============================================
    if (phase === "analyzing") {
        return (
            <div className="min-h-screen relative overflow-hidden font-serif flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 animate-gradient -z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 -z-10" />
                <Particles />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <motion.div
                        className="glassmorphism-dark rounded-3xl p-12 shadow-2xl"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="text-9xl mb-8 drop-shadow-2xl"
                        >
                            🔮
                        </motion.div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            あなたの心を分析中...
                        </h2>
                        <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-lg text-white/70 font-light"
                        >
                            深層心理を読み解いています
                        </motion.p>

                        {/* 装飾的なローディングバー */}
                        <div className="mt-10 w-64 h-1 mx-auto bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // 結果画面
    // ============================================
    if (phase === "result") {
        return (
            <div className="min-h-screen relative overflow-hidden font-serif flex items-center justify-center px-4 py-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 animate-gradient -z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 -z-10" />
                <Particles />

                <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="glassmorphism-dark rounded-3xl shadow-2xl p-10 border border-white/10">
                        {/* キャラクター表示 */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                                className="text-9xl mb-6 drop-shadow-2xl"
                            >
                                {characterType.icon}
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xs text-white/60 mb-3 uppercase tracking-widest font-sans"
                            >
                                ✨ Your Character Type
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                            >
                                {characterType.name}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-2xl mb-5 font-light"
                                style={{ color: characterType.color }}
                            >
                                "{characterType.catchphrase}"
                            </motion.p>

                            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
                                {characterType.description}
                            </p>
                        </div>

                        {/* 4軸スコア表示 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="backdrop-blur-md bg-white/10 rounded-2xl p-8 mb-8 border border-white/20"
                        >
                            <h3 className="text-lg font-semibold mb-6 text-center text-white">
                                📊 あなたの性格スコア
                            </h3>

                            {/* レーダーチャート */}
                            <div className="mb-8">
                                <ResponsiveContainer width="100%" height={320}>
                                    <RadarChart
                                        data={[
                                            { axis: "感情", value: scores.emotionLogic },
                                            { axis: "テンポ速", value: scores.tempoFastSlow },
                                            { axis: "抽象", value: scores.abstractConcrete },
                                            { axis: "行動", value: scores.actionReflection },
                                        ]}
                                    >
                                        <PolarGrid stroke="#ffffff40" />
                                        <PolarAngleAxis
                                            dataKey="axis"
                                            stroke="none"
                                            tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600 }}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 100]}
                                            tick={{ fill: "#ffffff80", fontSize: 11 }}
                                            stroke="#ffffff20"
                                        />
                                        <Radar
                                            name="スコア"
                                            dataKey="value"
                                            stroke={characterType.color}
                                            fill={characterType.color}
                                            fillOpacity={0.7}
                                            strokeWidth={3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* バー表示（詳細） */}
                            <div className="space-y-4">
                                {[
                                    {
                                        label: "感情 ← → 論理",
                                        score: scores.emotionLogic,
                                        labelLeft: "感情",
                                        labelRight: "論理",
                                    },
                                    {
                                        label: "テンポ速 ← → テンポ遅",
                                        score: scores.tempoFastSlow,
                                        labelLeft: "速",
                                        labelRight: "遅",
                                    },
                                    {
                                        label: "抽象 ← → 具体",
                                        score: scores.abstractConcrete,
                                        labelLeft: "抽象",
                                        labelRight: "具体",
                                    },
                                    {
                                        label: "行動 ← → 内省",
                                        score: scores.actionReflection,
                                        labelLeft: "行動",
                                        labelRight: "内省",
                                    },
                                ].map((axis, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-xs text-navy/60 mb-1">
                                            <span>{axis.labelLeft}</span>
                                            <span>{axis.labelRight}</span>
                                        </div>
                                        <div className="relative w-full h-3 bg-white rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-sage"
                                                style={{ width: `${axis.score}% ` }}
                                            />
                                            <div
                                                className="absolute top-0 h-full w-1 bg-navy"
                                                style={{ left: `${axis.score}% ` }}
                                            />
                                        </div>
                                        <div className="text-center text-xs text-navy/50 mt-1">
                                            {Math.round(axis.score)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* SNSシェアボタン */}
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            <motion.button
                                onClick={() => handleShare("twitter")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-[#1DA1F2] text-white text-sm font-semibold rounded-full shadow-md hover:bg-[#1a8cd8] transition-colors flex items-center gap-2"
                            >
                                <span>🐦</span>
                                Twitterでシェア
                            </motion.button>

                            <motion.button
                                onClick={() => handleShare("download")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-sage text-white text-sm font-semibold rounded-full shadow-md hover:bg-sage/80 transition-colors flex items-center gap-2"
                            >
                                <span>📥</span>
                                画像をダウンロード
                            </motion.button>
                        </div>

                        {/* 次へボタン */}
                        <div className="flex justify-center">
                            <motion.button
                                onClick={handleFinish}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-3 bg-navy text-cream text-lg font-semibold rounded-full shadow-lg hover:bg-midnight transition-colors"
                            >
                                次へ進む（チャットで深掘り）
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
