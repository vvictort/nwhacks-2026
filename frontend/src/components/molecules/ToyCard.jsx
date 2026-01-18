import React, { useContext, useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ToyCard = ({ toy }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoadingImages, setIsLoadingImages] = useState(true);

    // Fetch images for this toy
    useEffect(() => {
        const fetchImages = async () => {
            if (!toy.toyName) {
                setIsLoadingImages(false);
                return;
            }

            try {
                setIsLoadingImages(true);
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${API_BASE_URL}/toys/${encodeURIComponent(toy.toyName)}/images`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Treat 404 as no images (toy might not have images yet)
                if (response.status === 404) {
                    setImages([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    setImages(data.images);
                }
            } catch (error) {
                console.error("Failed to fetch toy images:", error);
                // Don't throw, just leave images empty for fallback
                setImages([]);
            } finally {
                setIsLoadingImages(false);
            }
        };

        fetchImages();
    }, [toy.toyName]);

    // Auto-advance slideshow
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const goToNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Consistent theme using neo-primary and neo-accent colors
    const theme = {
        gradient: "from-neo-primary-400 via-neo-primary-300 to-neo-accent-300",
        bgGradient: "from-neo-bg-100 to-neo-bg-50",
        accent: "text-neo-primary-700",
        border: "border-neo-primary-100",
    };

    // Category emoji mapping
    const categoryEmojis = {
        building_blocks: "🧱",
        "building blocks": "🧱",
        plush: "🧸",
        vehicles: "🚗",
        puzzles: "🧩",
        educational: "📚",
        outdoor: "⚽",
        electronic: "🎮",
        arts_crafts: "🎨",
        "arts crafts": "🎨",
    };

    // Get emoji for category (normalize to lowercase for matching)
    const normalizedCategory = toy.category?.toLowerCase()?.replace(/\s+/g, '_') || '';
    const categoryEmoji = categoryEmojis[normalizedCategory] || categoryEmojis[toy.category?.toLowerCase()] || "🎁";

    const conditionConfig = {
        excellent: { label: "✨ Excellent", bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300" },
        good: { label: "👍 Good", bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-300" },
        used: { label: "💫 Used", bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" },
        fair: { label: "🔧 Fair", bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
    };

    const condition = conditionConfig[toy.condition] || conditionConfig.good;

    // Floating decorations
    const decorations = ["💜", "✨", "🎀"];

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
                    {/* Toy Image/Icon Area */}
                    <div className="relative mb-4">
                        <div
                            className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-300`}>

                            {/* Image Slideshow or Fallback */}
                            {isLoadingImages ? (
                                // Loading state
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            ) : images.length > 0 ? (
                                // Image slideshow
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImageIndex}
                                            src={`data:image/jpeg;base64,${images[currentImageIndex].imageData}`}
                                            alt={`${toy.toyName} - Image ${currentImageIndex + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>

                                    {/* Slideshow controls - only show if multiple images */}
                                    {images.length > 1 && (
                                        <>
                                            {/* Navigation buttons */}
                                            <button
                                                onClick={goToPrevImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                onClick={goToNextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                                            >
                                                ›
                                            </button>

                                            {/* Dots indicator */}
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                                {images.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentImageIndex(idx);
                                                        }}
                                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${idx === currentImageIndex
                                                            ? "bg-white scale-125"
                                                            : "bg-white/50 hover:bg-white/75"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                // Fallback: Show emoji when no images
                                <>
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
                                        {categoryEmoji}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Status Badge - Top Right */}
                        <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1.5 z-10">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium text-gray-600 capitalize">{toy.status}</span>
                        </div>

                        {/* Image count badge - only show if has images */}
                        {images.length > 0 && (
                            <div className="absolute -bottom-2 -left-2 bg-white rounded-full px-2 py-1 shadow-md flex items-center gap-1 z-10">
                                <span className="text-xs font-medium text-gray-600">📷 {images.length}</span>
                            </div>
                        )}
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
                                {categoryEmoji} {toy.category?.replace(/_/g, ' ')}
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
