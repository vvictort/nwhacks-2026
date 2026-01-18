import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { path: "/", label: "Home" },
    { path: "/vision", label: "Vision" },
    { path: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Use" },
  ];

  const socialLinks = [
    { icon: "𝕏", href: "https://x.com/gatesfoundation", label: "X" },
    { icon: "🌐", href: "https://github.com/vvictort/nwhacks-2026#", label: "GitHub" },
    { icon: "💼", href: "https://www.linkedin.com/company/gates-foundation/", label: "LinkedIn" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <footer className="px-4 pb-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-gradient-to-br from-neo-primary-600 to-neo-primary-800 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 md:p-12 border border-neo-primary-500/50 backdrop-blur-xl relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neo-primary-400 to-neo-primary-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">🎁</span>
                  </div>
                  <h3 className="text-white font-bold text-2xl">ToyJoy.</h3>
                </div>
                <p className="text-neo-bg-300 text-sm leading-relaxed max-w-xs">
                  Get in touch to find out more about digital experiences to effectively reach and engage customers and
                  target audiences.
                </p>
              </motion.div>

              {/* Company Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-neo-bg-300 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                        <span className="w-0 group-hover:w-2 h-0.5 bg-neo-primary-500 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-neo-bg-300 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                        <span className="w-0 group-hover:w-2 h-0.5 bg-neo-primary-500 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Divider */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-neo-bg-600 to-transparent mb-6"
              variants={itemVariants}
            />

            {/* Bottom Section */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-4"
              variants={itemVariants}>
              <p className="text-neo-bg-400 text-xs">© {currentYear} ToyShare. Spreading Joy Worldwide.</p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neo-bg-700/50 hover:bg-neo-primary-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-neo-primary-500/20 group"
                    aria-label={social.label}>
                    <span className="text-neo-bg-300 group-hover:text-white transition-colors text-lg">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
