import React, { useContext, useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiClient } from "../../utils/apiClient";

const ToyCard = ({ toy, onClaimed }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

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

    // Handle claiming a toy
    const handleClaim = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Check if mock user - simulate claim for demo
        if (user.uid === 'mock-user-id') {
            setIsClaiming(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            setClaimSuccess(true);
            setIsClaiming(false);
            if (onClaimed) onClaimed(toy.toyName);
            return;
        }

        setIsClaiming(true);
        setClaimError(null);

        try {
            const response = await apiClient.post(`/toys/${encodeURIComponent(toy.toyName)}/claim`);
            if (response.toy) {
                setClaimSuccess(true);
                if (onClaimed) onClaimed(toy.toyName);
            }
        } catch (error) {
            console.error('Failed to claim toy:', error);
            setClaimError(error.message || 'Failed to claim toy. Please try again.');
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <>
            <motion.div
                whileHover={!showModal ? { y: -8, scale: 1.02 } : {}}
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
                                <span className={`w-2 h-2 rounded-full animate-pulse ${toy.status === 'available' ? 'bg-green-500' :
                                        toy.status === 'reserved' ? 'bg-yellow-500' :
                                            'bg-gray-500'
                                    }`}></span>
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
                                onClick={() => user ? setShowModal(true) : navigate('/login')}
                                disabled={toy.status !== 'available'}
                                className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 ${toy.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <span>{user ? (toy.status === 'available' ? 'View Details' : 'Not Available') : 'Login to Claim'}</span>
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

            {/* Details & Claim Modal - Rendered outside the hover container */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => !isClaiming && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header with Image */}
                            <div className={`relative h-48 bg-gradient-to-br ${theme.gradient} rounded-t-3xl overflow-hidden`}>
                                {images.length > 0 ? (
                                    <img
                                        src={`data:image/jpeg;base64,${images[0].imageData}`}
                                        alt={toy.toyName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-8xl">{categoryEmoji}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    ✕
                                </button>
                                <div className="absolute bottom-4 left-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${toy.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                    <span className="text-sm font-medium capitalize">{toy.status}</span>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-neo-primary-800 mb-2">{toy.toyName}</h2>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${condition.bg} ${condition.text}`}>
                                        {condition.label}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-neo-bg-100 text-neo-bg-700">
                                        👶 Age {toy.ageRange}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-neo-bg-100 text-neo-bg-700">
                                        {categoryEmoji} {toy.category?.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-neo-bg-600 mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{toy.description}</p>
                                </div>

                                <div className="mb-6 p-4 bg-neo-bg-100 rounded-xl">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neo-bg-600">Listed on</span>
                                        <span className="font-medium">{new Date(toy.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Success Message */}
                                {claimSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center"
                                    >
                                        <span className="text-2xl mb-2 block">🎉</span>
                                        <p className="font-bold">Toy Claimed Successfully!</p>
                                        <p className="text-sm mt-1">Check your Dashboard to see your claimed toys.</p>
                                    </motion.div>
                                )}

                                {/* Error Message */}
                                {claimError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center"
                                    >
                                        <p className="font-medium">{claimError}</p>
                                    </motion.div>
                                )}

                                {/* Claim Button */}
                                {!claimSuccess && toy.status === 'available' && (
                                    <button
                                        onClick={handleClaim}
                                        disabled={isClaiming || toy.ownerId === user?.uid}
                                        className={`w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 ${(isClaiming || toy.ownerId === user?.uid) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isClaiming ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Claiming...</span>
                                            </>
                                        ) : toy.ownerId === user?.uid ? (
                                            <span>This is your toy</span>
                                        ) : (
                                            <>
                                                <span>🎁</span>
                                                <span>Claim This Toy</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                {claimSuccess && (
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-neo-primary-500 to-neo-primary-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Go to Dashboard →
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ToyCard;
