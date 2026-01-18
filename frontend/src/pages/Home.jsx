import React from "react";
import { Link } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import HeroImage from "../assets/hero_toys_v2.png";

const Home = () => {
  const scrollToFeatured = () => {
    const featuredSection = document.getElementById("featured-toys");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-32">
      {/* Hero Section */}
      <section className="relative py-20 w-full rounded-[3rem] overflow-hidden flex flex-col items-center justify-center min-h-[750px] shadow-neo-inset transition-all duration-300">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10"></div>
          <img src={HeroImage} alt="Toy Exchange Hero" className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Floating Emojis - adjusted z-index to be above background but below text if needed, or just around */}
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-40 pointer-events-none z-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          🎲
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-5xl opacity-40 pointer-events-none z-10"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          🧸
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-4xl opacity-40 pointer-events-none z-10"
          animate={{ rotate: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          🪁
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-neo-primary-800 mb-6 relative z-20 drop-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Share the Joy, <br />
          <span className="text-neo-accent-500">Spread the Love</span>
        </motion.h1>
        <motion.p
          className="text-xl text-neo-bg-800 mb-10 max-w-2xl mx-auto relative z-20 font-medium drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Give your pre-loved toys a second chance significantly impacting families and children around the world.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4 mb-12 relative z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}>
          <Link to="/register">
            <NeuButton variant="primary" className="text-lg px-8 py-4 shadow-xl">
              Get Started
            </NeuButton>
          </Link>
          <NeuButton variant="default" className="text-lg px-8 py-4 shadow-xl bg-white/80" onClick={scrollToFeatured}>
            Browse Toys
          </NeuButton>
        </motion.div>
      </section>
      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold text-neo-primary-700 mb-10 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <NeuCard className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
              📸
            </div>
            <h3 className="text-xl font-bold text-neo-bg-800 mb-2">1. List It</h3>
            <p className="text-neo-bg-600">Snap a photo of your toy and add a description. It's quick and free.</p>
          </NeuCard>
          <NeuCard className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
              📦
            </div>
            <h3 className="text-xl font-bold text-neo-bg-800 mb-2">2. Ship It</h3>
            <p className="text-neo-bg-600">Connect with a family and ship the toy using our discounted labels.</p>
          </NeuCard>
          <NeuCard className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
              😊
            </div>
            <h3 className="text-xl font-bold text-neo-bg-800 mb-2">3. Enjoy It</h3>
            <p className="text-neo-bg-600">Bring a smile to a child's face and reduce waste.</p>
          </NeuCard>
        </div>
      </section>
      {/* Featured Toys */}
      <section id="featured-toys">
        <h2 className="text-3xl font-bold text-neo-primary-700 mb-10 text-center">Featured Toys</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <NeuCard key={item} className="p-6">
              <div className="aspect-square bg-neo-bg-200 rounded-xl mb-4 animate-pulse"></div>
              <h3 className="font-bold text-neo-bg-800">Classic Lego Set</h3>
              <p className="text-sm text-neo-bg-500 mb-4">Good Condition</p>
              <NeuButton variant="accent" className="w-full py-2 text-sm">
                Request
              </NeuButton>
            </NeuCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
