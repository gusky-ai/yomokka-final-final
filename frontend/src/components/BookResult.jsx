import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invertMBTI } from "../utils/mbti";
import BookCoverPlaceholder from "./BookCoverPlaceholder";

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
        imageUrl: data?.imageUrl || null
    };

    // Shadowボタン押下時の処理
    const toggleShadow = async () => {
        if (!shadow && !shadowBook) {
            // Shadow用の本を取得
            setLoadingShadow(true);
            try {
                const invertedPersonality = invertMBTI(data?.personality);
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
    }, [revealed, displayBook.reason]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`min-h-screen font-serif flex items-center justify-center px-4 py-8 transition-colors duration-700 ${shadow ? "bg-midnight text-cream" : "bg-cream text-navy"
                }`}
        >
            <div
                className={`w-full max-w-xl rounded-3xl border shadow-luxury overflow-hidden relative ${shadow
                    ? "bg-midnight/90 border-navy/50"
                    : "bg-white border-sage/20"
                    }`}
            >
                {/* 光のにじみエフェクト */}
                <div className="pointer-events-none absolute inset-0 opacity-30">
                    <div
                        className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl ${shadow ? "bg-gold/20" : "bg-sage/20"
                            }`}
                    />
                    <div
                        className={`absolute bottom-0 right-0 w-56 h-56 rounded-full blur-3xl ${shadow ? "bg-navy/40" : "bg-gold/10"
                            }`}
                    />
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                    <p className={`text-[11px] tracking-[0.28em] uppercase mb-2 ${shadow ? "text-cream/60" : "text-navy/60"}`}>
                        Prescription
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
                        {shadow ? "もう1つの処方箋" : "本日の処方箋"}
                    </h1>
                    <p className={`text-xs sm:text-sm mb-6 ${shadow ? "text-cream/80" : "text-navy/70"}`}>
                        {shadow
                            ? "あなたの真逆の性質に効く、もう1冊の処方箋です。"
                            : "あなたの言葉の温度や揺らぎから見立てた、本の処方箋です。"}
                    </p>

                    {/* 封筒/開封前の表示 */}
                    <AnimatePresence mode="wait">
                        {!revealed ? (
                            <motion.div
                                key="envelope"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                {/* 光の球体 */}
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            '0 0 40px 15px rgba(212, 175, 55, 0.4)',
                                            '0 0 60px 25px rgba(212, 175, 55, 0.6)',
                                            '0 0 40px 15px rgba(212, 175, 55, 0.4)',
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/40 to-sage/30 flex items-center justify-center mb-6"
                                >
                                    <span className="text-4xl">📖</span>
                                </motion.div>

                                <p className={`text-lg font-semibold mb-4 ${shadow ? "text-cream" : "text-navy"}`}>
                                    運命の一冊が処方されました
                                </p>

                                <motion.button
                                    onClick={handleReveal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 py-3 rounded-full font-semibold text-sm shadow-xl transition-all ${shadow
                                            ? "bg-gold text-midnight hover:bg-gold/90"
                                            : "bg-navy text-cream hover:bg-midnight"
                                        }`}
                                >
                                    開封する
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* 開封後: 本の表示 */
                            <motion.div
                                key="book"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {loadingShadow ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                            <p className={`text-sm ${shadow ? "text-cream/70" : "text-navy/70"}`}>
                                                別の本を探しています...
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`rounded-2xl overflow-hidden border ${shadow
                                            ? "bg-navy/60 border-navy/50"
                                            : "bg-cream border-sage/10"
                                            }`}
                                    >
                                        {/* 表紙画像 */}
                                        <motion.div
                                            initial={{ opacity: 0, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, filter: "blur(0px)" }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                            className="w-full flex justify-center py-6 px-4"
                                        >
                                            {displayBook.imageUrl && !imageError ? (
                                                <img
                                                    src={displayBook.imageUrl}
                                                    alt={`${displayBook.book}の表紙`}
                                                    onError={() => setImageError(true)}
                                                    className="h-56 object-contain rounded shadow-md"
                                                />
                                            ) : (
                                                <BookCoverPlaceholder
                                                    title={displayBook.book}
                                                    author={displayBook.author}
                                                />
                                            )}
                                        </motion.div>

                                        <div className="px-4 pb-4">
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                                className={`text-lg font-semibold mb-1 ${shadow ? "text-cream" : "text-navy"}`}
                                            >
                                                『{displayBook.book}』
                                            </motion.p>
                                            {displayBook.author && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6, duration: 0.5 }}
                                                    className={`text-xs mb-3 ${shadow ? "text-cream/60" : "text-navy/60"}`}
                                                >
                                                    著：{displayBook.author}
                                                </motion.p>
                                            )}
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7, duration: 0.5 }}
                                                className={`text-sm sm:text-base mb-4 italic leading-relaxed ${shadow ? "text-cream/90" : "text-navy/80"}`}
                                            >
                                                「{displayBook.line}」
                                            </motion.p>

                                            {/* タイプライター効果のreasonテキスト */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.9, duration: 0.5 }}
                                                className={`text-sm leading-relaxed mb-4 ${shadow ? "text-cream/80" : "text-navy/70"}`}
                                            >
                                                {displayedReason}
                                                <span className="animate-pulse">|</span>
                                            </motion.div>

                                            {/* 続きを読むボタン */}
                                            {displayedReason === displayBook.reason && (
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    onClick={() => onDetailClick && onDetailClick(displayBook)}
                                                    className={`text-sm font-semibold transition-colors ${shadow
                                                        ? "text-gold hover:text-gold/80"
                                                        : "text-sage hover:text-sage/80"
                                                        }`}
                                                >
                                                    続きを読む →
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Shadowボタン & トップに戻るボタン */}
                    {revealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-6 flex justify-between items-center"
                        >
                            {onBackToHome && (
                                <button
                                    onClick={onBackToHome}
                                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${shadow
                                            ? "border border-cream/20 text-cream/80 hover:bg-cream/10"
                                            : "border border-navy/30 text-navy/70 hover:bg-navy/5"
                                        }`}
                                >
                                    トップに戻る
                                </button>
                            )}

                            <button
                                onClick={toggleShadow}
                                disabled={loadingShadow}
                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${shadow
                                    ? "bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream/80 hover:bg-cream/20"
                                    : "border border-navy/30 text-navy/70 hover:border-navy hover:bg-navy/5"
                                    } ${loadingShadow ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loadingShadow ? "読み込み中..." : shadow ? "通常に戻る" : "Shadow"}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
