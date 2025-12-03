import { useState } from "react";
import { motion } from "framer-motion";

const questions = [
    "一人で過ごすとエネルギーが回復する",
    "話すより聞くことの方が多い",
    "行動する前にまず情報を集める",
    "説明書やルールを読むことに抵抗はない",
    "抽象よりも具体的な指示があると安心する",
    "現実的な話題が好きだと感じる",
    "まず感情よりも解決策を考えがちだ",
    "モノを選ぶときはスペックや性能を重視する",
    "話は結論から聞きたいと思う",
    "予定通りに物事が進むと気持ちが楽だ",
    "締切より前に動き出す方だと思う",
    "急な予定変更はあまり得意ではない"
];

export default function Diagnosis({ onFinish, onBack }) {
    const [answers, setAnswers] = useState(Array(12).fill(3));

    const sum = (s, e) => answers.slice(s, e).reduce((a, b) => a + b, 0);

    const handleSubmit = () => {
        const type =
            (sum(0, 3) > 9 ? "I" : "E") +
            (sum(3, 6) > 9 ? "S" : "N") +
            (sum(6, 9) > 9 ? "T" : "F") +
            (sum(9, 12) > 9 ? "J" : "P");
        onFinish(type);
    };

    const handleAnswer = (questionIndex, value) => {
        const next = [...answers];
        next[questionIndex] = value;
        setAnswers(next);
    };

    return (
        <div className="min-h-screen bg-cream text-navy font-serif flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl rounded-3xl bg-white border border-sage/20 shadow-luxury p-6 sm:p-8 relative"
            >
                {/* 戻るボタン */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 text-sm text-navy/60 hover:text-navy transition-colors flex items-center gap-1"
                    >
                        <span>←</span> 戻る
                    </button>
                )}

                <header className="text-center mb-8 mt-4">
                    <p className="text-xs tracking-[0.28em] text-navy/60 mb-2 uppercase">
                        Personality Diagnosis
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-navy">
                        性格診断
                    </h1>
                    <p className="mt-2 text-xs text-navy/70">
                        直感で1〜5のボタンを選んでください。左が「いいえ」、右が「はい」です。
                    </p>
                </header>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {questions.map((q, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="rounded-2xl bg-cream/60 border border-sage/10 px-4 py-4"
                        >
                            <div className="flex items-center justify-between mb-2 text-xs text-navy/60">
                                <span>Q{i + 1}</span>
                                <span className={`font-semibold ${answers[i] !== 3 ? 'text-sage' : ''}`}>
                                    {answers[i]}
                                </span>
                            </div>
                            <p className="text-sm mb-4 text-navy">{q}</p>

                            {/* 5ボタンUI */}
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <button
                                        key={value}
                                        onClick={() => handleAnswer(i, value)}
                                        className={`w-12 h-12 rounded-lg font-semibold transition-all ${answers[i] === value
                                            ? 'bg-navy text-cream shadow-md scale-105'
                                            : 'border-2 border-sage/30 text-navy/40 hover:border-sage hover:text-navy'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between text-[10px] text-navy/40 mt-2 px-1">
                                <span>いいえ</span>
                                <span>はい</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center pt-6">
                    <motion.button
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-2.5 rounded-full bg-navy text-cream text-sm font-semibold hover:bg-midnight transition-colors shadow-lg"
                    >
                        この結果で進む
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
