import React from "react";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="text-center py-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-neo-primary-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Share the Joy, <br />
          <span className="text-neo-accent-500">Spread the Love</span>
        </motion.h1>
        <motion.p
          className="text-xl text-neo-bg-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Give your pre-loved toys a second chance significantly impacting families and children around the world.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}>
          <NeuButton variant="primary" className="text-lg px-8 py-4">
            Start Sharing
          </NeuButton>
          <NeuButton variant="default" className="text-lg px-8 py-4">
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
      <section>
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
