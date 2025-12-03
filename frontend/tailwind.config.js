export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // 新デザインシステム: Fateful Book
                navy: "#1e293b",           // 深いネイビー
                midnight: "#0f172a",       // ミッドナイトブルー
                cream: "#fafaf9",          // オフホワイト
                gold: "#d4af37",           // アクセント用ゴールド
                sage: "#86a789",           // アクセント用グリーン（セージ）

                // 旧カラー（互換性のため一時的に保持）
                night: "#0f172a",
                accent: "#6366f1"
            },
            fontFamily: {
                serif: ["'Noto Serif JP'", "'Shippori Mincho'", "serif"],
                sans: ["'Noto Sans JP'", "sans-serif"]
            },
            boxShadow: {
                "soft-card": "0 18px 45px rgba(15,23,42,0.7)",
                "luxury": "0 4px 30px rgba(212, 175, 55, 0.1)"
            },
            animation: {
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "fade-in": "fadeIn 0.8s ease-out"
            },
            keyframes: {
                fadeInUp: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(20px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)"
                    }
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                }
            }
        }
    },
    plugins: []
};
