import React from "react";
import { motion } from "framer-motion";
import { SquareArrowOutUpRight, Wallpaper } from 'lucide-react';

// Plain <a> instead of a router link so the card works in any React app.
const isExternal = (href = "") => /^https?:\/\//.test(href);

const ProfileCard = ({ title, summary, image, link }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group w-72 rounded-2xl bg-slate-950 border border-gray-800 shadow-2xl overflow-hidden p-2 shadow-lime-700/20"
        >
            <div className="h-[30vh] min-h-48 w-full rounded-b-4xl rounded-t-lg overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-bold flex items-center gap-3 text-lime-400">
                    <Wallpaper size={18} /> {title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">{summary}</p>
                {link && (
                    <div className="flex items-center justify-center mt-3">
                        <a
                            href={link}
                            target={isExternal(link) ? "_blank" : undefined}
                            rel={isExternal(link) ? "noopener noreferrer" : undefined}
                            className="px-7 py-1.5 rounded-full bg-lime-600 text-white font-medium shadow hover:bg-lime-500/90 active:scale-95 transition-all duration-150 ease-out flex items-center justify-center gap-2 ring-4 ring-lime-600/30 active:ring-lime-600"
                        >
                            Visit <SquareArrowOutUpRight size={15} />
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ProfileCardList = ({ data = [] }) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center items-center">
            {data.map((item, index) => (
                <ProfileCard key={item.id ?? item.title ?? index} {...item} />
            ))}
        </div>
    );
};

export default ProfileCardList;
