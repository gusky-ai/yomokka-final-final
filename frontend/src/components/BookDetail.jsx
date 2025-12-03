import { motion } from "framer-motion";

export default function BookDetail({ data, onBack }) {
    const book = data?.book || "タイトル不明";
    const author = data?.author || "";
    const line = data?.line || "";
    const reason = data?.reason || "";
    const imageUrl = data?.imageUrl || null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-cream font-serif p-6"
        >
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-luxury border border-sage/20">
                {/* 戻るボタン */}
                <button
                    onClick={onBack}
                    className="text-sm text-navy/60 hover:text-navy mb-6 flex items-center gap-1 transition-colors"
                >
                    ← 戻る
                </button>

                {/* 表紙画像 */}
                {imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <img
                            src={imageUrl}
                            alt={`${book}の表紙`}
                            className="h-64 object-contain rounded shadow-md"
                        />
                    </motion.div>
                )}

                {/* タイトル */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-semibold text-navy mb-2 text-center"
                >
                    『{book}』
                </motion.h1>

                {/* 著者 */}
                {author && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-sm text-navy/70 mb-6 text-center"
                    >
                        著：{author}
                    </motion.p>
                )}

                {/* 一文引用 */}
                {line && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-sm sm:text-base italic text-navy/80 mb-8 text-center leading-relaxed"
                    >
                        「{line}」
                    </motion.p>
                )}

                {/* 処方理由 */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="border-t border-sage/20 pt-6"
                >
                    <h2 className="text-sm font-semibold text-navy mb-3">
                        この本を選んだ理由
                    </h2>
                    <p className="text-sm text-navy/80 leading-relaxed">
                        {reason}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
