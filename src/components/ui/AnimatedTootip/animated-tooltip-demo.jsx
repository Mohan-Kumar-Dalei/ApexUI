import React from "react";
import { AnimatedTooltip } from "./animated-tooltip";
const people = [
    {
        id: 1,
        name: "Aarav Mehta",
        designation: "Frontend Architect",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
        id: 2,
        name: "Riya Kapoor",
        designation: "Visual Designer",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        id: 3,
        name: "Devansh Verma",
        designation: "AI Engineer",
        image: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
        id: 4,
        name: "Saanvi Desai",
        designation: "UX Strategist",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 5,
        name: "Ishaan Khurana",
        designation: "DevOps Specialist",
        image: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    {
        id: 6,
        name: "Meher Shah",
        designation: "Interaction Designer",
        image: "https://randomuser.me/api/portraits/women/66.jpg",
    },
];

export default function AnimatedTooltipDemo() {
    return (
        <div className="flex flex-row items-center justify-center">
            <AnimatedTooltip items={people} />
        </div>
    );
}
