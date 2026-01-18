import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ToyCard = ({ toy }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const categoryThemes = {
        building_blocks: {
            emoji: "🧱",
            gradient: "from-orange-400 via-red-400 to-yellow-400",
            bgGradient: "from-orange-50 to-red-50",
            accent: "text-orange-600",
            border: "border-orange-200",
        },
        plush: {
            emoji: "🧸",
            gradient: "from-amber-400 via-orange-300 to-yellow-300",
            bgGradient: "from-amber-50 to-orange-50",
            accent: "text-amber-600",
            border: "border-amber-200",
        },
        vehicles: {
            emoji: "🚗",
            gradient: "from-blue-400 via-cyan-400 to-teal-400",
            bgGradient: "from-blue-50 to-cyan-50",
            accent: "text-blue-600",
            border: "border-blue-200",
        },
        puzzles: {
            emoji: "🧩",
            gradient: "from-purple-400 via-pink-400 to-rose-400",
            bgGradient: "from-purple-50 to-pink-50",
            accent: "text-purple-600",
            border: "border-purple-200",
        },
        educational: {
            emoji: "📚",
            gradient: "from-emerald-400 via-green-400 to-teal-400",
            bgGradient: "from-emerald-50 to-green-50",
            accent: "text-emerald-600",
            border: "border-emerald-200",
        },
        outdoor: {
            emoji: "⚽",
            gradient: "from-green-400 via-lime-400 to-yellow-400",
            bgGradient: "from-green-50 to-lime-50",
            accent: "text-green-600",
            border: "border-green-200",
        },
        electronic: {
            emoji: "🎮",
            gradient: "from-indigo-400 via-violet-400 to-purple-400",
            bgGradient: "from-indigo-50 to-violet-50",
            accent: "text-indigo-600",
            border: "border-indigo-200",
        },
        arts_crafts: {
            emoji: "🎨",
            gradient: "from-pink-400 via-rose-400 to-red-400",
            bgGradient: "from-pink-50 to-rose-50",
            accent: "text-pink-600",
            border: "border-pink-200",
        },
    };

    const conditionConfig = {
        excellent: { label: "✨ Excellent", bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300" },
        good: { label: "👍 Good", bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-300" },
        used: { label: "💫 Used", bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" },
        fair: { label: "🔧 Fair", bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
    };

    const theme = categoryThemes[toy.category] || {
        emoji: "🎁",
        gradient: "from-neo-primary-400 via-neo-accent-400 to-neo-primary-300",
        bgGradient: "from-neo-primary-50 to-neo-accent-50",
        accent: "text-neo-primary-600",
        border: "border-neo-primary-200",
    };

    const condition = conditionConfig[toy.condition] || conditionConfig.good;

    // Floating decorations based on category
    const floatingEmojis = {
        building_blocks: ["🔴", "🟡", "🟢"],
        plush: ["💕", "🌟", "💫"],
        vehicles: ["🏎️", "💨", "🛞"],
        puzzles: ["🔮", "✨", "🎯"],
        educational: ["📖", "✏️", "🎓"],
        outdoor: ["🌳", "☀️", "🌈"],
        electronic: ["⚡", "🔋", "💡"],
        arts_crafts: ["🖌️", "✂️", "🎭"],
    };

    const decorations = floatingEmojis[toy.category] || ["⭐", "🎈", "🎀"];

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full">
            <div className={`relative h-full rounded-3xl bg-gradient-to-br ${theme.bgGradient} border-2 ${theme.border} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group`}>

                {/* Floating Decorations - CSS animations instead of framer-motion */}
                <span className="absolute top-3 right-3 text-lg opacity-60 group-hover:opacity-100 animate-bounce-slow">
                    {decorations[0]}
                </span>
                <span className="absolute top-8 right-10 text-sm opacity-40 group-hover:opacity-80 animate-bounce-slower">
                    {decorations[1]}
                </span>
                <span className="absolute bottom-24 left-3 text-sm opacity-30 group-hover:opacity-70 animate-bounce-slow">
                    {decorations[2]}
                </span>

                <div className="p-5 h-full flex flex-col">
                    {/* Toy Icon Area */}
                    <div className="relative mb-4">
                        <div
                            className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                            {/* Pattern overlay */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 20% 20%, white 2px, transparent 2px),
                                                      radial-gradient(circle at 80% 80%, white 2px, transparent 2px),
                                                      radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
                                    backgroundSize: '30px 30px, 30px 30px, 15px 15px'
                                }}></div>
                            </div>
                            <span className="text-7xl filter drop-shadow-lg relative z-10 animate-pulse-subtle">
                                {theme.emoji}
                            </span>
                        </div>

                        {/* Status Badge - Top Right */}
                        <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium text-gray-600 capitalize">{toy.status}</span>
                        </div>
                    </div>

                    {/* Toy Name */}
                    <h3 className={`text-xl font-bold ${theme.accent} mb-2 line-clamp-2 min-h-[3rem] font-display leading-tight`}>
                        {toy.toyName}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {toy.description}
                    </p>

                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${condition.bg} ${condition.text} ring-1 ${condition.ring}`}>
                            {condition.label}
                        </span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 text-gray-700 ring-1 ring-gray-200">
                            👶 Age {toy.ageRange}
                        </span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-grow"></div>

                    {/* Bottom Section */}
                    <div className="space-y-3">
                        {/* Category & Date */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className={`flex items-center gap-1.5 font-medium ${theme.accent}`}>
                                {theme.emoji} {toy.category?.replace(/_/g, ' ')}
                            </span>
                            <span className="flex items-center gap-1">
                                📅 {new Date(toy.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => user ? null : navigate('/login')}
                            className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2`}>
                            <span>{user ? 'View Details' : 'Request'}</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </button>
                    </div>
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default ToyCard;
