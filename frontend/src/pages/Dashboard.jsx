import React from "react";
import { Link } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import AnimatedCounter from "../components/atoms/AnimatedCounter";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Dashboard = () => {
  // Mock user data - in a real app this would come from auth context/API
  const user = {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    memberSince: "January 2024",
  };

  const userStats = {
    toysDonated: 12,
    toysReceived: 5,
    familiesHelped: 8,
    wasteReduced: "2.5 kg",
  };

  const recentDonations = [
    { id: 1, name: "Wooden Train Set", date: "Jan 15, 2024", status: "Delivered" },
    { id: 2, name: "Teddy Bear Collection", date: "Jan 10, 2024", status: "Shipped" },
    { id: 3, name: "Building Blocks", date: "Dec 28, 2023", status: "Delivered" },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="w-32 h-32 rounded-full bg-neo-bg-100 shadow-neo overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}>
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </motion.div>
        <div className="text-center md:text-left">
          <motion.h1
            className="text-4xl md:text-5xl font-display text-neo-primary-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Welcome back, {user.name.split(" ")[0]}! 👋
          </motion.h1>
          <motion.p
            className="text-neo-bg-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            Member since {user.memberSince}
          </motion.p>
        </div>
      </section>

      {/* Your Impact Stats */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Your Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NeuCard className="text-center p-6">
            <div className="text-3xl md:text-4xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={userStats.toysDonated} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Toys Donated</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-3xl md:text-4xl font-extrabold text-neo-accent-600 mb-2">
              <AnimatedCounter end={userStats.toysReceived} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Toys Received</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-3xl md:text-4xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={userStats.familiesHelped} duration={1.5} />
            </div>
            <p className="text-neo-bg-600 font-medium text-sm">Families Helped</p>
          </NeuCard>
          <NeuCard className="text-center p-6">
            <div className="text-3xl md:text-4xl font-extrabold text-neo-accent-600 mb-2">{userStats.wasteReduced}</div>
            <p className="text-neo-bg-600 font-medium text-sm">Waste Reduced</p>
          </NeuCard>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Donate a Toy */}
          <NeuCard className="p-8 group hover:shadow-neo-lg transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-primary-400 to-neo-primary-600 flex items-center justify-center shadow-lg text-3xl">
                🎁
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">Donate a Toy</h3>
                <p className="text-neo-bg-600 mb-4 text-sm">
                  Share your pre-loved toys with families in need. Quick and easy listing process.
                </p>
                <Link to="/donate">
                  <NeuButton variant="primary" className="text-sm px-6 py-2">
                    Start Donating
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
                <Link to="/#featured-toys">
                  <NeuButton variant="accent" className="text-sm px-6 py-2">
                    Browse Now
                  </NeuButton>
                </Link>
              </div>
            </div>
          </NeuCard>
        </div>
      </section>

      {/* Recent Donations */}
      <section>
        <h2 className="text-3xl font-bold font-display text-neo-primary-700 mb-6">Recent Donations</h2>
        <NeuCard className="p-6">
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-neo-bg-50 shadow-neo-inset">
                <div>
                  <h4 className="font-bold text-neo-bg-800">{donation.name}</h4>
                  <p className="text-sm text-neo-bg-500">{donation.date}</p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    donation.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {donation.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/donations">
              <NeuButton variant="default" className="text-sm">
                View All Donations
              </NeuButton>
            </Link>
          </div>
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
