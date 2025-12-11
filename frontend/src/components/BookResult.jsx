import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invertMBTI } from "../utils/mbti";
import BookCoverPlaceholder from "./BookCoverPlaceholder";
import Particles from "./Particles.jsx";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function BookResult({ data, onDetailClick, onBackToHome }) {
    const [shadow, setShadow] = useState(false);
    const [shadowBook, setShadowBook] = useState(null);
    const [loadingShadow, setLoadingShadow] = useState(false);
    const [imageError, setImageError] = useState(false);

    // ドラマチック演出用の状態
    const [revealed, setRevealed] = useState(false);
    const [displayedReason, setDisplayedReason] = useState("");

    // 通常モードの本データ
    const normalBook = {
        book: data?.book || "世界の終りとハードボイルド・ワンダーランド",
        author: data?.author || "村上春樹",
        line: data?.line || "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
        reason: data?.reason || "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。",
        imageUrl: data?.imageUrl || null,
        personality: data?.personality
    };

    // Shadowボタン押下時の処理
    const toggleShadow = async () => {
        if (!shadow && !shadowBook) {
            // Shadow用の本を取得
            setLoadingShadow(true);
            try {
                const invertedPersonality = invertMBTI(data?.personality || "INFP");
                const res = await fetch(`${API_URL}/api/prescription`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        personality: invertedPersonality,
                        history: data?.history || []
                    })
                });
                const shadowData = await res.json();
                setShadowBook(shadowData);
            } catch (error) {
                console.error("Failed to fetch shadow book:", error);
            } finally {
                setLoadingShadow(false);
            }
        }
        setShadow(!shadow);
        setImageError(false);
        setRevealed(false);
        setDisplayedReason("");
    };

    // 表示する本データ
    const displayBook = shadow && shadowBook ? shadowBook : normalBook;

    // 開封アニメーション
    const handleReveal = () => {
        setRevealed(true);
    };

    // タイプライター効果
    useEffect(() => {
        if (!revealed || !displayBook.reason) return;

        let index = 0;
        const text = displayBook.reason;
        setDisplayedReason("");

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedReason(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [revealed, displayBook.reason, shadow]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`min-h-screen font-serif flex flex-col items-center justify-center px-4 py-8 transition-colors duration-700 ${shadow ? "bg-midnight text-cream" : "bg-cream text-navy"
                }`}
        >
            {/* パーティクルエフェクト */}
            <Particles />

            {/* Shadowモード時の上部バナー */}
            {shadow && (
                <motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="absolute top-6 z-20 px-4"
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 20px 5px rgba(212, 175, 55, 0.5)",
                                "0 0 40px 10px rgba(212, 175, 55, 0.8)",
                                "0 0 20px 5px rgba(212, 175, 55, 0.5)",
                            ],
                            y: [0, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gold/90 text-midnight px-6 py-2 rounded-full shadow-xl text-sm font-semibold border border-gold/40 text-center"
                    >
                        ✨ Shadow Mode Active ✨
                    </motion.div>
                </motion.div>
            )}

            <div className="max-w-md w-full flex flex-col items-center text-center relative z-10">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
                    {shadow ? "もう1つの処方箋" : "本日の処方箋"}
                </h1>
                <p className={`text-xs sm:text-sm mb-6 ${shadow ? "text-cream/80" : "text-navy/70"}`}>
                    {shadow
                        ? "あなたの真逆の性質に効く、もう1冊の処方箋です。"
                        : "あなたの言葉の温度や揺らぎから見立てた、本の処方箋です。"}
                </p>

                {/* メインコンテンツエリア */}
                <AnimatePresence mode="wait">
                    {!revealed ? (
                        /* --- 開封前の封筒表示 --- */
                        <motion.div
                            key="envelope"
                            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 1.2, rotateY: 180 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            {/* キラキラ舞うエフェクト */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(15)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-gold/60 rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            y: [0, -30, 0],
                                            opacity: [0, 1, 0],
                                            scale: [0, 1.5, 0],
                                        }}
                                        transition={{
                                            duration: 2 + Math.random() * 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 2,
                                        }}
                                    />
                                ))}
                            </div>

                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 40px 15px rgba(212, 175, 55, 0.4)',
                                        '0 0 80px 30px rgba(212, 175, 55, 0.7)',
                                        '0 0 40px 15px rgba(212, 175, 55, 0.4)',
                                    ],
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/40 to-sage/30 flex items-center justify-center mb-6 relative"
                            >
                                <motion.span
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-5xl"
                                >
                                    📖
                                </motion.span>

                                {/* 回転する光のリング */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-gold/40"
                                />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`text-xl font-bold mb-2 ${shadow ? "text-cream" : "text-navy"}`}
                            >
                                🎁 運命の一冊が処方されました
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className={`text-sm mb-6 ${shadow ? "text-cream/70" : "text-navy/60"}`}
                            >
                                封印を解いて、あなたの本と出会いましょう
                            </motion.p>

                            <motion.button
                                onClick={handleReveal}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0 20px 40px rgba(212, 175, 55, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-10 py-4 rounded-full font-bold text-base shadow-2xl transition-all relative overflow-hidden ${shadow
                                        ? "bg-gold text-midnight hover:bg-gold/90"
                                        : "bg-navy text-cream hover:bg-midnight"
                                    }`}
                            >
                                <span className="relative z-10">✨ 開封する</span>
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                />
                            </motion.button>
                        </motion.div>
                    ) : (
                        /* --- 開封後の本表示 --- */
                        <motion.div
                            key="book-content"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full"
                        >
                            {loadingShadow ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                        <p className={`text-sm ${shadow ? "text-cream/70" : "text-navy/70"}`}>
                                            裏側の世界から本を探しています...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`rounded-2xl overflow-hidden border p-6 mb-6 ${shadow ? "bg-navy/60 border-navy/50" : "bg-white/80 border-sage/10"
                                    }`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30, rotateY: -15 }}
                                        animate={{
                                            opacity: 1,
                                            y: [0, -10, 0],
                                            rotateY: 0
                                        }}
                                        transition={{
                                            opacity: { delay: 0.2, duration: 0.8 },
                                            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                            rotateY: { delay: 0.2, duration: 0.8 }
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            rotateY: 5,
                                            boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
                                        }}
                                        className="w-full flex justify-center mb-6 relative"
                                    >
                                        {/* 本の後ろのオーラ */}
                                        <motion.div
                                            animate={{
                                                opacity: [0.3, 0.6, 0.3],
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-gradient-to-br from-gold/20 to-sage/20 blur-3xl rounded-full"
                                        />

                                        {displayBook.imageUrl && !imageError ? (
                                            <motion.img
                                                src={displayBook.imageUrl}
                                                alt={`${displayBook.book}の表紙`}
                                                onError={() => setImageError(true)}
                                                initial={{ filter: "blur(10px)" }}
                                                animate={{ filter: "blur(0px)" }}
                                                className="h-64 object-contain rounded-lg shadow-2xl relative z-10"
                                            />
                                        ) : (
                                            <BookCoverPlaceholder title={displayBook.book} />
                                        )}

                                        {/* キラキラエフェクト */}
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-gold rounded-full"
                                                style={{
                                                    left: `${20 + Math.random() * 60}%`,
                                                    top: `${20 + Math.random() * 60}%`,
                                                }}
                                                animate={{
                                                    scale: [0, 2, 0],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.3,
                                                }}
                                            />
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-center mb-6"
                                    >
                                        <motion.h2
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.7, type: "spring" }}
                                            className={`text-2xl font-bold mb-2 ${shadow ? "text-gold" : "text-navy"}`}
                                        >
                                            {displayBook.book}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.9 }}
                                            className={`text-base ${shadow ? "text-cream/80" : "text-navy/60"}`}
                                        >
                                            ✍️ {displayBook.author}
                                        </motion.p>
                                    </motion.div>

                                    <div className={`text-left text-sm leading-relaxed p-4 rounded-lg ${shadow ? "bg-midnight/50" : "bg-cream/50"
                                        }`}>
                                        <p className="mb-3 font-semibold opacity-70">処方箋メモ:</p>
                                        <p className="min-h-[4rem] whitespace-pre-wrap">
                                            {displayedReason}
                                            <span className="animate-pulse">|</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 w-full">
                                {!loadingShadow && (
                                    <button
                                        onClick={() => onDetailClick(displayBook)}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all ${shadow
                                                ? "bg-gold text-midnight hover:bg-gold/90"
                                                : "bg-navy text-cream hover:opacity-90"
                                            }`}
                                    >
                                        詳細を見る
                                    </button>
                                )}

                                <button
                                    onClick={toggleShadow}
                                    disabled={loadingShadow}
                                    className={`w-full py-3 rounded-lg font-semibold border transition-all flex items-center justify-center gap-2 ${shadow
                                            ? "border-gold/30 text-gold hover:bg-gold/10"
                                            : "border-navy/20 text-navy hover:bg-navy/5"
                                        }`}
                                >
                                    {loadingShadow ? "通信中..." : shadow ? "いつもの処方箋に戻る" : "Shadowモードで処方する"}
                                </button>

                                <button
                                    onClick={onBackToHome}
                                    className={`mt-2 text-sm underline opacity-60 hover:opacity-100 ${shadow ? "text-cream" : "text-navy"
                                        }`}
                                >
                                    トップへ戻る
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {shadow && revealed && !loadingShadow && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 mb-4 w-full"
                    >
                        <div className="p-4 rounded-xl border border-gold/30 bg-midnight/60 text-xs text-left">
                            <p className="text-gold/80 mb-2 font-semibold">Shadowモードとは？</p>
                            <p className="text-cream/70 leading-relaxed">
                                あなたの性格診断結果を反転させ、普段なら手に取らないような本をあえて提案するモードです。
                                コンフォートゾーンを抜け出し、新しい視点を得たい時にお試しください。
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
