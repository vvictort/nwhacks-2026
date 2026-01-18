import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import AnimatedCounter from "../components/atoms/AnimatedCounter";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { publicApiClient } from "../utils/apiClient";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, profileLoading } = useAuth();

  // State for recently forwarded toys
  const [recentForwards, setRecentForwards] = useState([]);
  const [forwardsLoading, setForwardsLoading] = useState(true);

  // Use real data from Firebase user and backend userProfile
  const displayName = user?.displayName || userProfile?.email?.split("@")[0] || "User";
  const userAvatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  // Format the createdAt date for member since display
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently joined";

  // Use real stats from backend, with fallbacks
  // For mock users, use the dedicated stat fields
  const userStats = {
    toysForwarded: userProfile?.toysForwardedCount || userProfile?.donatedToys?.length || 0,
    toysReceived: userProfile?.toysReceivedCount || userProfile?.wishList?.length || 0,
    familiesHelped: userProfile?.familiesHelpedCount || userProfile?.donatedToys?.length || 0,
    wasteReduced: userProfile?.wasteReducedKg
      ? `${userProfile.wasteReducedKg} kg`
      : `${((userProfile?.donatedToys?.length || 0) * 0.2).toFixed(1)} kg`,
  };

  // Check if this is a mock/demo user
  const isMockUser = user?.uid === 'mock-user-id';

  // Hardcoded mock toys for demo account
  const mockToys = [
    {
      id: 'mock-1',
      toyName: 'Giant Inflatable T-Rex Costume (Still Roars!)',
      description: 'Life-sized inflatable T-Rex costume that actually roars when you walk. Perfect for parties!',
      category: 'outdoor',
      ageRange: '5-7',
      status: 'completed',
      createdAt: '2025-12-15T10:00:00Z',
      condition: 'good',
    },
    {
      id: 'mock-2',
      toyName: 'Vintage 1985 Optimus Prime (Battle Damaged Edition)',
      description: 'Original G1 Transformers Optimus Prime. Some battle damage adds character!',
      category: 'vehicles',
      ageRange: '8-12',
      status: 'completed',
      createdAt: '2025-11-20T14:30:00Z',
      condition: 'fair',
    },
    {
      id: 'mock-3',
      toyName: 'Haunted Furby That Speaks in Riddles',
      description: 'This Furby has developed its own personality. Speaks only in cryptic riddles. Batteries included.',
      category: 'electronic',
      ageRange: '5-7',
      status: 'available',
      createdAt: '2025-10-31T00:00:00Z',
      condition: 'used',
    },
    {
      id: 'mock-4',
      toyName: 'NERF Arsenal Collection (47 Blasters)',
      description: 'Complete NERF collection with 47 blasters, thousands of darts, and tactical gear.',
      category: 'outdoor',
      ageRange: '8-12',
      status: 'reserved',
      createdAt: '2025-09-05T08:15:00Z',
      condition: 'excellent',
    },
    {
      id: 'mock-5',
      toyName: 'Life-Size Cardboard Millennium Falcon',
      description: 'Hand-crafted cardboard Millennium Falcon. Fits 2 kids in the cockpit!',
      category: 'building_blocks',
      ageRange: '5-7',
      status: 'completed',
      createdAt: '2025-08-01T16:45:00Z',
      condition: 'good',
    },
  ];

  // Fetch toy details for recently forwarded section (max 5)
  useEffect(() => {
    const fetchRecentForwards = async () => {
      // If mock user, use hardcoded toys
      if (isMockUser) {
        setRecentForwards(mockToys);
        setForwardsLoading(false);
        return;
      }

      if (!userProfile?.donatedToys?.length) {
        setRecentForwards([]);
        setForwardsLoading(false);
        return;
      }

      try {
        // Take up to 5 toys (we'll sort by date after fetching)
        const toyNames = userProfile.donatedToys.slice(0, 10); // Fetch a few more to ensure we get 5 valid ones
        const toyPromises = toyNames.map(async (toyName) => {
          try {
            const toy = await publicApiClient.get(`/toys/${encodeURIComponent(toyName)}`);
            return toy;
          } catch (error) {
            console.error(`Failed to fetch toy: ${toyName}`, error);
            return null;
          }
        });

        const toys = await Promise.all(toyPromises);
        // Filter out failed fetches and sort by createdAt descending
        const validToys = toys.filter((t) => t !== null);
        const sorted = validToys.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setRecentForwards(sorted.slice(0, 5)); // Only show 5 most recent
      } catch (error) {
        console.error("Failed to fetch recent forwards:", error);
      } finally {
        setForwardsLoading(false);
      }
    };

    if (!profileLoading) {
      fetchRecentForwards();
    }
  }, [userProfile, profileLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      available: { label: "Available", style: "bg-green-100 text-green-700" },
      reserved: { label: "Reserved", style: "bg-yellow-100 text-yellow-700" },
      completed: { label: "Delivered", style: "bg-blue-100 text-blue-700" },
      draft: { label: "Draft", style: "bg-gray-100 text-gray-600" },
    };
    return statusMap[status] || { label: status || "Unknown", style: "bg-gray-100 text-gray-600" };
  };

  return (
    <div className="flex flex-col gap-20 pb-12">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <motion.div
          className="w-32 h-32 rounded-full bg-neo-bg-100 shadow-neo overflow-hidden flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}>
          <img
            src={userAvatar}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
            }}
          />
        </motion.div>
        <div className="text-center md:text-left flex-1">
          <motion.h1
            className="text-4xl md:text-5xl font-display text-neo-primary-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Welcome back, {displayName.split(" ")[0]}! 👋
          </motion.h1>
          <motion.p
            className="text-neo-bg-600 text-lg mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {profileLoading ? "Loading..." : `Member since ${memberSince}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}>
            <NeuButton
              variant="secondary"
              onClick={() => navigate("/account-settings")}
              className="flex items-center justify-center gap-3 px-6 py-3 font-semibold bg-gradient-to-r from-neo-bg-50 to-neo-bg-100 hover:from-neo-primary-50 hover:to-neo-primary-100 hover:shadow-lg transition-all duration-300 group">
              <span className="text-xl group-hover:rotate-90 transition-transform duration-300">⚙️</span>
              <span className="group-hover:text-neo-primary-700 transition-colors">Account Settings</span>
            </NeuButton>
          </motion.div>
        </div>
      </section>

      {/* Your Impact Stats */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Your Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NeuCard className="text-center p-6">
            <div className="text-5xl md:text-6xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={userStats.toysForwarded} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Toys Forwarded</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-5xl md:text-6xl font-extrabold text-neo-accent-600 mb-2">
              <AnimatedCounter end={userStats.toysReceived} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Toys Received</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-5xl md:text-6xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={userStats.familiesHelped} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Families Helped</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-5xl md:text-6xl font-extrabold text-neo-accent-600 mb-2">{userStats.wasteReduced}</div>
            <p className="text-neo-bg-600 font-medium text-sm">Waste Reduced</p>
          </NeuCard>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Forward a Toy */}
          <NeuCard className="p-8 group hover:shadow-neo-lg transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-primary-400 to-neo-primary-600 flex items-center justify-center shadow-lg text-3xl">
                🎁
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">Forward a Toy</h3>
                <p className="text-neo-bg-600 mb-4 text-sm">
                  Pass on the joy! Share your pre-loved toys with families who need them.
                </p>
                <Link to="/donate">
                  <NeuButton variant="primary" className="text-sm px-6 py-2">
                    Start Forwarding
                  </NeuButton>
                </Link>
              </div>
            </div>
          </NeuCard>

          {/* Browse Toys */}
          <NeuCard className="p-8 group hover:shadow-neo-lg transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-accent-400 to-neo-accent-600 flex items-center justify-center shadow-lg text-3xl">
                🧸
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">Browse Free Toys</h3>
                <p className="text-neo-bg-600 mb-4 text-sm">
                  Find wonderful toys for your children. All items are free and verified.
                </p>
                <Link to="/browse">
                  <NeuButton variant="accent" className="text-sm px-6 py-2">
                    Browse Now
                  </NeuButton>
                </Link>
              </div>
            </div>
          </NeuCard>
        </div>
      </section>

      {/* Recent Forwards */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Recently Forwarded</h2>
        <NeuCard className="p-6">
          {forwardsLoading || profileLoading ? (
            <div className="text-center py-8">
              <p className="text-neo-bg-500">Loading your donations...</p>
            </div>
          ) : recentForwards.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-neo-bg-600 mb-4">You haven't forwarded any toys yet.</p>
              <Link to="/donate" className="inline-block">
                <NeuButton variant="primary" className="text-sm">
                  Forward Your First Toy
                </NeuButton>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {recentForwards.map((forward, index) => {
                  const statusInfo = getStatusDisplay(forward.status);
                  return (
                    <div
                      key={forward.toyName || index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-neo-bg-50 shadow-neo-inset">
                      <div>
                        <h4 className="font-bold text-neo-bg-800">{forward.toyName}</h4>
                        <p className="text-sm text-neo-bg-500">{formatDate(forward.createdAt)}</p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusInfo.style}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {userProfile?.donatedToys?.length > 5 && (
                <div className="mt-6 text-center">
                  <Link to="/my-donations">
                    <NeuButton variant="default" className="text-sm">
                      View All Forwards ({userProfile.donatedToys.length})
                    </NeuButton>
                  </Link>
                </div>
              )}
            </>
          )}
        </NeuCard>
      </section>

      {/* Account Settings Quick Link */}
      {/* <section>
        <NeuCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neo-bg-200 shadow-neo-inset flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-neo-bg-800">Account Settings</h3>
              <p className="text-sm text-neo-bg-500">{user.email}</p>
            </div>
          </div>
          <Link to="/settings">
            <NeuButton variant="default" className="text-sm">
              Manage Account
            </NeuButton>
          </Link>
        </NeuCard>
      </section> */}
    </div>
  );
};

export default Dashboard;
