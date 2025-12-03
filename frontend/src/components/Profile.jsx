import { useState } from "react";
import { motion } from "framer-motion";

const interestTags = [
    "文学", "ビジネス", "自己啓発", "ミステリー",
    "SF・ファンタジー", "歴史", "哲学", "エッセイ",
    "詩・短歌", "科学", "心理学", "経済"
];

export default function Profile({ onBack }) {
    const [mbti, setMbti] = useState("INFP");
    const [selectedTags, setSelectedTags] = useState(["文学", "哲学"]);
    const [saved, setSaved] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSave = () => {
        // localStorageに保存（本来はバックエンドへ送信）
        localStorage.setItem('fateful_book_profile', JSON.stringify({
            mbti,
            interests: selectedTags
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-cream text-navy font-serif p-6"
        >
            <div className="max-w-2xl mx-auto">
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
                            Your Profile
                        </p>
                        <h1 className="text-3xl font-bold text-navy mb-2">プロフィール</h1>
                        <p className="text-sm text-navy/70">
                            あなたの性格と興味を設定して、より良い処方を受けましょう。
                        </p>
                    </motion.div>
                </div>

                {/* プロフィール設定 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-white rounded-3xl p-8 shadow-luxury border border-sage/20"
                >
                    {/* MBTI設定 */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-navy mb-3">
                            性格タイプ（MBTI）
                        </label>
                        <input
                            type="text"
                            value={mbti}
                            onChange={(e) => setMbti(e.target.value.toUpperCase())}
                            maxLength={4}
                            className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-sage/50 font-semibold text-center text-lg"
                            placeholder="例: INFP"
                        />
                        <p className="text-xs text-navy/60 mt-2">
                            ※診断を受けると自動で設定されます
                        </p>
                    </div>

                    {/* 興味タグ */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-navy mb-3">
                            興味のあるジャンル
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {interestTags.map((tag) => (
                                <motion.button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full text-sm transition-all ${selectedTags.includes(tag)
                                            ? "bg-sage text-white shadow-md"
                                            : "bg-cream border border-sage/30 text-navy/70 hover:border-sage"
                                        }`}
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* 保存ボタン */}
                    <div className="flex justify-end">
                        <motion.button
                            onClick={handleSave}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all ${saved
                                    ? "bg-gold text-white"
                                    : "bg-navy text-cream hover:bg-midnight"
                                }`}
                        >
                            {saved ? "✓ 保存しました" : "保存する"}
                        </motion.button>
                    </div>
                </motion.div>

                {/* 説明文 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-6 p-4 bg-white/50 rounded-2xl border border-sage/10"
                >
                    <p className="text-xs text-navy/70 leading-relaxed">
                        💡 設定したプロフィールは、次回以降の診断や処方の精度向上に役立ちます。
                        現在はブラウザに保存されますが、将来的にはアカウント機能を追加予定です。
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
