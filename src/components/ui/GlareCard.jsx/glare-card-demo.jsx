import { GlareCard } from "./glare-card.jsx";
import bgHexa from "../../../assets/bg-hexa.jpg";

export default function GlareCardDemo() {
    return (
        <GlareCard className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-[#181825] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group group-hover:scale-100 transition-transform duration-300 ease-in-out">
            {/* Background Image */}
            <img
                src={bgHexa}
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none z-0"
                draggable="false"
            />
            <div className="flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-br from-[#23233a] to-[#181825] border-2 border-[#a855f7]/60 shadow-xl mb-4 z-10 group">
                <span className="text-5xl font-extrabold text-[#a855f7] drop-shadow-[0_2px_12px_#a855f7aa]">A</span>
            </div>
            <p className="text-slate-200 font-extrabold text-2xl mt-2 tracking-wide z-10">ApexUI</p>
        </GlareCard>
    );
}
