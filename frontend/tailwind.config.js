export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                night: "#0f172a",
                accent: "#6366f1"
            },
            fontFamily: {
                serif: ["'Noto Serif JP'", "serif"]
            },
            boxShadow: {
                "soft-card": "0 18px 45px rgba(15,23,42,0.7)"
            }
        }
    },
    plugins: []
};
