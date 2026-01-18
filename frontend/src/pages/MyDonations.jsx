import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import { useAuth } from "../hooks/useAuth";
import { publicApiClient } from "../utils/apiClient";

const MyDonations = () => {
  const navigate = useNavigate();
  const { userProfile, profileLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch toy details for all donated toys
  useEffect(() => {
    const fetchDonations = async () => {
      if (!userProfile?.donatedToys?.length) {
        setDonations([]);
        setLoading(false);
        return;
      }

      try {
        const toyPromises = userProfile.donatedToys.map(async (toyName) => {
          try {
            const toy = await publicApiClient.get(`/toys/${encodeURIComponent(toyName)}`);
            return toy;
          } catch (error) {
            console.error(`Failed to fetch toy: ${toyName}`, error);
            return { toyName, status: "unknown", error: true };
          }
        });

        const toys = await Promise.all(toyPromises);
        // Sort by createdAt descending (most recent first)
        const sorted = toys.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setDonations(sorted);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!profileLoading) {
      fetchDonations();
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { bg: "bg-green-100", text: "text-green-700", label: "Available" },
      reserved: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Reserved" },
      completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Delivered" },
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      unknown: { bg: "bg-gray-100", text: "text-gray-500", label: "Unknown" },
    };
    const config = statusConfig[status] || statusConfig.unknown;
    return (
      <span className={`px-4 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>{config.label}</span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-neo-bg-600 hover:text-neo-primary-600 transition-colors mb-4">
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-neo-primary-900 via-neo-accent-400 to-neo-primary-300 bg-clip-text text-transparent">
            My Donations
          </h1>
          <p className="text-neo-bg-600 mt-2">All the toys you've forwarded to families in need</p>
        </div>

        {/* Donations List */}
        <NeuCard className="p-6">
          {loading || profileLoading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-neo-bg-600">Loading your donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-neo-bg-700 mb-2">No donations yet</h3>
              <p className="text-neo-bg-500 mb-6">Start making a difference by forwarding your first toy!</p>
              <Link to="/donate">
                <NeuButton variant="primary">Forward a Toy</NeuButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((toy, index) => (
                <motion.div
                  key={toy.toyName || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-neo-bg-50 shadow-neo-inset hover:shadow-neo transition-all cursor-pointer"
                  onClick={() => navigate(`/browse`)}>
                  <div className="flex-1">
                    <h4 className="font-bold text-neo-bg-800">{toy.toyName}</h4>
                    <div className="flex gap-4 text-sm text-neo-bg-500 mt-1">
                      <span>{toy.category || "Uncategorized"}</span>
                      <span>•</span>
                      <span>{toy.condition || "Unknown condition"}</span>
                      <span>•</span>
                      <span>{formatDate(toy.createdAt)}</span>
                    </div>
                    {toy.description && <p className="text-sm text-neo-bg-600 mt-2 line-clamp-1">{toy.description}</p>}
                  </div>
                  {getStatusBadge(toy.status)}
                </motion.div>
              ))}
            </div>
          )}
        </NeuCard>

        {/* Summary Stats */}
        {donations.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <NeuCard className="text-center p-4">
              <div className="text-2xl font-bold text-neo-primary-600">{donations.length}</div>
              <p className="text-sm text-neo-bg-600">Total Donated</p>
            </NeuCard>
            <NeuCard className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {donations.filter((d) => d.status === "completed").length}
              </div>
              <p className="text-sm text-neo-bg-600">Delivered</p>
            </NeuCard>
            <NeuCard className="text-center p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {donations.filter((d) => d.status === "available" || d.status === "reserved").length}
              </div>
              <p className="text-sm text-neo-bg-600">In Progress</p>
            </NeuCard>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyDonations;
