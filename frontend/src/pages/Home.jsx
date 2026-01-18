import React from "react";
import { Link } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import AnimatedCounter from "../components/atoms/AnimatedCounter";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
// import HeroImage from "../assets/hero_toys_v2.png";
import RobotIcon from "../assets/robot.png";
import PuzzleIcon from "../assets/puzzle.png";
import CarIcon from "../assets/car.png";
import UnicornIcon from "../assets/unicorn.png";
import BearIcon from "../assets/bear.png";

const Home = () => {
  const scrollToImpact = () => {
    const impactSection = document.getElementById("impact-stats");
    if (impactSection) {
      impactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        {/* Background Image with Blur - Removed Image */}
        {/* <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 neo-bg-500 backdrop-blur-sm z-10"></div>
          <img src={HeroImage} alt="Toy Exchange Hero" className="w-full h-full object-cover opacity-80" />
        </div> */}

        {/* Floating Icons */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 flex items-center justify-center bg-neo-bg-100/40 rounded-full shadow-neo pointer-events-none z-10 p-4"
          animate={{ rotate: [0, 10, 0], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <img src={RobotIcon} alt="Robot Toy" className="w-full h-full object-contain opacity-90 drop-shadow-md" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 w-28 h-28 flex items-center justify-center bg-neo-bg-100/40 rounded-full shadow-neo pointer-events-none z-10 p-5"
          animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <img src={BearIcon} alt="Bear Toy" className="w-full h-full object-contain opacity-90 drop-shadow-md" />
        </motion.div>

        <motion.div
          className="absolute top-20 right-20 w-20 h-20 flex items-center justify-center bg-neo-bg-100/40 rounded-full shadow-neo pointer-events-none z-10 p-3"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          <img src={PuzzleIcon} alt="Puzzle Toy" className="w-full h-full object-contain opacity-90 drop-shadow-md" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 w-32 h-32 flex items-center justify-center bg-neo-bg-100/40 rounded-full shadow-neo pointer-events-none z-10 p-6"
          animate={{ x: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
          <img src={UnicornIcon} alt="Unicorn Toy" className="w-full h-full object-contain opacity-90 drop-shadow-md" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-[15%] w-24 h-24 flex items-center justify-center bg-neo-bg-100/40 rounded-full shadow-neo pointer-events-none z-10 p-4"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <img src={CarIcon} alt="Car Toy" className="w-full h-full object-contain opacity-90 drop-shadow-md" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-display text-neo-primary-800 mb-6 relative z-20 drop-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Play It Forward, <br />
          <span className="text-neo-accent-500">Pass On The Joy</span>
        </motion.h1>
        <motion.p
          className="text-xl text-neo-bg-800 mb-10 max-w-2xl mx-auto relative z-20 font-medium italic drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Forward your pre-loved toys to families who need them most. Every toy passed on creates smiles and reduces waste.
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

        {/* Scroll Arrow */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          onClick={scrollToImpact}>
          <motion.div
            className="w-10 h-10 rounded-full bg-neo-bg-100 shadow-neo flex items-center justify-center text-neo-primary-600"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Stats */}
      <section id="impact-stats" className="py-16 scroll-mt-20">
        <h2 className="text-5xl font-bold font-display text-neo-primary-700 mb-4 text-center">Our Impact</h2>
        <p className="text-xl text-center text-neo-bg-600 max-w-2xl mx-auto mb-12 italic">
          Every toy forwarded creates a ripple of joy. Together, we're building a community where play never stops and
          kindness keeps moving forward.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          <NeuCard className="text-center p-8">
            <div className="text-4xl md:text-5xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={12500} duration={2.5} suffix="+" />
            </div>
            <p className="text-neo-bg-700 font-medium">Toys Forwarded</p>
          </NeuCard>
          <NeuCard className="text-center p-8">
            <div className="text-4xl md:text-5xl font-extrabold text-neo-accent-600 mb-2">
              <AnimatedCounter end={8200} duration={2.5} suffix="+" />
            </div>
            <p className="text-neo-bg-700 font-medium">Happy Families</p>
          </NeuCard>
          <NeuCard className="text-center p-8">
            <div className="text-4xl md:text-5xl font-extrabold text-neo-primary-600 mb-2">
              <AnimatedCounter end={45} duration={2} suffix=" tons" />
            </div>
            <p className="text-neo-bg-700 font-medium">Waste Reduced</p>
          </NeuCard>
          <NeuCard className="text-center p-8">
            <div className="text-4xl md:text-5xl font-extrabold text-neo-accent-600 mb-2">
              <AnimatedCounter end={95} duration={2} prefix="" suffix="%" />
            </div>
            <p className="text-neo-bg-700 font-medium">Satisfaction Rate</p>
          </NeuCard>
        </div>
      </section>

      {/* How It Works */}
      <section className="scroll-mt-32">
        <h2 className="text-5xl font-bold font-display text-neo-primary-700 mb-10 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: List It */}
          <div className="flip-card h-72">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center p-4">
                  <div className="w-20 h-20 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-4 text-5xl">
                    📸
                  </div>
                  <h3 className="text-2xl font-extrabold text-neo-bg-800 mb-3">1. List It</h3>
                  <p className="text-neo-bg-600 italic text-base">Snap a photo and share the joy.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-primary-100 p-6">
                  <h3 className="text-xl font-bold text-neo-primary-800 mb-4">More About Listing</h3>
                  <p className="text-neo-primary-700 text-base px-2">
                    Take a clear photo of your toy, write a short description about its condition, and set it live.
                    Other families can browse and request it instantly. It's completely free!
                  </p>
                </NeuCard>
              </div>
            </div>
          </div>

          {/* Card 2: Ship It */}
          <div className="flip-card h-72">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center p-4">
                  <div className="w-20 h-20 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-4 text-5xl">
                    📦
                  </div>
                  <h3 className="text-2xl font-extrabold text-neo-bg-800 mb-3">2. Forward It</h3>
                  <p className="text-neo-bg-600 italic text-base">Pass it on with discounted shipping.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-accent-100 p-6">
                  <h3 className="text-xl font-bold text-neo-accent-800 mb-4">More About Forwarding</h3>
                  <p className="text-neo-accent-700 text-base px-2">
                    Once a family requests your toy, we'll provide a discounted shipping label. Pack it with love and
                    forward it to its new home. Simple and affordable!
                  </p>
                </NeuCard>
              </div>
            </div>
          </div>

          {/* Card 3: Enjoy It */}
          <div className="flip-card h-72">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center p-4">
                  <div className="w-20 h-20 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-4 text-5xl">
                    😊
                  </div>
                  <h3 className="text-2xl font-extrabold text-neo-bg-800 mb-3">3. Enjoy It</h3>
                  <p className="text-neo-bg-600 italic text-base">Watch the joy spread forward.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-bg-200 p-6">
                  <h3 className="text-xl font-bold text-neo-bg-800 mb-4">More About Impact</h3>
                  <p className="text-neo-bg-700 text-base px-2">
                    Your pre-loved toy finds a new home where it will be cherished again. You've made a child happy and
                    helped reduce landfill waste. Win-win!
                  </p>
                </NeuCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Toys */}
      <section id="featured-toys" className="scroll-mt-32">
        <h2 className="text-5xl font-bold font-display text-neo-primary-700 mb-10 text-center">Featured Toys</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[RobotIcon, BearIcon, CarIcon, PuzzleIcon].map((toy, index) => (
            <NeuCard key={index} className="p-6">
              <div className="aspect-square bg-neo-bg-100 rounded-xl mb-4 flex items-center justify-center shadow-neo-inset p-4">
                <img src={toy} alt="Featured Toy" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-extrabold tracking-tight text-neo-bg-800">Classic Toy Set</h3>
              <p className="text-sm text-neo-primary-500 italic mb-4">Good Condition</p>
              <Link to="/login">
                <NeuButton variant="accent" className="w-full py-2 text-sm">
                  Request
                </NeuButton>
              </Link>
            </NeuCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-20">
        <NeuCard className="bg-gradient-to-br from-neo-primary-500 to-neo-primary-600 p-12 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-neo-accent-500/20 rounded-full blur-3xl group-hover:bg-neo-accent-500/30 transition-all duration-500" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Ready to Play It Forward? 🎁</h2>
            <p className="text-neo-primary-50 text-xl mb-10 max-w-2xl mx-auto italic font-medium">
              Join thousands of families passing joy forward. Give your toys a new adventure today!
            </p>
            <Link to="/register">
              <NeuButton
                variant="default"
                className="bg-white text-neo-primary-700 hover:text-neo-primary-800 text-lg px-12 py-4 shadow-2xl">
                Create Your Account
              </NeuButton>
            </Link>
          </div>
        </NeuCard>
      </section>
    </div>
  );
};

export default Home;
