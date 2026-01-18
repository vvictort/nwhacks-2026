import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ToyCard from "../components/molecules/ToyCard";
import { publicApiClient } from "../utils/apiClient";

const Browse = () => {
    const [toys, setToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchToys();
    }, []);

    const fetchToys = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch from backend GET /toys endpoint
            const data = await publicApiClient.get('/toys');
            setToys(data.toys || []);
        } catch (err) {
            console.error('Error fetching toys:', err);
            setError(err?.message || 'Failed to load toys. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12">
                <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-neo-primary-900 via-neo-accent-400 to-neo-primary-300 bg-clip-text text-transparent mb-4">
                    Browse Free Toys
                </h1>
                <p className="text-neo-bg-600 text-lg max-w-2xl mx-auto">
                    Discover wonderful toys for your children. All items are free, verified, and ready to bring joy to your family.
                </p>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="text-6xl mb-4">
                            🎁
                        </motion.div>
                        <p className="text-neo-bg-600 text-lg">Loading toys...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center">
                    <div className="text-4xl mb-3">😞</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchToys}
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </motion.div>
            )}

            {/* Toys Grid */}
            {!loading && !error && (
                <>
                    {toys.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20">
                            <div className="text-6xl mb-4">🎈</div>
                            <h3 className="text-2xl font-bold text-neo-bg-700 mb-2">No toys available yet</h3>
                            <p className="text-neo-bg-500">Check back soon for new listings!</p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-neo-bg-600">
                                    Showing <span className="font-bold text-neo-primary-700">{toys.length}</span> available toys
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {toys.map((toy, index) => (
                                    <motion.div
                                        key={toy.toyName}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}>
                                        <ToyCard toy={toy} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Browse;
