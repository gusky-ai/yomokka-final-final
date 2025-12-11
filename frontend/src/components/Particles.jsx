import { motion } from "framer-motion";

export default function Particles() {
    const particleCount = 30;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(particleCount)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-sage/40 to-gold/30"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: '-10px',
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        y: [0, -window.innerHeight - 100],
                        x: [0, (Math.random() - 0.5) * 100],
                        opacity: [0, 0.8, 0.8, 0],
                        scale: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
