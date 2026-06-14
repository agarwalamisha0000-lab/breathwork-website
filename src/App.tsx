import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  TrendingUp, 
  Briefcase, 
  Compass, 
  MapPin, 
  Sliders, 
  Award, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  DollarSign,
  User,
  Mail,
  Phone,
  ArrowDownToLine,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { HotelInfo, Inquiry, ProposalResult } from './types.js';
import BreathingSimulator from './components/BreathingSimulator.tsx';
import RoiCalculator from './components/RoiCalculator.tsx';
import LeadDashboard from './components/LeadDashboard.tsx';

// Seed initial baseline proposal for beautiful initial viewport loading
const INITIAL_DEMO_PROPOSAL: ProposalResult = {
  title: "Deva-Prana Respiration Retreat",
  tagline: "Vedic Respiration Systems Tailored for Elite Tranquility",
  summary: "A Bespoke B2B Wellness Partnership Proposal designed for luxury boutique stays. Our high-ROI respiration curriculum adapts to your local climate and elevation to deliver physical restoration, digital decompression, and profound sleep. Hoteliers bypass heavy infrastructure and achieve unparalleled guest loyalty scores.",
  modules: [
    {
      title: "Himalayan Sunrise Prana Shodhana",
      description: "An active oxygenating respiration circuit combining classic Bhastrika and Surya Bhedana to ignite core vitality, expand chest volume, and sharpen neural pathways.",
      guestExperience: "Open-air overlooking local scenery, accompanied by dynamic warm muscle stretches and Himalayan herb vapors.",
      schedule: "Daily at 7:00 AM (40 minutes) on the Yoga Pavilion"
    },
    {
      title: "Soma Twilight Sleep-Induction",
      description: "A restorative, down-regulating sensory breath session utilizing prolonged hums (Bhramari) and deep alternate-nostril breathing to immediately trigger melatonin synthesis.",
      guestExperience: "Soft candlelight, essential oils of native jasmine, and premium floor bolster setups.",
      schedule: "Daily at 8:30 PM (45 minutes) in the Temple Gardens/Lounge"
    }
  ],
  commercialPackages: [
    {
      tierName: "Veda Curated Integration",
      priceAnnually: 180000,
      deliverables: [
        "2 Specialized seasonal respiratory guest curricula",
        "Staff training for front-desk 'wellness diagnostics'",
        "4 Original premium studio audio guides for in-room suites",
        "Quarterly physical review and brand audit"
      ],
      recommendedFor: "Resorts with existing leisure activities wanting a high-vantage premium wellness storyline."
    },
    {
      tierName: "Prana Premium Residency",
      priceAnnually: 380000,
      deliverables: [
        "Everything in Veda Curated package",
        "5-Day Physical Residency and Launch by Acharya Pranav Dev",
        "Custom botanical diffuser fluid formulated for local climate",
        "Luxury printed Guest Guided Journals embossed with resort logo",
        "Dedicated VIP client hotline for retreat group customizers"
      ],
      recommendedFor: "Signature estates striving to secure international transformational accolades."
    }
  ],
  roiProjections: {
    satisfiedScoreIncrease: "An projected +15% surge in boutique rating reviews on TripAdvisor with specific high-engagement references to 'authentic Indian wellness'.",
    roomPremiumRate: "Ability to establish a 'Prana Oasis Suite' category, commanding a ₹2,400 per night room-addon surcharge.",
    annualIncrementalRevenue: "Estimated ₹5,20,000 in incremental revenue during first 12 months based on a conservative 35% upsell attach rate.",
    marketingVantage: "Unlocks a unique B2B brand position as the exclusive regional custodian of traditional Vedic physical technologies."
  }
};

export default function App() {
  // Configured Hotel inputs
  const [hotelName, setHotelName] = useState("Vana Sanctuary Estate");
  const [location, setLocation] = useState("Rishikesh, Himalayas");
  const [roomCount, setRoomCount] = useState(35);
  const [averageRate, setAverageRate] = useState(28000);
  const [hasSpa, setHasSpa] = useState(true);
  const [targetDemographic, setTargetDemographic] = useState("Couples & Creative Leaders seeking absolute rest");
  const [focusTheme, setFocusTheme] = useState("Deep stress relief, jetlag recovery & sound sleep induction");

  // Lead registration inputs
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [applied, setApplied] = useState(false);

  // Proposal Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<ProposalResult>(INITIAL_DEMO_PROPOSAL);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // List of inquiries fetched from server
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showAdminTab, setShowAdminTab] = useState(false);

  const loadingPhrases = [
    "Analyzing resort geographical coordinates...",
    "Aligning Vedic respiratory cycles with your regional elevation...",
    "Harmorizing local air characteristics & temperature grids...",
    "Calibrating commercial ROI models & TripAdvisor review lift tables...",
    "Synthesizing customized guest journey narratives..."
  ];

  // Rotate loading phrases beautifully
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error("Failed to connect to fullstack server inquiries pipeline:", e);
    }
  };

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingPhraseIndex(0);

    const hotelInfo: HotelInfo = {
      hotelName,
      location,
      roomCount,
      averageRate,
      hasSpa,
      targetDemographic,
      focusTheme
    };

    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelInfo })
      });

      if (res.ok) {
        const data = await res.json();
        setProposal(data);
      } else {
        throw new Error("Failed server proposal query");
      }
    } catch (error) {
      console.warn("Express endpoint failed, fallback active.", error);
    } finally {
      setIsGenerating(false);
      // Scroll to proposal section smoothly
      const element = document.getElementById("proposal-report-section");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleRegisterLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    const leadPayload = {
      contactName,
      contactEmail,
      contactPhone,
      hotelInfo: {
        hotelName,
        location,
        roomCount,
        averageRate,
        hasSpa,
        targetDemographic,
        focusTheme
      }
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload)
      });

      if (res.ok) {
        setApplied(true);
        fetchInquiries(); // Sync admin table
      }
    } catch (error) {
      console.error("Failed registering lead:", error);
    }
  };

  const handleSelectInquiry = (inq: Inquiry) => {
    // Populate form from inquiry so user can customize or regenerate
    setHotelName(inq.hotelName);
    setLocation(inq.hotelInfo.location);
    setRoomCount(inq.hotelInfo.roomCount);
    setAverageRate(inq.hotelInfo.averageRate);
    setHasSpa(inq.hotelInfo.hasSpa);
    setTargetDemographic(inq.hotelInfo.targetDemographic);
    setFocusTheme(inq.hotelInfo.focusTheme);
    
    // Auto-generate proposal
    setProposal({
      title: `Bespoke Vayu Protocol at ${inq.hotelName}`,
      tagline: `Unlocking traditional respiratory wisdom for guests searching for deep restoration`,
      summary: `Tailored proposal generated on behalf of ${inq.contactName} for ${inq.hotelName} located in ${inq.hotelInfo.location}. Designed specifically for ${inq.hotelInfo.targetDemographic}.`,
      modules: INITIAL_DEMO_PROPOSAL.modules,
      commercialPackages: INITIAL_DEMO_PROPOSAL.commercialPackages,
      roiProjections: INITIAL_DEMO_PROPOSAL.roiProjections
    });

    const element = document.getElementById("proposal-architect-form");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-50 flex flex-col selection:bg-gold-200">
      
      {/* Top Luxury Branding bar */}
      <header className="border-b border-sage-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-sage-800 rounded-full flex items-center justify-center text-gold-100 shadow-md">
              <Wind className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl tracking-widest font-serif text-charcoal-900 font-bold block">
                PRANAVAYU
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gold-600 block uppercase font-medium">
                Vedic Respiration Partnerships
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-sage-600">
            <a href="#strategic-value" className="hover:text-charcoal-900 transition-colors">Why Breathwork</a>
            <a href="#proposal-architect" className="hover:text-charcoal-900 transition-colors">Proposal Architect</a>
            <a href="#guest-sensory-simulator" className="hover:text-charcoal-900 transition-colors">Sensory Simulator</a>
            <a href="#resort-roi-calculator" className="hover:text-charcoal-900 transition-colors">ROI Calculator</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAdminTab(!showAdminTab);
                const block = document.getElementById("admin-and-leads-registry");
                if (block) block.scrollIntoView({ behavior: "smooth" });
              }}
              className={`hidden sm:flex text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                showAdminTab 
                  ? 'bg-sage-100 border-sage-300 text-sage-800 font-bold' 
                  : 'bg-white hover:bg-sage-50 border-sage-200 text-sage-500'
              }`}
            >
              {showAdminTab ? "Close Admin Leads" : "Admin Leads Tab"}
            </button>
            <a
              href="#proposal-architect"
              className="px-5 py-2.5 bg-sage-800 hover:bg-sage-950 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-sage-800/10"
            >
              Design Proposal
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full">
        
        {/* HERO SECTION */}
        <section className="bg-white py-16 md:py-24 border-b border-sage-100 relative overflow-hidden">
          {/* Subtle Organic Background Patterns */}
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold-50/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-10 bottom-10 w-96 h-96 bg-sage-50 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 border border-gold-200 rounded-full text-gold-800 text-[10px] font-mono tracking-widest uppercase">
                <Sparkles className="w-3 h-3" /> Bespoke Indian Breathwork Consultancy
              </div>
              
              <h1 id="hero-main-title" className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal-900 tracking-tight leading-tight">
                Transform Stays into <span className="italic text-gold-600 block sm:inline">Vedic Sanctuaries.</span>
              </h1>
              
              <p id="hero-main-desc" className="text-base md:text-lg bg-[#ffffff] border-2 border-[#79b944] text-[#efab29] p-4.5 rounded-2xl leading-relaxed max-w-2xl shadow-sm">
                We design bespoke, scientifically-anchored respiratory programs for luxury boutique hotels and wellness resorts with 15–100 rooms. Bypass generic wet-spa lists. Deliver unforgettable guest restoration with zero infrastructural friction, generating proven TripAdvisor satisfaction and high-margin occupancy yields.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#proposal-architect"
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-gold-500/20 flex items-center gap-2"
                >
                  Architect Bespoke Proposal <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#guest-sensory-simulator"
                  className="px-6 py-3 bg-sage-50 hover:bg-sage-100 text-sage-800 border border-sage-200 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all"
                >
                  Test sensory simulator
                </a>
              </div>

              {/* Trust & Lineage Indicators */}
              <div className="pt-8 border-t border-sage-100 grid grid-cols-3 gap-6">
                <div>
                  <span className="text-3xl font-serif font-bold text-sage-950 block">₹0</span>
                  <span className="text-[10px] font-mono text-sage-500 uppercase tracking-widest block">Infrastructural Setup</span>
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-sage-950 block">100%</span>
                  <span className="text-[10px] font-mono text-sage-500 uppercase tracking-widest block">Vedic Lineage Roots</span>
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-sage-950 block">+15%</span>
                  <span className="text-[10px] font-mono text-sage-500 uppercase tracking-widest block">OTA Review Lift</span>
                </div>
              </div>
            </div>

            {/* Right Side: Portrait illustration representing peace */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gold-500/5 rounded-[40px] rotate-3 blur-sm" />
              <div className="relative border border-sage-200 bg-sage-100 rounded-[40px] overflow-hidden p-8 aspect-[4/5] flex flex-col justify-between shadow-xl">
                
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono tracking-widest text-sage-500">RESORT INTEGRATION BLUEPRINT</span>
                  <Wind className="w-5 h-5 text-gold-500 animate-pulse" />
                </div>

                <div className="space-y-4 my-auto py-6">
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/5 space-y-1 shadow-md">
                    <span className="text-[10px] font-mono text-gold-600 block uppercase font-bold">1. SUNRISE MODULE</span>
                    <span className="text-base font-serif text-charcoal-900 font-bold block">Bhastrika Oxygenation Circuit</span>
                    <span className="text-[11px] text-sage-500 block">Purifies cellular CO2, boosts immune adaptation, energizes day tours.</span>
                  </div>

                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/5 space-y-1 shadow-md">
                    <span className="text-[10px] font-mono text-gold-600 block uppercase font-bold">2. SLEEP INTEGRATION</span>
                    <span className="text-base font-serif text-charcoal-900 font-bold block">Pranava Humming Resonation</span>
                    <span className="text-[11px] text-sage-500 block">Triggers immediate deep vagus activation for deep, luxurious rest.</span>
                  </div>
                </div>

                <div className="border-t border-sage-200/50 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-sage-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white">AP</div>
                    <div>
                      <span className="text-xs font-semibold text-charcoal-900 block leading-none">Acharya Pranav Dev</span>
                      <span className="text-[9px] text-sage-400 font-mono">Principal Consultant</span>
                    </div>
                  </div>
                  <span className="bg-gold-500 text-charcoal-950 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">VEDIC ROOT CERTIFIED</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION: STRATEGIC B2B VALUE PROPOSITION */}
        <section id="strategic-value" className="py-20 bg-charcoal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono text-gold-600 tracking-widest block uppercase font-bold">The ROI of Resonant Wellness</span>
              <h2 className="text-3xl md:text-4.5xl font-serif text-charcoal-900 leading-tight">
                Why Luxury Boutique Resorts Partner With Us
              </h2>
              <p className="text-sm md:text-base text-sage-600 max-w-2xl mx-auto">
                General Managers of independent hotels face two distinct challenges: guest reviews are difficult to defend, and conventional spas are incredibly expensive to build. Bespoke respiration offers a massive competitive vantage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-white border border-sage-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600 border border-gold-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-charcoal-900 font-semibold tracking-wide">
                  Tangible TripAdvisor ROI
                </h3>
                <p className="text-xs text-sage-600 leading-relaxed">
                  Guests travelers booking premium boutique stays look strictly for transformational experiences, not just accommodation. Integrating bespoke Vedic breathwork produces intense reviews emphasizing "profound sleep" and "thoughtful luxury", triggering higher booking attachment rates.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-sage-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-500 border border-gold-100">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-charcoal-900 font-semibold tracking-wide">
                  Zero Construction Drag
                </h3>
                <p className="text-xs text-sage-600 leading-relaxed">
                  Unlike spas requiring wet plumbing, swimming chambers, or hefty architectural investments, breathwork utilizes your existing rooftops, sunset decks, or quiet forest spaces. We deliver physical and digital guide assets immediately without operational headaches.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-sage-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-500 border border-gold-100">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-charcoal-900 font-semibold tracking-wide">
                  Climatic Adaptation
                </h3>
                <p className="text-xs text-sage-600 leading-relaxed">
                  Our core pranayama scripts are geographically sensitive. If your property is high-altitude, we provide oxygen-retaining warming respiratory scripts. If coastal Kerala, we integrate cooling, rhythm-balancing pranayama to lower core heat and align with the ocean breakers.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: DYNAMIC PROPOSAL ARCHITECT */}
        <section id="proposal-architect" className="py-20 bg-white border-y border-sage-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="proposal-architect-form">
              
              {/* Left Side Form Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 border border-gold-200 rounded-full text-gold-800 text-[10px] font-mono tracking-widest uppercase mb-4">
                    <Sliders className="w-3.5 h-3.5" /> AI Customization Space
                  </div>
                  <h2 className="text-3xl font-serif text-charcoal-900 leading-snug tracking-wide mb-3">
                    Design Your Signature Proposal
                  </h2>
                  <p className="text-xs text-sage-600 mb-6 leading-relaxed">
                    General Managers and operators may enter their specific spatial parameters. Our server-side model integrates native coordinates and Vedic respiration scripts to build an immediate commercial and functional program outline.
                  </p>

                  <form onSubmit={handleGenerateProposal} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Resort / Hotel Name</label>
                      <input
                        id="hotel-name-input"
                        type="text"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all font-serif font-semibold"
                        placeholder="e.g. Tree of Life Retreat"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Geographical Location</label>
                      <input
                        id="hotel-location-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all font-mono"
                        placeholder="e.g. Jaipur Dunes, Rajasthan or Himalayas"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Room Count (15-100)</label>
                        <input
                          id="hotel-rooms-input"
                          type="number"
                          min="15"
                          max="100"
                          value={roomCount}
                          onChange={(e) => setRoomCount(parseInt(e.target.value) || 0)}
                          className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Average Room Rate (₹)</label>
                        <input
                          id="hotel-rate-input"
                          type="number"
                          value={averageRate}
                          step="1000"
                          onChange={(e) => setAverageRate(parseInt(e.target.value) || 0)}
                          className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Core Guest Demographic</label>
                      <select
                        id="hotel-demographic-select"
                        value={targetDemographic}
                        onChange={(e) => setTargetDemographic(e.target.value)}
                        className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all"
                      >
                        <option value="High-stress corporate executives & creative founders">High-stress corporate executives & creative founders</option>
                        <option value="Honeymoon couples & luxury wellness travel seekers">Honeymoon couples & luxury wellness travel seekers</option>
                        <option value="Eco-travelers & digital nomads seeking mental reset">Eco-travelers & digital nomads seeking mental reset</option>
                        <option value="Elite international families seeking cultural transformation">Elite international families seeking cultural transformation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono tracking-wider text-sage-500 block uppercase font-medium mb-1">Core Wellness Theme / Frustration</label>
                      <input
                        id="hotel-theme-input"
                        type="text"
                        value={focusTheme}
                        onChange={(e) => setFocusTheme(e.target.value)}
                        className="w-full bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none transition-all"
                        placeholder="e.g. High guest anxiety, spa feels generic, lack of outdoor ideas"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-sage-50 p-3 rounded-xl border border-sage-100">
                      <input
                        id="hotel-spa-checkbox"
                        type="checkbox"
                        checked={hasSpa}
                        onChange={(e) => setHasSpa(e.target.checked)}
                        className="w-4 h-4 text-gold-500 focus:ring-gold-500 border-sage-300 rounded"
                      />
                      <div className="text-xs">
                        <label htmlFor="hotel-spa-checkbox" className="font-semibold text-charcoal-900 block">Resort currently has a physical spa</label>
                        <span className="text-sage-500 text-[11px]">Enables us to train spa therapists as breath hosts.</span>
                      </div>
                    </div>

                    <button
                      id="generate-proposal-btn"
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-3 px-5 bg-sage-800 hover:bg-sage-950 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-sage-800/10 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          CALIBRATING PROPOSAL...
                        </>
                      ) : (
                        <>
                          <Compass className="w-4 h-4 text-gold-400" /> CALIBRATE BESPOKE PROPOSAL
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side Proposal Result Output */}
              <div 
                className="lg:col-span-7 bg-sage-50/50 border border-sage-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
                id="proposal-report-section"
              >
                
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6"
                    >
                      <div className="relative w-20 h-20">
                        {/* Meditative spinning loading ring */}
                        <div className="absolute inset-0 border-4 border-sage-200 border-t-gold-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 border-4 border-sage-100 border-b-sage-500 rounded-full animate-spin-slow" />
                        <Wind className="w-6 h-6 text-gold-600 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-gold-600 tracking-widest block uppercase font-bold">Vedic Calculation Matrix</span>
                        <h4 className="text-lg font-serif text-charcoal-900 font-semibold">{loadingPhrases[loadingPhraseIndex]}</h4>
                        <p className="text-xs text-sage-500 max-w-sm mx-auto">
                          Our server model is assembling physiological timelines, native altitude indicators, and hotelier ROI metrics.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col justify-between space-y-8"
                    >
                      <div>
                        {/* Dynamic Header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sage-100 pb-5 mb-5">
                          <div>
                            <span className="text-[10px] font-mono text-gold-600 block uppercase font-bold tracking-widest mb-1">PARTNERSHIP STRATEGY PROPOSAL</span>
                            <h3 className="text-2.5xl md:text-3xl font-serif text-sage-950 font-bold leading-tight">
                              {proposal.title}
                            </h3>
                            <p className="text-xs text-sage-500 font-serif italic mt-1 leading-normal">
                              "{proposal.tagline}"
                            </p>
                          </div>
                          
                          <span className="bg-gold-500 text-charcoal-950 text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                            ₹{(proposal.commercialPackages[0]?.priceAnnually || 180000).toLocaleString("en-IN")} Base Retainer
                          </span>
                        </div>

                        {/* Summary Block */}
                        <div className="space-y-4">
                          <p className="text-xs text-sage-700 leading-relaxed bg-white border border-sage-100 p-4 rounded-xl">
                            {proposal.summary}
                          </p>

                          {/* Sessions Outline Title */}
                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-mono tracking-widest text-gold-600 uppercase font-bold">Signature Respiratory Modules</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {proposal.modules.map((mod, idx) => (
                                <div key={idx} className="bg-white border border-sage-100 p-4 rounded-xl space-y-2">
                                  <span className="text-[10px] font-mono text-sage-400 block uppercase">{mod.schedule}</span>
                                  <span className="text-sm font-serif font-bold text-charcoal-900 block leading-tight">{mod.title}</span>
                                  <p className="text-[11px] text-sage-600 leading-relaxed">{mod.description}</p>
                                  <span className="block text-[11px] text-sage-500 font-mono pt-1 border-t border-sage-50">
                                    <strong className="text-sage-700">Aura Pairing:</strong> {mod.guestExperience}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ROI Indicators */}
                          <div className="space-y-3 pt-3 border-t border-sage-100">
                            <h4 className="text-xs font-mono tracking-widest text-gold-600 uppercase font-bold">Projected Commercial Metrics</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                              <div className="bg-white border border-sage-100 p-3 rounded-lg flex items-start gap-2.5">
                                <Award className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-sage-400 font-mono uppercase block">Satisfaction Lift</span>
                                  <span className="text-xs text-sage-800 font-medium">{proposal.roiProjections.satisfiedScoreIncrease}</span>
                                </div>
                              </div>
                              <div className="bg-white border border-sage-100 p-3 rounded-lg flex items-start gap-2.5">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-sage-400 font-mono uppercase block">Room Surcharge potential</span>
                                  <span className="text-xs text-sage-800 font-medium">{proposal.roiProjections.roomPremiumRate}</span>
                                </div>
                              </div>
                              <div className="bg-white border border-sage-100 p-3 rounded-lg flex items-start gap-2.5">
                                <DollarSign className="w-4 h-4 text-gold-600 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-sage-400 font-mono uppercase block">Direct Yield Increase</span>
                                  <span className="text-xs text-sage-800 font-medium">{proposal.roiProjections.annualIncrementalRevenue}</span>
                                </div>
                              </div>
                              <div className="bg-white border border-sage-100 p-3 rounded-lg flex items-start gap-2.5">
                                <Compass className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-sage-400 font-mono uppercase block">Brand vantage</span>
                                  <span className="text-xs text-sage-800 font-medium">{proposal.roiProjections.marketingVantage}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Lead Capturer form inside the Proposal result */}
                      <div className="pt-5 border-t border-sage-100 bg-white/40 p-4 rounded-2xl border border-sage-100">
                        {applied ? (
                          <div className="text-center py-4 text-emerald-600 space-y-1">
                            <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 animate-pulse" />
                            <span className="block text-sm font-bold uppercase tracking-widest font-mono">Application Submitted</span>
                            <span className="text-xs text-sage-500 block">We have registered your lead. Acharya Dev will contact your hotel office in 24 hours.</span>
                          </div>
                        ) : (
                          <form onSubmit={handleRegisterLead} className="space-y-3">
                            <div className="flex gap-2 items-center text-xs text-sage-700 font-semibold mb-1">
                              <BookOpen className="w-4 h-4 text-gold-500" />
                              <span>Register Interest to Secure Regional Exclusive Rights</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="relative">
                                <User className="w-3.5 h-3.5 absolute left-3 top-3.5 text-sage-400" />
                                <input
                                  id="contact-name-input"
                                  type="text"
                                  placeholder="General Manager Name"
                                  value={contactName}
                                  onChange={(e) => setContactName(e.target.value)}
                                  className="w-full bg-white border border-sage-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <Mail className="w-3.5 h-3.5 absolute left-3 top-3.5 text-sage-400" />
                                <input
                                  id="contact-email-input"
                                  type="email"
                                  placeholder="Corporate Email"
                                  value={contactEmail}
                                  onChange={(e) => setContactEmail(e.target.value)}
                                  className="w-full bg-white border border-sage-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <Phone className="w-3.5 h-3.5 absolute left-3 top-3.5 text-sage-400" />
                                <input
                                  id="contact-phone-input"
                                  type="text"
                                  placeholder="Contact Phone"
                                  value={contactPhone}
                                  onChange={(e) => setContactPhone(e.target.value)}
                                  className="w-full bg-white border border-sage-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-sage-950 focus:border-gold-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            
                            <button
                              id="submit-proposal-interest-btn"
                              type="submit"
                              className="w-full py-2.5 px-4 bg-gold-500 hover:bg-gold-600 text-charcoal-950 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                            >
                              <ArrowDownToLine className="w-4 h-4 text-charcoal-950" /> Send Application & Lock Strategy
                            </button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>

          </div>
        </section>

        {/* SECTION: INTERACTIVE SENSORY GUEST EXPERIENCIAS */}
        <section className="py-20 bg-charcoal-950 text-white border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[10px] font-mono text-gold-500 tracking-widest block uppercase font-bold">DIGITAL IN-ROOM PROTOTYPING</span>
              <h2 className="text-3xl md:text-4.5xl font-serif text-white tracking-wide">
                Immersive Audio & Respiratory Coach
              </h2>
              <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
                Test the client interface prototype below. We upload these high-fidelity biofeedback respiratory trainers directly into your guest suites, providing high-end wellness without human staffing hurdles.
              </p>
            </div>

            <BreathingSimulator />

          </div>
        </section>

        {/* SECTION: DYNAMIC ROI CALCULATIONS */}
        <section className="py-20 bg-charcoal-50 border-b border-sage-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-mono text-gold-600 tracking-widest block uppercase font-bold">THE MATHEMATICS OF BRANDING</span>
              <h2 className="text-3xl font-serif text-charcoal-900">
                Revenue yield & Occupancy Models
              </h2>
              <p className="text-xs text-sage-600 leading-relaxed">
                Luxury hospitality demands high margins. Calculate your returns below to justify an annual retaining budget of ₹1.8L - ₹3.8L with Acharya Pranav Dev.
              </p>
            </div>

            <RoiCalculator />

          </div>
        </section>

        {/* SECTION: ADMIN TRACKER LEADS */}
        <section id="admin-and-leads-registry" className={`py-16 bg-white border-b border-sage-100 ${showAdminTab ? 'block' : 'hidden'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LeadDashboard 
              inquiries={inquiries} 
              onRefresh={fetchInquiries} 
              onSelectInquiry={handleSelectInquiry}
            />
          </div>
        </section>

        {/* SECTION: INSTRUCTOR BIOGRAPHY & TRUST */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-4 relative">
              <div className="absolute inset-0 bg-gold-200/20 rounded-[30px] -rotate-3 blur-sm" />
              <div className="relative border border-sage-200 bg-gold-50 p-6 rounded-[30px] shadow-lg text-center space-y-6">
                
                <div className="w-24 h-24 bg-sage-800 rounded-full mx-auto flex items-center justify-center text-3xl font-bold font-serif text-gold-100">
                   AP
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-serif font-bold text-charcoal-900 leading-none">Acharya Pranav Dev</h4>
                  <span className="text-xs font-mono text-gold-600 uppercase tracking-wider block">Lead Wellness Architect</span>
                  <span className="text-[10px] text-sage-400 block font-mono mt-1">Himalayan Lineage • Rishikesh Master</span>
                </div>

                <div className="bg-white/50 border border-sage-100 p-4 rounded-xl text-xs space-y-1">
                  <span className="text-sage-700 block font-semibold">"Prana is the carrier of awareness. Aligned with modern hospitality, it yields peace of mind and remarkable brand loyalty."</span>
                </div>

                <div className="flex justify-center gap-6 text-[11px] font-mono text-sage-500">
                  <div>
                    <strong className="text-sage-800 block text-sm">12YRS+</strong>
                    <span>Experience</span>
                  </div>
                  <div className="border-l border-sage-200 pl-4">
                    <strong className="text-sage-800 block text-sm">240+</strong>
                    <span>Hotels Trained</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs font-mono text-gold-600 tracking-widest block uppercase font-bold">THE CONSULTING PARTNER</span>
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 leading-tight">
                Deep Traditional Lineage Aligned with Modern luxury Metrics.
              </h2>
              
              <div className="space-y-4 text-xs text-sage-700 leading-relaxed">
                <p>
                  Pranav Dev represents a modern lineage of traditional Vedic scholarship. Trained in the foothills of Rishikesh, India, he holds certifications in advanced *Karana* and *Pranayama* practices. His clinical understanding of respiratory neurology enables him to strip away esoteric abstractions, wrapping ancient technologies in clear, highly operational frameworks that suit high-stress hospitality environments.
                </p>
                <p>
                  "We recognize that General Managers do not need a spiritual sermon. They need guest satisfaction scorecards, reliable operating manuals, and automated in-room digital assets that help staff onboard arriving travelers instantly. My mission is to establish breathwork as the ultimate standalone brand story for luxurious estates worldwide."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sage-100">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-charcoal-900 block leading-none">Staff Certification Kits</span>
                    <span className="text-[11px] text-sage-500 block leading-normal mt-1">Complete diagnostic charts enabling front-office teams to evaluate arriving guest stress.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-charcoal-900 block leading-none">TripAdvisor Review Boost</span>
                    <span className="text-[11px] text-sage-500 block leading-normal mt-1">Specific guidelines on how to market and feature bespoke respiration in public resort listings.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-charcoal-950 text-white/50 border-t border-white/5 py-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-charcoal-950 font-bold">
                PV
              </div>
              <span className="text-base tracking-widest font-serif text-white block">PRANAVAYU SOLUTIONS</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#strategic-value" className="hover:text-white transition-all">Values Matrix</a>
              <a href="#proposal-architect" className="hover:text-white transition-all">Proposal Architect</a>
              <a href="#guest-sensory-simulator" className="hover:text-white transition-all">Sensory Simulator</a>
              <a href="#resort-roi-calculator" className="hover:text-white transition-all">ROI Calculator</a>
            </div>
          </div>

          <p className="max-w-3xl mx-auto text-[11px] leading-relaxed">
            Legal Disclaimer: PranaVayu is a registered hospitality consulting entity owned by Acharya Pranav Dev. Respiration and breathing protocols are certified for physical relaxation, stress mitigation, and brand story improvement. Vedic breath methodologies calculated by Gemini AI are calibrated strictly to model typical boutique hospitality yields. Individual room ADR up-chargings vary depending on international resort locations and regional hospitality environments.
          </p>

          <p className="text-[10px] text-white/20 font-mono mt-4">
            © 2026 PranaVayu Indian Respiration Partnerships. All Rights Reserved. Produced in collaboration with Google AI Studio.
          </p>

        </div>
      </footer>

    </div>
  );
}
