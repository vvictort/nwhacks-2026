import React from "react";
import { Link } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
// import HeroImage from "../assets/hero_toys_v2.png";
import RobotIcon from "../assets/robot.png";
import PuzzleIcon from "../assets/puzzle.png";
import CarIcon from "../assets/car.png";
import UnicornIcon from "../assets/unicorn.png";
import BearIcon from "../assets/bear.png";

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
          Share the Joy, <br />
          <span className="text-neo-accent-500">Spread the Love</span>
        </motion.h1>
        <motion.p
          className="text-xl text-neo-bg-800 mb-10 max-w-2xl mx-auto relative z-20 font-medium italic drop-shadow-sm"
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
      <section className="scroll-mt-32">
        <h2 className="text-5xl font-bold font-display text-neo-primary-700 mb-10 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: List It */}
          <div className="flip-card h-72">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
                    📸
                  </div>
                  <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">1. List It</h3>
                  <p className="text-neo-bg-600 italic">Snap a photo and add a description.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-primary-100">
                  <h3 className="text-lg font-bold text-neo-primary-800 mb-3">More About Listing</h3>
                  <p className="text-neo-primary-700 text-sm px-4">
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
                <NeuCard className="text-center flex flex-col items-center h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
                    📦
                  </div>
                  <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">2. Ship It</h3>
                  <p className="text-neo-bg-600 italic">Connect and ship with discounted labels.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-accent-100">
                  <h3 className="text-lg font-bold text-neo-accent-800 mb-3">More About Shipping</h3>
                  <p className="text-neo-accent-700 text-sm px-4">
                    Once a family requests your toy, we'll provide a discounted shipping label. Pack it up with care and
                    drop it off at any carrier location. Simple and affordable!
                  </p>
                </NeuCard>
              </div>
            </div>
          </div>

          {/* Card 3: Enjoy It */}
          <div className="flip-card h-72">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-neo-bg-100 shadow-neo-inset flex items-center justify-center mb-6 text-3xl">
                    😊
                  </div>
                  <h3 className="text-xl font-extrabold text-neo-bg-800 mb-2">3. Enjoy It</h3>
                  <p className="text-neo-bg-600 italic">Bring smiles and reduce waste.</p>
                </NeuCard>
              </div>
              <div className="flip-card-back">
                <NeuCard className="text-center flex flex-col items-center h-full justify-center bg-neo-bg-200">
                  <h3 className="text-lg font-bold text-neo-bg-800 mb-3">More About Impact</h3>
                  <p className="text-neo-bg-700 text-sm px-4">
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
    </div>
  );
};

export default Home;
