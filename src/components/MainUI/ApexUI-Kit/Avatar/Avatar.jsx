import React from 'react';
import { motion } from "framer-motion";
const Avatar = ({ users }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    // Helper to get initials and fallback color
    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";
    const getBgColor = (color) => color || "#4a5568";

    return (
        <div className="font-sans flex flex-col items-center justify-center">
            <motion.div
                className="flex -space-x-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {users.map((user, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user.name}
                                    className="w-20 h-20 object-cover rounded-full border-2"
                                    style={{ borderColor: getBgColor(user.color) }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = ""; }}
                                />
                            ) : (
                                <div
                                    className="w-20 h-20 flex items-center justify-center rounded-full border-4 text-5xl font-bold text-white/40"
                                    style={{ backgroundColor: getBgColor(user.color), borderColor: getBgColor(user.color) }}
                                >
                                    {getInitial(user.name)}
                                </div>
                            )}
                            <motion.span
                                className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Avatar;