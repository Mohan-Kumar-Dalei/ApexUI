/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { SquareArrowOutUpRight, Wallpaper } from 'lucide-react';
import { NavLink } from "react-router-dom";
const ProfileCard = ({ title, summary, image, link }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-72 rounded-2xl bg-slate-950 border border-gray-800 shadow-2xl overflow-hidden p-2 shadow-lime-700/20"
        >
            {/* Image */}
            <div className="h-[30vh] w-full rounded-b-4xl rounded-t-lg  overflow-hidden">
                <motion.img
                    src={image}
                    alt={title}
                    className="w-full object-cover h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                />
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-bold flex items-center gap-3 text-[var(--color-pages-side-active-text)]">
                    <Wallpaper size={18} /> {title}
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed">
                    {summary}
                </p>

                {/* Stats + Button */}
                <div className="flex items-center justify-center mt-3 transition-all duration-150 ease-in-out">
                    {/* Visit Button */}
                    <NavLink
                        to={link}
                        className="px-7 py-1.5 rounded-full bg-lime-600 text-white font-medium shadow hover:bg-lime-500/90 active:scale-95 transition-all duration-150 ease-in-out flex items-center justify-center gap-2 ring-4 ring-lime-600/30 active:ring-lime-600"
                    >
                        Visit <SquareArrowOutUpRight size={15} />
                    </NavLink>
                </div>
            </div>
        </motion.div>
    );
};

// Wrapper to map array of objects
const ProfileCardList = ({ data }) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center items-center">
            {data.map((item, index) => (
                <ProfileCard key={index} {...item} />
            ))}
        </div>
    );
};

export default ProfileCardList;
