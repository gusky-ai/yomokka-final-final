import { useState } from "react";

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

export default function Diagnosis({ onFinish }) {
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-serif flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-lg p-6 sm:p-8">
                <header className="text-center mb-8">
                    <p className="text-xs tracking-[0.28em] text-slate-500 mb-2">
                        N I G H T &nbsp; D I A G N O S I S
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                        夜の行動診断
                    </h1>
                    <p className="mt-2 text-xs text-slate-600">
                        直感で1〜5のボタンを選んでください。左が「いいえ」、右が「はい」です。
                    </p>
                </header>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {questions.map((q, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4"
                        >
                            <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
                                <span>Q{i + 1}</span>
                                <span className={`font-semibold ${answers[i] !== 3 ? 'text-indigo-600' : ''}`}>
                                    {answers[i]}
                                </span>
                            </div>
                            <p className="text-sm mb-4 text-slate-800">{q}</p>

                            {/* 5ボタンUI */}
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <button
                                        key={value}
                                        onClick={() => handleAnswer(i, value)}
                                        className={`w-12 h-12 rounded-lg font-semibold transition-all ${answers[i] === value
                                                ? 'bg-slate-900 text-white shadow-md scale-105'
                                                : 'border-2 border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                                <span>いいえ</span>
                                <span>はい</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        この結果で進む
                    </button>
                </div>
            </div>
        </div>
    );
}

