//frontend/src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  Recycle,
  Users,
  ShoppingBag,
  Star,
  Heart,
  Shield,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shirt,
  Leaf,
  Camera,
  Check,
  CheckCircle2,
  Wallet,
  ArrowLeftRight,
  Plus,
  UploadCloud,
  Coins,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import vintageDenimImg from "@/assets/vintage_denim.png";
import ecoLinenDressImg from "@/assets/eco_linen_dress.png";
import cozyKnitSweaterImg from "@/assets/cozy_knit_sweater.png";
import retroSneakersImg from "@/assets/retro_sneakers.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Sub-components for "How ReWear Works" device mockup screens
const ScreenUpload = () => {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("uploading"); // "uploading", "completed"

  React.useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 8;
      if (start >= 100) {
        setProgress(100);
        setStatus("completed");
        clearInterval(interval);
      } else {
        setProgress(start);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-slate-950 text-white font-sans">
      {/* App Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
        <span className="text-[10px] font-semibold text-slate-400">9:41</span>
        <h4 className="text-[11px] font-extrabold text-emerald-400">List New Item</h4>
        <div className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-[8px] text-slate-400 font-bold">i</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3.5 py-3.5 overflow-hidden select-none">
        {/* Upload Box */}
        <div className="relative border border-dashed border-white/20 rounded-xl p-3 bg-white/5 flex flex-col items-center justify-center min-h-[110px] overflow-hidden">
          <AnimatePresence mode="wait">
            {status === "uploading" ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <UploadCloud className="w-8 h-8 text-emerald-400 animate-pulse mb-1.5" />
                <span className="text-[10px] font-medium text-slate-300 mb-1">
                  Uploading image...
                </span>
                {/* Progress bar */}
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-[9px] text-slate-400 mt-1">{progress}%</span>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={vintageDenimImg}
                  alt="Vintage Denim"
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="bg-emerald-500 text-white p-1 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.div>
                  <span className="text-white text-[11px] font-bold ml-1.5 drop-shadow-md">
                    ✓ Uploaded
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Item Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={status === "completed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5"
        >
          <div className="flex flex-col gap-0.5">
            <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              Title
            </label>
            <div className="text-[11px] font-semibold text-slate-200">
              Vintage Denim Jacket
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                Condition
              </label>
              <div className="inline-flex text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-max">
                Like New
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                Points Value
              </label>
              <div className="text-[11px] font-extrabold text-emerald-400">
                150 pts
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={status === "completed" ? { opacity: 1 } : { opacity: 0 }}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition shadow-lg shadow-emerald-950/20 mt-auto"
      >
        Submit Listing
      </motion.button>
    </div>
  );
};

const ScreenWallet = () => {
  const [points, setPoints] = React.useState(390);
  const [sparkleVisible, setSparkleVisible] = React.useState(false);
  const [showTransaction, setShowTransaction] = React.useState(false);

  React.useEffect(() => {
    let current = 390;
    const target = 540;
    const step = 5;
    const duration = 1000; // 1s
    const stepsCount = (target - current) / step;
    const intervalTime = Math.floor(duration / stepsCount);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setPoints(target);
        setSparkleVisible(true);
        setShowTransaction(true);
        clearInterval(timer);
      } else {
        setPoints(current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-slate-950 text-white font-sans">
      {/* App Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
        <span className="text-[10px] font-semibold text-slate-400">9:41</span>
        <h4 className="text-[11px] font-extrabold text-blue-400">My Wallet</h4>
        <Wallet className="w-3.5 h-3.5 text-blue-400" />
      </div>

      <div className="flex-1 flex flex-col gap-3.5 py-3.5 select-none overflow-hidden">
        {/* Available Points Balance Card */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl p-4 shadow-xl border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl" />
          <span className="text-[9px] uppercase tracking-wider font-bold text-white/70">
            Available Balance
          </span>
          <div className="flex items-center gap-1.5 mt-1 relative">
            <span className="text-3xl font-black tracking-tight text-white drop-shadow-md">
              {points}
            </span>
            <span className="text-[11px] font-bold text-emerald-200">pts</span>
            
            {/* Sparkle Popup */}
            {sparkleVisible && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1.3, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="absolute left-[85px] top-1"
              >
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </motion.div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-[8px] text-white/60 font-semibold">
            <span>ReWear Level 2</span>
            <span>★ Eco Pioneer</span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="flex-1 flex flex-col gap-2 mt-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 px-1">
            Recent Activities
          </span>

          <div className="flex flex-col gap-2">
            {/* Transaction item added from upload */}
            <AnimatePresence>
              {showTransaction && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 border border-white/15 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-200">
                        Listed Vintage Denim
                      </span>
                      <span className="text-[8px] text-slate-400">Just now</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400">
                    +150 pts
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Default items */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex items-center justify-between opacity-60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300">
                    Joined ReWear
                  </span>
                  <span className="text-[8px] text-slate-500">2 days ago</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-slate-300">
                +390 pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenSwap = () => {
  const [matchState, setMatchState] = React.useState("searching"); // "searching", "confirmed"

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMatchState("confirmed");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-slate-950 text-white font-sans relative overflow-hidden">
      {/* App Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
        <span className="text-[10px] font-semibold text-slate-400">9:41</span>
        <h4 className="text-[11px] font-extrabold text-purple-400">Swap Hub</h4>
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2 select-none">
        {/* Match View Area */}
        <div className="flex items-center justify-center gap-4 w-full px-2">
          {/* User Item */}
          <div className="flex flex-col items-center gap-1.5 w-[70px]">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-slate-800 shadow-md">
              <img src={vintageDenimImg} alt="Your jacket" className="w-full h-full object-cover" />
            </div>
            <span className="text-[8px] text-slate-400 font-bold text-center truncate w-full">
              Your Jacket
            </span>
          </div>

          {/* Loop Animation Arrows */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <motion.div
              animate={matchState === "searching" ? { rotate: 360 } : { rotate: 0 }}
              transition={
                matchState === "searching"
                  ? { repeat: Infinity, duration: 1.8, ease: "linear" }
                  : { duration: 0.5 }
              }
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                matchState === "confirmed"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-purple-500/40 bg-purple-500/5 text-purple-400"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </motion.div>
            {matchState === "searching" && (
              <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-ping pointer-events-none" />
            )}
          </div>

          {/* Partner Item */}
          <div className="flex flex-col items-center gap-1.5 w-[70px]">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-slate-800 shadow-md">
              <img src={retroSneakersImg} alt="Sarah's Sneakers" className="w-full h-full object-cover" />
            </div>
            <span className="text-[8px] text-slate-400 font-bold text-center truncate w-full">
              Sarah's Shoes
            </span>
          </div>
        </div>

        <div className="text-center h-8">
          <AnimatePresence mode="wait">
            {matchState === "searching" ? (
              <motion.span
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[9px] font-bold text-purple-400 tracking-wider uppercase animate-pulse"
              >
                Finding Swap Match...
              </motion.span>
            ) : (
              <motion.span
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase"
              >
                Match Confirmed!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Swap Confirmed Popup */}
      <AnimatePresence>
        {matchState === "confirmed" && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-white/15 p-3.5 flex flex-col items-center gap-2 rounded-t-2xl z-40"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-550/20">
              <Check className="w-4 h-4 text-white stroke-[3]" />
            </div>
            <div className="text-center">
              <h5 className="text-[11px] font-black text-white">✓ Swap Confirmed</h5>
              <p className="text-[8px] text-slate-400 mt-0.5">
                You swapped with Sarah J.!
              </p>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold py-1.5 rounded-lg transition mt-1">
              View Swap Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DeviceMockup = ({ step }) => {
  return (
    <div className="relative w-[280px] h-[510px] bg-slate-900 rounded-[3rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-slate-800/90 overflow-hidden flex flex-col">
      {/* Tiny Speaker Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-10 h-0.5 bg-slate-700 rounded-full mb-1" />
        <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mb-1 ml-2" />
      </div>

      {/* Screen reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-30" />
      
      {/* Content wrapper */}
      <div className="relative w-full h-full bg-slate-950 rounded-[2.1rem] overflow-hidden border border-white/5 flex flex-col p-3 pt-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <ScreenUpload />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <ScreenWallet />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <ScreenSwap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Custom premium dropdown component for Points Calculator
const CustomSelect = ({ label, icon, value, options, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative flex flex-col gap-1.5 w-full text-left">
      <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider select-none">
        {icon}
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 hover:border-emerald-300 hover:bg-slate-50/50 transition-all duration-300 flex items-center justify-between shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className="flex items-center gap-2 select-none">
          {selectedOption?.icon && <span className="text-lg">{selectedOption.icon}</span>}
          {selectedOption?.label}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-[10px]"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[105%] left-0 right-0 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-[220px] overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors ${
                  opt.value === value
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "hover:bg-slate-50 text-gray-600"
                }`}
              >
                {opt.icon && <span className="text-base select-none">{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom premium FeatureCard component for "Why ReWear?" features section
const FeatureCard = ({ feature, index }) => {
  const cardRef = React.useRef(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08, // stagger by 80ms
        ease: "easeOut"
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.08)] hover:border-emerald-500/25 transition-all duration-350 group text-left cursor-default flex flex-col justify-between h-full"
    >
      {/* Subtle cursor-following radial gradient overlay */}
      {isHovered && (
        <div
          className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.06), transparent 70%)`
          }}
        />
      )}

      <div className="relative z-10">
        {/* Icon Container with subtle animation */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 shadow-inner group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors duration-300">
          {feature.icon}
        </div>
        
        {/* Title & Emoji */}
        <h3 className="text-lg font-bold text-gray-800 mb-2.5 flex items-center gap-2">
          <span>{feature.emoji}</span>
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const cards = [
    {
      id: "card-1",
      title: "Vintage Denim",
      image: vintageDenimImg,
      points: 150,
      condition: "Like New",
      conditionColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      avatar: "SJ",
      userName: "Sarah J.",
      category: "Jacket"
    },
    {
      id: "card-2",
      title: "Eco Linen Dress",
      image: ecoLinenDressImg,
      points: 180,
      condition: "Excellent",
      conditionColor: "bg-teal-50 text-teal-700 border-teal-200",
      avatar: "EW",
      userName: "Emma W.",
      category: "Dress"
    },
    {
      id: "card-3",
      title: "Cozy Knit Sweater",
      image: cozyKnitSweaterImg,
      points: 120,
      condition: "Good",
      conditionColor: "bg-amber-50 text-amber-700 border-amber-200",
      avatar: "MC",
      userName: "Mike C.",
      category: "Sweater"
    },
    {
      id: "card-4",
      title: "Retro Sneakers",
      image: retroSneakersImg,
      points: 200,
      condition: "Like New",
      conditionColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      avatar: "JD",
      userName: "John D.",
      category: "Shoes"
    }
  ];

  const [positions, setPositions] = React.useState([0, 1, 2, 3]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => [prev[3], prev[0], prev[1], prev[2]]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const cardPositions = [
    { left: "4%", top: "4%" },
    { left: "52%", top: "8%" },
    { left: "6%", top: "54%" },
    { left: "54%", top: "50%" }
  ];

  const handleCTA = (path) => {
    if (isSignedIn) {
      navigate(path);
    } else {
      navigate("/sign-in");
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [hoveredStep, setHoveredStep] = React.useState(null);
  
  const stepRef0 = React.useRef(null);
  const stepRef1 = React.useRef(null);
  const stepRef2 = React.useRef(null);
  const sectionRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  React.useEffect(() => {
    const refs = [stepRef0, stepRef1, stepRef2];
    const observers = [];
    
    refs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(idx);
          }
        },
        {
          rootMargin: "-25% 0px -45% 0px",
          threshold: 0.1,
        }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Estimate Your Points Calculator states & options
  const categoryOptions = [
    { value: "jackets", label: "Jackets", icon: "🧥", base: 100 },
    { value: "shoes", label: "Shoes", icon: "👟", base: 120 },
    { value: "dresses", label: "Dresses", icon: "👗", base: 80 },
    { value: "shirts", label: "Shirts", icon: "👕", base: 50 },
  ];

  const conditionOptions = [
    { value: "like_new", label: "Like New", icon: "✨", mult: 1.5 },
    { value: "excellent", label: "Excellent", icon: "👍", mult: 1.2 },
    { value: "good", label: "Good", icon: "✓", mult: 1.0 },
    { value: "fair", label: "Fair", icon: "🩹", mult: 0.7 },
  ];

  const brandOptions = [
    { value: "premium", label: "Premium Brand", icon: "💎", mult: 1.2 },
    { value: "mid", label: "Mid-range", icon: "🏷️", mult: 1.0 },
    { value: "basic", label: "Value / Basic", icon: "📦", mult: 0.8 },
  ];

  const [calcCategory, setCalcCategory] = React.useState("jackets");
  const [calcCondition, setCalcCondition] = React.useState("like_new");
  const [calcBrand, setCalcBrand] = React.useState("premium");

  const selectedCategory = categoryOptions.find(o => o.value === calcCategory);
  const selectedCondition = conditionOptions.find(o => o.value === calcCondition);
  const selectedBrand = brandOptions.find(o => o.value === calcBrand);

  const targetCalcPoints = Math.round(
    (selectedCategory?.base || 100) * 
    (selectedCondition?.mult || 1.0) * 
    (selectedBrand?.mult || 1.0)
  );

  const [displayCalcPoints, setDisplayCalcPoints] = React.useState(targetCalcPoints);

  React.useEffect(() => {
    if (displayCalcPoints === targetCalcPoints) return;
    const diff = targetCalcPoints - displayCalcPoints;
    const duration = 500; // 500ms count transition
    const step = diff > 0 ? 1 : -1;
    const stepsCount = Math.abs(diff);
    if (stepsCount === 0) return;
    const intervalTime = Math.max(4, Math.floor(duration / stepsCount));
    
    const timer = setInterval(() => {
      setDisplayCalcPoints(prev => {
        if (prev === targetCalcPoints) {
          clearInterval(timer);
          return prev;
        }
        const nextValue = prev + step;
        if ((step > 0 && nextValue >= targetCalcPoints) || (step < 0 && nextValue <= targetCalcPoints)) {
          clearInterval(timer);
          return targetCalcPoints;
        }
        return nextValue;
      });
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [targetCalcPoints]);

  const getDemandMessage = () => {
    const isHighItem = calcCategory === "shoes" || calcCategory === "jackets";
    const isHighCond = calcCondition === "like_new" || calcCondition === "excellent";
    
    if (isHighItem && isHighCond) return { text: "🔥 High Demand", color: "text-amber-500 bg-amber-50 border-amber-200/50" };
    if (isHighCond || isHighItem) return { text: "✨ Community Favorite", color: "text-emerald-600 bg-emerald-50 border-emerald-200/50" };
    return { text: "👍 Moderate Demand", color: "text-blue-600 bg-blue-50 border-blue-200/50" };
  };

  const getSwapRanges = () => {
    if (targetCalcPoints < 80) return ["Basic Shirts", "Simple Tops", "Accessories"];
    if (targetCalcPoints < 120) return ["Everyday Tees", "Summer Dresses", "Canvas Shoes"];
    if (targetCalcPoints < 160) return ["Denim Jackets", "Designer Tops", "Leather Belts"];
    return ["Premium Hoodies", "Vintage Outerwear", "Retro Sneakers"];
  };

  const handleCalcReset = () => {
    setCalcCategory("jackets");
    setCalcCondition("like_new");
    setCalcBrand("premium");
  };

  const whyReWearFeatures = [
    {
      icon: <Recycle className="h-9 w-9 text-emerald-600 transition-all duration-700 ease-out group-hover:rotate-180" />,
      title: "Sustainable Fashion",
      description: "Give clothes a second life while reducing textile waste and supporting a more sustainable future.",
      emoji: "🌱"
    },
    {
      icon: <Users className="h-9 w-9 text-blue-600 transition-transform duration-300 group-hover:scale-110" />,
      title: "Community Driven",
      description: "Connect with eco-conscious fashion lovers and discover quality items from trusted members.",
      emoji: "👥"
    },
    {
      icon: <Coins className="h-9 w-9 text-amber-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105" />,
      title: "Earn Reward Points",
      description: "Receive points for every approved listing and redeem them for your next favorite item.",
      emoji: "🪙"
    },
    {
      icon: <ShieldCheck className="h-9 w-9 text-teal-600 transition-all duration-300 group-hover:scale-110" />,
      title: "Safe & Secure Swaps",
      description: "Moderated listings and verified community interactions help create a trustworthy swapping experience.",
      emoji: "🔒"
    },
    {
      icon: <BadgeCheck className="h-9 w-9 text-indigo-600 transition-all duration-300 group-hover:scale-110" />,
      title: "Quality Assurance",
      description: "Every item is reviewed to maintain quality standards and improve swap confidence.",
      emoji: "⭐"
    },
    {
      icon: <Heart className="h-9 w-9 text-red-500 transition-all duration-300 group-hover:scale-115" />,
      title: "Feel Good Fashion",
      description: "Refresh your wardrobe without unnecessary shopping while making a positive environmental impact.",
      emoji: "❤️"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      location: "Chicago, IL",
      joinDate: "Joined Mar 2024",
      verified: true,
      category: "Eco Champion",
      swaps: 12,
      points: 940,
      swapFrom: "Vintage Denim",
      swapFromImg: vintageDenimImg,
      swapTo: "Knit Sweater",
      swapToImg: cozyKnitSweaterImg,
      content: "The quality exceeded my expectations. The swap process was seamless, and the community is incredibly welcoming! I've already swapped 12 items and saved so much textile waste.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      location: "San Francisco, CA",
      joinDate: "Joined Oct 2023",
      verified: true,
      category: "Minimalist",
      swaps: 18,
      points: 1420,
      swapFrom: "Retro Sneakers",
      swapFromImg: retroSneakersImg,
      swapTo: "Denim Jacket",
      swapToImg: vintageDenimImg,
      content: "The community aspect is incredible. I've met so many like-minded people through clothing swaps. It makes decluttering my closet so satisfying.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      location: "Boston, MA",
      joinDate: "Joined Jan 2025",
      verified: true,
      category: "Student",
      swaps: 6,
      points: 480,
      swapFrom: "Linen Dress",
      swapFromImg: ecoLinenDressImg,
      swapTo: "Retro Shoes",
      swapToImg: retroSneakersImg,
      content: "Perfect for students on a budget! I refreshed my entire wardrobe for the semester without spending money, just by swapping things I didn't wear anymore.",
      rating: 5,
    },
    {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      location: "Seattle, WA",
      joinDate: "Joined Jun 2024",
      verified: true,
      category: "Vintage Collector",
      swaps: 15,
      points: 1100,
      swapFrom: "Knit Sweater",
      swapFromImg: cozyKnitSweaterImg,
      swapTo: "Linen Dress",
      swapToImg: ecoLinenDressImg,
      content: "Excellent trust verification system. I was skeptical at first, but everything arrived clean and exactly in the condition described. Highly recommended for vintage hunters!",
      rating: 5,
    },
    {
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      location: "Austin, TX",
      joinDate: "Joined Sep 2023",
      verified: false,
      category: "Fashion Lover",
      swaps: 9,
      points: 720,
      swapFrom: "Denim Jacket",
      swapFromImg: vintageDenimImg,
      swapTo: "Linen Dress",
      swapToImg: ecoLinenDressImg,
      content: "I love knowing that my old favorites are finding a second life with someone else. ReWear makes sustainable living practical and fun.",
      rating: 5,
    },
    {
      name: "Alex Patel",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      location: "New York, NY",
      joinDate: "Joined Feb 2024",
      verified: false,
      category: "Thrift Finder",
      swaps: 10,
      points: 820,
      swapFrom: "Retro Shoes",
      swapFromImg: retroSneakersImg,
      swapTo: "Knit Sweater",
      swapToImg: cozyKnitSweaterImg,
      content: "Great interface and points system! It makes swaps very fair because you earn points based on the item's estimated value and demand.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/70 pt-4 pb-12 md:pt-6 md:pb-16 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full filter blur-3xl opacity-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl opacity-60 animate-pulse pointer-events-none" />

        {/* Floating Leaves (3-5 decorative elements, hidden on mobile) */}
        <motion.div className="absolute text-emerald-600/10 hidden md:block" style={{ top: '12%', left: '8%' }} animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}><Leaf className="w-8 h-8 fill-emerald-600/5" /></motion.div>
        <motion.div className="absolute text-emerald-600/15 hidden md:block" style={{ top: '25%', left: '42%' }} animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}><Leaf className="w-6 h-6 fill-emerald-600/5" /></motion.div>
        <motion.div className="absolute text-blue-600/15 hidden md:block" style={{ bottom: '15%', left: '30%' }} animate={{ y: [0, -12, 0], rotate: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}><Leaf className="w-6 h-6 fill-blue-600/5" /></motion.div>
        <motion.div className="absolute text-emerald-600/10 hidden md:block" style={{ top: '50%', right: '5%' }} animate={{ y: [0, -6, 0], rotate: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}><Leaf className="w-7 h-7 fill-emerald-600/5" /></motion.div>

        {/* Flow Dot Animation styles */}
        <style>{`
          @keyframes flowDash {
            0% {
              stroke-dashoffset: 80;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .flow-dot-1 {
            animation: flowDash 5s linear infinite;
          }
          .flow-dot-2 {
            animation: flowDash 5s linear infinite;
            animation-delay: 1.25s;
          }
          .flow-dot-3 {
            animation: flowDash 5s linear infinite;
            animation-delay: 2.5s;
          }
          .flow-dot-4 {
            animation: flowDash 5s linear infinite;
            animation-delay: 3.75s;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200/50 rounded-full text-green-800 text-sm font-medium mb-4 shadow-sm"
                variants={fadeInUp}
                custom={0}
              >
                <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                Join 10,000+ Eco-Conscious Fashion Lovers
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight tracking-tight text-gray-900"
                variants={fadeInUp}
                custom={1}
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ReWear
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6 leading-relaxed font-normal"
                variants={fadeInUp}
                custom={2}
              >
                Transform your wardrobe sustainably. Swap, discover, and connect
                with a community that cares about the planet through conscious
                fashion choices.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                variants={fadeInUp}
                custom={3}
              >
                <Button
                  size="lg"
                  onClick={() => handleCTA("/items")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base font-semibold"
                >
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-green-300/80 hover:border-green-400 hover:bg-green-50/50 px-8 py-6 text-base font-semibold transition-all duration-300"
                  onClick={() => handleCTA("/items")}
                >
                  Explore Items
                </Button>
              </motion.div>

              {/* Statistics Row */}
              <motion.div
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full border-t border-green-100/50 pt-6"
                variants={fadeInUp}
                custom={4}
              >
                {[
                  ["10K+", "Happy Users"],
                  ["50K+", "Items Swapped"],
                  ["98%", "Satisfaction"],
                  ["500+", "Cities"],
                ].map(([stat, label], idx) => (
                  <div key={idx} className="text-left">
                    <div className="text-2xl md:text-3xl font-extrabold text-green-600 mb-0.5">
                      {stat}
                    </div>
                    <p className="text-gray-500 text-xs font-medium">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Premium Glassmorphism Canvas */}
            <div className="lg:col-span-5 w-full flex justify-center items-center">
              <div className="relative w-full max-w-[390px] xl:max-w-[430px] aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[4/5] bg-white/30 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-green-900/5 p-5 overflow-hidden flex items-center justify-center">
                {/* Radial glow background inside canvas */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-300/10 via-transparent to-blue-300/10 pointer-events-none" />
                
                {/* Light subtle glow spots inside canvas */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/15 rounded-full filter blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200/15 rounded-full filter blur-2xl pointer-events-none" />

                {/* SVG Swap Connectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>

                  {/* Curves to center (50, 50) */}
                  {/* Top Left to Center */}
                  <path d="M 28 22 Q 30 40 50 50" stroke="url(#lineGradient)" strokeWidth="1" fill="none" />
                  <path d="M 28 22 Q 30 40 50 50" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" fill="none" strokeDasharray="4 60" className="flow-dot-1" />

                  {/* Top Right to Center */}
                  <path d="M 72 26 Q 70 40 50 50" stroke="url(#lineGradient)" strokeWidth="1" fill="none" />
                  <path d="M 72 26 Q 70 40 50 50" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" fill="none" strokeDasharray="4 60" className="flow-dot-2" />

                  {/* Bottom Left to Center */}
                  <path d="M 30 72 Q 30 60 50 50" stroke="url(#lineGradient)" strokeWidth="1" fill="none" />
                  <path d="M 30 72 Q 30 60 50 50" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" fill="none" strokeDasharray="4 60" className="flow-dot-3" />

                  {/* Bottom Right to Center */}
                  <path d="M 72 70 Q 70 60 50 50" stroke="url(#lineGradient)" strokeWidth="1" fill="none" />
                  <path d="M 72 70 Q 70 60 50 50" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" fill="none" strokeDasharray="4 60" className="flow-dot-4" />
                </svg>

                {/* Central Swap Hub */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center cursor-pointer border border-white/20"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(16,185,129,0.4)" }}
                >
                  <motion.div 
                    className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  >
                    <Recycle className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
                  </motion.div>
                </motion.div>

                {/* Clothing Cards */}
                {cards.map((card, index) => {
                  const currentPosIndex = positions[index];
                  const pos = cardPositions[currentPosIndex];
                  return (
                    <motion.div
                      key={card.id}
                      layout
                      transition={{ type: "spring", stiffness: 45, damping: 14 }}
                      style={{
                        position: "absolute",
                        left: pos.left,
                        top: pos.top,
                        zIndex: 10,
                      }}
                      className="w-[145px] sm:w-[190px]"
                    >
                      <motion.div
                        animate={{
                          y: [0, index % 2 === 0 ? -6 : 6, 0],
                          rotate: [0, index % 2 === 0 ? 1 : -1, 0]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 7 + index * 1.2,
                          ease: "easeInOut",
                        }}
                        whileHover={{
                          y: -8,
                          rotate: index % 2 === 0 ? 3 : -3,
                          scale: 1.04,
                          transition: { duration: 0.25 }
                        }}
                        className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
                      >
                        {/* Card Image */}
                        <div className="relative h-20 sm:h-28 w-full overflow-hidden rounded-xl bg-gray-50">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Condition Badge */}
                          <span className={`absolute top-1.5 left-1.5 text-[8px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm ${card.conditionColor}`}>
                            {card.condition}
                          </span>
                          {/* Category Icon */}
                          <span className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full text-gray-600 shadow-sm flex items-center justify-center">
                            {card.category === "Jacket" && <Shirt className="w-3 h-3 text-emerald-600" />}
                            {card.category === "Dress" && <Sparkles className="w-3 h-3 text-pink-500" />}
                            {card.category === "Sweater" && <Shirt className="w-3 h-3 text-blue-500" />}
                            {card.category === "Shoes" && <ShoppingBag className="w-3 h-3 text-amber-500" />}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="mt-2">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                            {card.title}
                          </h4>
                          
                          {/* Points and User */}
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <span className="text-[10px] sm:text-xs font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100/50">
                              {card.points} pts
                            </span>
                            
                            {/* User Avatar */}
                            <div className="flex items-center gap-1">
                              <span className="w-4 h-4 sm:w-5 h-5 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 text-[8px] sm:text-[10px] text-white flex items-center justify-center font-bold">
                                {card.avatar}
                              </span>
                              <span className="text-[8px] sm:text-[10px] text-gray-500 hidden sm:inline font-medium">
                                {card.userName.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why ReWear? Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden relative">
        {/* Glow accents */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-100/10 rounded-full filter blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/10 rounded-full filter blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
              Why ReWear?
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Everything you need to swap fashion sustainably, earn rewards, and connect with a community that believes clothes deserve a second life.
            </p>
          </motion.div>

          {/* Premium Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {whyReWearFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How ReWear Works Section */}
      <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
              How ReWear Works
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Swap your clothes in three simple steps.
            </p>
          </motion.div>

          {/* Desktop & Tablet Layout */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
            {/* Left Column: Timeline */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
              className="col-span-1 lg:col-span-7 flex flex-col relative"
            >
              {/* Scroll progress vertical line */}
              <div className="absolute left-6 md:left-8 top-6 bottom-6 w-[3px] bg-slate-100 rounded-full -translate-x-1/2">
                <motion.div
                  style={{ scaleY: scrollYProgress, originY: 0 }}
                  className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-green-400 rounded-full"
                />
              </div>

              {[
                {
                  step: "01",
                  title: "Upload Shirt",
                  description:
                    "Upload photos and details of clothes you no longer wear. Our quality verification ensures everything meets our standards.",
                },
                {
                  step: "02",
                  title: "Earn Points",
                  description:
                    "Receive points for each item you donate. The better the condition and demand, the more points you earn.",
                },
                {
                  step: "03",
                  title: "Swap Confirmed",
                  description:
                    "Use your points to claim items you love, or arrange direct swaps with community members nearby.",
                },
              ].map((item, index) => {
                const stepRefs = [stepRef0, stepRef1, stepRef2];
                const isActive = activeStep === index;
                const isCompleted = index < activeStep;
                const isHovered = hoveredStep === index;

                return (
                  <div
                    key={index}
                    ref={stepRefs[index]}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => setActiveStep(index)}
                    className="relative pl-16 md:pl-20 pb-16 last:pb-4 flex flex-col items-start cursor-pointer group"
                  >
                    {/* Glowing active connector line overlay */}
                    {index < 2 && (
                      <div
                        className={`absolute left-6 md:left-8 top-12 bottom-0 w-[3px] -translate-x-1/2 transition-all duration-500 z-0 ${
                          isActive || isHovered
                            ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)] opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    )}

                    {/* Step Circle Indicator */}
                    <div className="absolute left-0 top-0 z-10">
                      <motion.div
                        animate={{
                          scale: isActive || isHovered ? 1.15 : 1.0,
                          borderColor: isActive || isHovered ? "rgba(16, 185, 129, 0.8)" : "rgba(226, 232, 240, 0.8)",
                          boxShadow: isActive
                            ? "0 0 20px rgba(16, 185, 129, 0.35), inset 0 0 10px rgba(16, 185, 129, 0.15)"
                            : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 rounded-full border bg-white/90 backdrop-blur-md flex items-center justify-center font-bold text-sm transition-all ${
                          isCompleted
                            ? "bg-gradient-to-tr from-emerald-500 to-green-400 text-white border-transparent shadow-lg shadow-emerald-500/20"
                            : isActive
                            ? "text-green-600 font-extrabold border-green-500"
                            : "text-slate-400 font-semibold border-slate-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : (
                          <span>{item.step}</span>
                        )}
                      </motion.div>
                    </div>

                    {/* Step Content */}
                    <motion.div
                      animate={{
                        opacity: isActive || isHovered ? 1.0 : 0.5,
                        x: isActive || isHovered ? 6 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-left"
                    >
                      <h3
                        className={`text-2xl font-extrabold mb-2.5 transition-colors duration-300 ${
                          isActive || isHovered ? "text-gray-900 font-black text-shadow-sm" : "text-slate-500"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {/* Right Column: Sticky Device Mockup */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
              className="col-span-1 lg:col-span-5 flex justify-center lg:sticky lg:top-32 py-4 w-full"
            >
              <div className="relative flex justify-center items-center p-2 bg-slate-50/50 rounded-[4rem] border border-slate-100 shadow-inner">
                <DeviceMockup step={activeStep} />
              </div>
            </motion.div>
          </div>

          {/* Mobile Alternating Layout */}
          <div className="block md:hidden space-y-16">
            {[
              {
                step: "01",
                title: "Upload Shirt",
                description:
                  "Upload photos and details of clothes you no longer wear. Our quality verification ensures everything meets our standards.",
              },
              {
                step: "02",
                title: "Earn Points",
                description:
                  "Receive points for each item you donate. The better the condition and demand, the more points you earn.",
              },
              {
                step: "03",
                title: "Swap Confirmed",
                description:
                  "Use your points to claim items you love, or arrange direct swaps with community members nearby.",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-8">
                {/* Step Card */}
                <div className="text-center px-4">
                  <div className="bg-gradient-to-tr from-emerald-500 to-green-400 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                    {item.description}
                  </p>
                </div>

                {/* Inline device mockup */}
                <div className="flex justify-center w-full">
                  <div className="relative p-2 bg-slate-50/50 rounded-[4rem] border border-slate-100 shadow-inner">
                    <DeviceMockup step={index} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estimate Your Points Section */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100/50 overflow-hidden relative">
        {/* Subtle background glow */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-40" 
          style={{ 
            background: "radial-gradient(circle at center, rgba(16,185,129,0.08), transparent 70%)" 
          }} 
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
              Estimate Your Points
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              See how much your clothing is worth before listing it on the swap market.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Premium Custom Selects */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
              className="col-span-1 lg:col-span-6 flex flex-col gap-6"
            >
              {/* Category */}
              <CustomSelect
                label="Category"
                icon={<Shirt className="w-3.5 h-3.5 text-emerald-600" />}
                value={calcCategory}
                options={categoryOptions}
                onChange={setCalcCategory}
              />

              {/* Condition */}
              <CustomSelect
                label="Condition"
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                value={calcCondition}
                options={conditionOptions}
                onChange={setCalcCondition}
              />

              {/* Brand Tier */}
              <CustomSelect
                label="Brand Tier"
                icon={<ShoppingBag className="w-3.5 h-3.5 text-blue-500" />}
                value={calcBrand}
                options={brandOptions}
                onChange={setCalcBrand}
              />

              {/* Trust disclaimer */}
              <span className="text-[11px] text-slate-400 font-medium text-left mt-2 flex items-center gap-1.5">
                <span>ℹ</span> Estimates are based on condition, brand tier, and community demand.
              </span>
            </motion.div>

            {/* Right Column: Premium Calculator Glassmorphic Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
              className="col-span-1 lg:col-span-6 flex justify-center w-full"
            >
              <div className="relative w-full max-w-[420px] bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] flex flex-col items-center select-none hover:border-emerald-500/25 transition-all duration-300">
                {/* Demand Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-bold shadow-sm ${getDemandMessage().color}`}>
                  {getDemandMessage().text}
                </div>

                {/* Circular Progress Ring */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-6 mt-4">
                  <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-slate-100"
                      strokeWidth="6.5"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      className={`transition-colors duration-500 ${
                        displayCalcPoints < 80 
                          ? "stroke-slate-400" 
                          : displayCalcPoints < 120 
                            ? "stroke-blue-400" 
                            : displayCalcPoints < 160 
                              ? "stroke-emerald-400" 
                              : "stroke-amber-400"
                      }`}
                      strokeWidth="6.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 42}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 42 * (1 - (displayCalcPoints / 216))
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Ring Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={calcCategory}
                        initial={{ opacity: 0, scale: 0.6, y: 5 }}
                        animate={{ opacity: 1, scale: 1.15, y: 0 }}
                        exit={{ opacity: 0, scale: 0.6, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="text-4xl filter drop-shadow-sm mb-1"
                      >
                        {selectedCategory?.icon}
                      </motion.span>
                    </AnimatePresence>

                    <span className={`text-4.5xl font-black tracking-tight transition-colors duration-500 text-3xl leading-none mt-1 ${
                      displayCalcPoints < 80 
                        ? "text-slate-500" 
                        : displayCalcPoints < 120 
                          ? "text-blue-500" 
                          : displayCalcPoints < 160 
                            ? "text-emerald-500" 
                            : "text-amber-500"
                    }`}>
                      {displayCalcPoints}
                    </span>

                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Points
                    </span>
                  </div>
                </div>

                {/* Multiplier Formula Breakdown */}
                <div className="w-full border-t border-slate-100 pt-5 flex flex-col gap-2.5 text-left mb-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Multiplier Breakdown
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold">
                    <div className="flex justify-between items-center">
                      <span>Base Category Worth ({selectedCategory?.label})</span>
                      <span className="font-bold text-slate-700">{selectedCategory?.base} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Condition Multiplier ({selectedCondition?.label})</span>
                      <span className="font-bold text-slate-700">× {selectedCondition?.mult}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Brand Quality Multiplier ({selectedBrand?.label})</span>
                      <span className="font-bold text-slate-700">× {selectedBrand?.mult}</span>
                    </div>
                    <div className="border-t border-slate-100/50 mt-1.5 pt-2 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-700">Estimated Value</span>
                      <span className={`font-extrabold flex items-center gap-0.5 ${
                        displayCalcPoints < 80 
                          ? "text-slate-500" 
                          : displayCalcPoints < 120 
                            ? "text-blue-500" 
                            : displayCalcPoints < 160 
                              ? "text-emerald-500" 
                              : "text-amber-500"
                      }`}>
                        ✨ {displayCalcPoints} Points
                      </span>
                    </div>
                  </div>
                </div>

                {/* Swap Match Ranges */}
                <div className="w-full bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-left mb-6">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Ideal Swap Targets
                  </span>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
                    {getSwapRanges().map((val, idx) => (
                      <span key={idx} className="bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-sm flex items-center gap-1">
                        ✓ {val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-2">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition shadow-lg shadow-emerald-950/10 cursor-pointer animate-pulse-subtle"
                    onClick={() => handleCTA("/add-item")}
                  >
                    List Item & Earn Points
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleCalcReset}
                    className="w-full bg-transparent hover:bg-slate-50 text-slate-400 hover:text-slate-650 font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                  >
                    Reset Calculator
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-green-50/20 to-blue-50/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
              Loved by Sustainable Fashion Enthusiasts
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              See how our community is giving clothes a second life.
            </p>
          </motion.div>

          {/* Masonry Columns Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
            {testimonials.map((testimonial, index) => {
              const badgeColors = {
                "Eco Champion": "bg-emerald-50 text-emerald-700 border-emerald-200/50",
                "Minimalist": "bg-blue-50 text-blue-700 border-blue-200/50",
                "Student": "bg-amber-50 text-amber-700 border-amber-200/50",
                "Vintage Collector": "bg-purple-50 text-purple-700 border-purple-200/50",
                "Fashion Lover": "bg-pink-50 text-pink-700 border-pink-200/50",
                "Thrift Finder": "bg-teal-50 text-teal-700 border-teal-200/50",
              };

              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="break-inside-avoid bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] hover:border-emerald-500/30 flex flex-col justify-between mb-6 transition-colors duration-300"
                >
                  <div>
                    {/* User Profile Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                            {testimonial.name}
                            {testimonial.verified && (
                              <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-0.5" title="Verified Swapper">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {testimonial.location} • {testimonial.joinDate}
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[testimonial.category] || 'bg-slate-50 text-slate-600'}`}>
                        {testimonial.category}
                      </span>
                    </div>

                    {/* Rating Bar */}
                    <div className="flex items-center justify-between mt-4 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                        {testimonial.verified ? "Verified Review" : "Community Review"}
                      </span>
                    </div>

                    {/* Recent Swap Widget (visual clothing thumbnails) */}
                    <div className="bg-slate-50/80 border border-slate-100/50 p-3 rounded-xl flex flex-col gap-2 mb-4 text-left select-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Recent Swap
                        </span>
                        <span className="text-[8px] font-extrabold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100/50 uppercase tracking-wider">
                          ✓ Confirmed
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-slate-700">
                        {/* Swap From */}
                        <div className="flex items-center gap-1.5 bg-white pl-1.5 pr-2 py-1 rounded-lg border border-slate-100 shadow-sm max-w-[45%] truncate">
                          <img
                            src={testimonial.swapFromImg}
                            alt={testimonial.swapFrom}
                            className="w-4 h-4 rounded object-cover flex-shrink-0"
                          />
                          <span className="truncate">{testimonial.swapFrom}</span>
                        </div>

                        <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />

                        {/* Swap To */}
                        <div className="flex items-center gap-1.5 bg-white pl-1.5 pr-2 py-1 rounded-lg border border-slate-100 shadow-sm max-w-[45%] truncate">
                          <img
                            src={testimonial.swapToImg}
                            alt={testimonial.swapTo}
                            className="w-4 h-4 rounded object-cover flex-shrink-0"
                          />
                          <span className="truncate">{testimonial.swapTo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quote Content */}
                    <p className="text-gray-600 mb-4 text-base italic leading-relaxed text-left">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Review Footer Stats */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Recycle className="w-3 h-3 text-emerald-500" />
                      {testimonial.swaps} swaps completed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {testimonial.points} pts
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Social Proof Trust Footer */}
          <div className="mt-12 flex flex-col items-center justify-center gap-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-emerald-800 text-sm font-semibold shadow-sm">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </span>
              <span className="font-extrabold text-emerald-700">4.9/5 Average Rating</span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-emerald-600 font-medium">Based on 2,500+ successful swaps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="py-24 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
        }}
      >
        {/* Subtle Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-60" 
          style={{ 
            background: "radial-gradient(circle at center, rgba(34,197,94,0.18), transparent 70%)" 
          }} 
        />

        {/* Slow Floating Particles */}
        {[
          { top: "15%", left: "10%", size: "w-2.5 h-2.5", duration: 7, delay: 0 },
          { top: "25%", left: "80%", size: "w-2 h-2", duration: 8, delay: 1 },
          { top: "70%", left: "15%", size: "w-1.5 h-1.5", duration: 6, delay: 2 },
          { top: "85%", left: "75%", size: "w-2.5 h-2.5", duration: 9, delay: 0.5 },
          { top: "40%", left: "90%", size: "w-1.5 h-1.5", duration: 7, delay: 1.5 },
          { top: "60%", left: "5%", size: "w-2 h-2", duration: 8, delay: 0 },
        ].map((p, idx) => (
          <motion.div
            key={idx}
            className={`absolute bg-white/20 rounded-full pointer-events-none z-0 ${p.size}`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -18, 0],
              x: [0, 8, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Gentle Leaf Outlines */}
        {[
          { top: "20%", left: "20%", rotate: [0, 10, 0], scale: 1.0, duration: 9 },
          { top: "65%", left: "85%", rotate: [0, -12, 0], scale: 0.8, duration: 8 },
          { top: "45%", left: "75%", rotate: [0, 15, 0], scale: 1.1, duration: 10 },
          { top: "75%", left: "10%", rotate: [0, -8, 0], scale: 0.9, duration: 7 },
        ].map((l, idx) => (
          <motion.div
            key={idx}
            className="absolute text-white/5 pointer-events-none z-0"
            style={{ top: l.top, left: l.left }}
            animate={{
              y: [0, -10, 0],
              rotate: l.rotate,
            }}
            transition={{
              duration: l.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Leaf className="stroke-[1]" style={{ width: `${40 * l.scale}px`, height: `${40 * l.scale}px` }} />
          </motion.div>
        ))}

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          {/* Branded Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/20 shadow-md shadow-black/5"
          >
            <Recycle className="h-7 w-7 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </motion.div>

          <motion.h2
            className="text-5xl font-extrabold mb-6 tracking-tight text-white"
            variants={fadeInUp}
            custom={1}
          >
            Ready to Transform Your Wardrobe?
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl font-light leading-relaxed"
            variants={fadeInUp}
            custom={2}
          >
            Join our growing community of fashion-forward, environmentally
            conscious individuals making a real difference.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
            variants={fadeInUp}
            custom={3}
          >
            {/* Primary CTA with timed Shimmer */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="relative overflow-hidden bg-white text-emerald-750 hover:bg-slate-50 font-bold border-2 border-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full text-emerald-700"
                onClick={() => handleCTA("/dashboard")}
              >
                Get Started Today
                <motion.div
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-12"
                  animate={{
                    left: ["-100%", "200%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 3.5,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                />
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white/15 font-bold border-2 border-white px-8 py-6 text-lg rounded-xl transition-all duration-300 w-full"
                onClick={() => handleCTA("/items")}
              >
                Browse Collection
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/90"
          >
            <span className="flex items-center gap-1">✓ Free to Join</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">No Hidden Fees</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">10,000+ Community Members</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Recycle className="h-8 w-8 text-green-400 mr-3" />
                <span className="text-2xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Making sustainable fashion accessible to everyone. Join our
                community of eco-conscious fashion lovers and help reduce
                textile waste while discovering amazing pieces.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleCTA("/how-it-works")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/items")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Browse Items
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/add-item")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    List an Item
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/community")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/sustainability")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Sustainability
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">hello@rewear.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 ReWear. All rights reserved. Making fashion sustainable,
              one swap at a time.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
