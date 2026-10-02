import React, { useState } from 'react';
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { y: 16, opacity: 0, scale: 0.9 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 260, damping: 22 },
    },
};

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
const getBgColor = (color) => color || "#4a5568";

const AvatarItem = ({ user }) => {
    // Fall back to the initial when the image is missing or fails to load.
    const [broken, setBroken] = useState(false);
    const showImage = user.imageUrl && !broken;

    return (
        <motion.div
            variants={itemVariants}
            className="relative"
            whileHover={{ y: -6, scale: 1.08, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {showImage ? (
                <img
                    src={user.imageUrl}
                    alt={user.name}
                    loading="lazy"
                    draggable="false"
                    className="w-20 h-20 object-cover rounded-full border-2"
                    style={{ borderColor: getBgColor(user.color) }}
                    onError={() => setBroken(true)}
                />
            ) : (
                <div
                    className="w-20 h-20 flex items-center justify-center rounded-full border-4 text-4xl font-bold text-white/60"
                    style={{ backgroundColor: getBgColor(user.color), borderColor: getBgColor(user.color) }}
                >
                    {getInitial(user.name)}
                </div>
            )}
            <motion.span
                className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

const Avatar = ({ users = [] }) => {
    return (
        <div className="font-sans flex flex-col items-center justify-center">
            <motion.div
                className="flex -space-x-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {users.map((user, index) => (
                    <AvatarItem key={user.id ?? user.name ?? index} user={user} />
                ))}
            </motion.div>
        </div>
    );
};

export default Avatar;
