import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ToyCard from "../components/molecules/ToyCard";
import NeuSelect from "../components/atoms/NeuSelect";
import { publicApiClient } from "../utils/apiClient";
import { useAuth } from "../hooks/useAuth";

// Hardcoded mock toys for demo/when backend is unavailable
const mockBrowseToys = [
    {
        id: 'browse-1',
        name: 'LEGO City Fire Station',
        description: 'Complete fire station set with 3 minifigures, fire truck, and helicopter. All pieces included!',
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        category: 'building_blocks',
        condition: 'excellent',
        ageRange: '5-7',
        location: 'Vancouver, BC',
        donorName: 'Sarah M.',
    },
    {
        id: 'browse-2',
        name: 'Giant Teddy Bear',
        description: 'Soft and cuddly 4-foot teddy bear. Perfect for hugs! Recently cleaned.',
        imageUrl: 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400',
        category: 'plush',
        condition: 'good',
        ageRange: '0-2',
        location: 'Burnaby, BC',
        donorName: 'Mike T.',
    },
    {
        id: 'browse-3',
        name: 'Hot Wheels Track Set',
        description: 'Massive track set with loops, jumps, and launcher. Includes 15 cars!',
        imageUrl: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400',
        category: 'vehicles',
        condition: 'good',
        ageRange: '5-7',
        location: 'Richmond, BC',
        donorName: 'David K.',
    },
    {
        id: 'browse-4',
        name: 'Wooden Train Set',
        description: 'Classic wooden train set compatible with major brands. 50+ pieces!',
        imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
        category: 'vehicles',
        condition: 'excellent',
        ageRange: '3-4',
        location: 'Surrey, BC',
        donorName: 'Emma L.',
    },
    {
        id: 'browse-5',
        name: 'Kids Chemistry Set',
        description: 'Safe and fun chemistry experiments for young scientists. Adult supervision recommended.',
        imageUrl: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=400',
        category: 'educational',
        condition: 'good',
        ageRange: '8-12',
        location: 'Coquitlam, BC',
        donorName: 'Dr. Chen',
    },
    {
        id: 'browse-6',
        name: 'Nintendo Switch with Games',
        description: 'Nintendo Switch console with Mario Kart and Zelda. All accessories included!',
        imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
        category: 'electronic',
        condition: 'excellent',
        ageRange: '8-12',
        location: 'Vancouver, BC',
        donorName: 'Gaming Dad',
    },
    {
        id: 'browse-7',
        name: 'Art Supply Mega Box',
        description: 'Crayons, markers, paints, brushes, paper - everything a young artist needs!',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        category: 'arts_crafts',
        condition: 'good',
        ageRange: '3-4',
        location: 'North Van, BC',
        donorName: 'Creative Mom',
    },
    {
        id: 'browse-8',
        name: 'Soccer Goal & Ball Set',
        description: 'Portable soccer goal with net and official size ball. Great for backyard fun!',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
        category: 'outdoor',
        condition: 'good',
        ageRange: '5-7',
        location: 'Langley, BC',
        donorName: 'Coach Pete',
    },
    {
        id: 'browse-9',
        name: '1000-Piece Disney Puzzle',
        description: 'Beautiful Disney castle puzzle. All pieces verified complete!',
        imageUrl: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400',
        category: 'puzzles',
        condition: 'excellent',
        ageRange: '8-12',
        location: 'Delta, BC',
        donorName: 'Puzzle Queen',
    },
];

const Browse = () => {
    const { user } = useAuth();
    const [toys, setToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');
    const [selectedAge, setSelectedAge] = useState('all');

    // Check if this is a mock/demo user
    const isMockUser = user?.uid === 'mock-user-id';

    useEffect(() => {
        fetchToys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMockUser]);

    const fetchToys = async () => {
        // If mock user, use hardcoded toys
        if (isMockUser) {
            setToys(mockBrowseToys);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch from backend GET /toys endpoint
            const data = await publicApiClient.get('/toys');
            setToys(data.toys || []);
        } catch (err) {
            console.error('Error fetching toys:', err);

            // If backend fails, fall back to mock data for better UX
            console.log('Falling back to mock data...');
            setToys(mockBrowseToys);
            setError(null); // Clear error since we have fallback data
        } finally {
            setLoading(false);
        }
    };

    // Filter toys based on selected filters
    const filteredToys = toys.filter(toy => {
        const categoryMatch = selectedCategory === 'all' || toy.category === selectedCategory;
        const conditionMatch = selectedCondition === 'all' || toy.condition === selectedCondition;
        const ageMatch = selectedAge === 'all' || toy.ageRange === selectedAge;
        return categoryMatch && conditionMatch && ageMatch;
    });

    const categories = [
        { value: 'all', label: 'All Categories', emoji: '🎁' },
        { value: 'building_blocks', label: 'Building Blocks', emoji: '🧱' },
        { value: 'plush', label: 'Plush', emoji: '🧸' },
        { value: 'vehicles', label: 'Vehicles', emoji: '🚗' },
        { value: 'puzzles', label: 'Puzzles', emoji: '🧩' },
        { value: 'educational', label: 'Educational', emoji: '📚' },
        { value: 'outdoor', label: 'Outdoor', emoji: '⚽' },
        { value: 'electronic', label: 'Electronic', emoji: '🎮' },
        { value: 'arts_crafts', label: 'Arts & Crafts', emoji: '🎨' },
    ];

    const conditions = [
        { value: 'all', label: 'All Conditions', emoji: '✨' },
        { value: 'excellent', label: 'Excellent', emoji: '✨' },
        { value: 'good', label: 'Good', emoji: '👍' },
        { value: 'used', label: 'Used', emoji: '💫' },
        { value: 'fair', label: 'Fair', emoji: '🔧' },
    ];

    const ageRanges = [
        { value: 'all', label: 'All Ages', emoji: '👶' },
        { value: '0-2', label: '0-2 years', emoji: '🍼' },
        { value: '3-4', label: '3-4 years', emoji: '👶' },
        { value: '5-7', label: '5-7 years', emoji: '🧒' },
        { value: '8-12', label: '8-12 years', emoji: '👦' },
        { value: '13+', label: '13+ years', emoji: '👨' },
    ];

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedCondition('all');
        setSelectedAge('all');
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
                    Discover toys forwarded by generous families. All items are free, verified, and ready to bring joy to your children.
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
                            {/* Filters Section */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 bg-gradient-to-br from-neo-bg-50 to-neo-bg-100 rounded-3xl p-6 shadow-neo border border-neo-bg-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-neo-bg-800 flex items-center gap-2">
                                        🔍 Filter Toys
                                    </h2>
                                    {(selectedCategory !== 'all' || selectedCondition !== 'all' || selectedAge !== 'all') && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-white bg-gradient-to-r from-neo-primary-500 to-neo-primary-600 hover:from-neo-primary-600 hover:to-neo-primary-700 font-semibold flex items-center gap-2 transition-all rounded-full shadow-md hover:shadow-lg">
                                            <span>✖</span> Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Category Filter */}
                                    <NeuSelect
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        options={categories}
                                        label="Category"
                                        icon="🏷️"
                                    />

                                    {/* Condition Filter */}
                                    <NeuSelect
                                        value={selectedCondition}
                                        onChange={setSelectedCondition}
                                        options={conditions}
                                        label="Condition"
                                        icon="⭐"
                                    />

                                    {/* Age Range Filter */}
                                    <NeuSelect
                                        value={selectedAge}
                                        onChange={setSelectedAge}
                                        options={ageRanges}
                                        label="Age Range"
                                        icon="👶"
                                    />
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-between mb-6">
                                <p className="text-neo-bg-600">
                                    Showing <span className="font-bold text-neo-primary-700">{filteredToys.length}</span> of <span className="font-bold">{toys.length}</span> available toys
                                </p>
                            </div>

                            {filteredToys.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-neo-bg-50 rounded-3xl">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold text-neo-bg-700 mb-2">No toys match your filters</h3>
                                    <p className="text-neo-bg-500 mb-4">Try adjusting your filters to see more results</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-2.5 bg-neo-primary-600 text-white rounded-full hover:bg-neo-primary-700 transition-colors font-semibold">
                                        Clear Filters
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredToys.map((toy, index) => (
                                        <motion.div
                                            key={toy.toyName}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}>
                                            <ToyCard toy={toy} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Browse;
