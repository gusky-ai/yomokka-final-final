import { motion } from "framer-motion";

// モックデータ
const mockHistory = [
    {
        id: 1,
        date: "2024年11月28日",
        book: "世界の終りとハードボイルド・ワンダーランド",
        author: "村上春樹",
        worry: "最近、現実と向き合うのがつらい...",
        mbti: "INFP"
    },
    {
        id: 2,
        date: "2024年11月15日",
        book: "嫌われる勇気",
        author: "岸見一郎、古賀史健",
        worry: "他人の目ばかり気にしてしまう",
        mbti: "ISFJ"
    },
    {
        id: 3,
        date: "2024年10月30日",
        book: "夜は短し歩けよ乙女",
        author: "森見登美彦",
        worry: "もっと冒険したい気持ちがある",
        mbti: "ENFP"
    }
];

export default function History({ onBack }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-cream text-navy font-serif p-6"
        >
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-sm text-navy/60 hover:text-navy mb-4 flex items-center gap-1 transition-colors"
                    >
                        ← トップへ戻る
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <p className="text-xs tracking-[0.28em] text-navy/60 mb-2 uppercase">
                            Medical Record
                        </p>
                        <h1 className="text-3xl font-bold text-navy mb-2">お薬手帳</h1>
                        <p className="text-sm text-navy/70">
                            これまでに処方された本の記録です。
                        </p>
                    </motion.div>
                </div>

                {/* 履歴リスト */}
                {mockHistory.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-12 text-center border border-sage/20"
                    >
                        <p className="text-navy/60">まだ処方がありません</p>
                        <p className="text-sm text-navy/50 mt-2">
                            診断を受けて、運命の一冊に出会いましょう。
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {mockHistory.map((record, index) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-sage/20 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-navy/50 mb-1">{record.date}</p>
                                        <h3 className="text-lg font-semibold text-navy">
                                            『{record.book}』
                                        </h3>
                                        <p className="text-sm text-navy/70">著：{record.author}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-sage/10 text-sage text-xs rounded-full">
                                        {record.mbti}
                                    </span>
                                </div>

                                <div className="border-t border-sage/10 pt-3 mt-3">
                                    <p className="text-xs text-navy/60 mb-1">そのときの悩み：</p>
                                    <p className="text-sm text-navy/80 italic">
                                        「{record.worry}」
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
