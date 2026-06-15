import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Award, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  ArrowDownToLine,
  Activity,
  Menu,
  X,
  Building,
  Shield,
  Plane,
  Heart,
  Zap,
  Moon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Upload,
  Globe,
  Plus,
  Compass,
  Sliders,
  DollarSign,
  Trash2
} from 'lucide-react';
import { HotelInfo, Inquiry, ProposalResult } from './types.js';
import BreathingSimulator from './components/BreathingSimulator.tsx';
import RoiCalculator from './components/RoiCalculator.tsx';
import LeadDashboard from './components/LeadDashboard.tsx';
// @ts-expect-error
import amishaBgDefault from './assets/images/amisha_bg_1781468937770.jpg';

// Pre-seeded high-fidelity gallery images representing high-end wellness atmospheres
const INITIAL_GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    caption: "Deep Pranayama alignment at a luxury resort in Himalayas.",
    tag: "Pranayama"
  },
  {
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
    caption: "Sunset Breath Purification circles guiding guests at coastal retreat.",
    tag: "Residency"
  },
  {
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
    caption: "Sound healing vibration therapy with premium bronze singing bowls.",
    tag: "Chakras"
  },
  {
    url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop",
    caption: "Absolute Stillness - morning Vedic breathing on a tranquil beach stage.",
    tag: "Vedic Wisdom"
  },
  {
    url: "https://images.unsplash.com/photo-1511295742364-92767fa62d9f?q=80&w=600&auto=format&fit=crop",
    caption: "Restorative Yoga Nidra layouts crafted with pure linen bolsters.",
    tag: "Sleep Better"
  },
  {
    url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
    caption: "Gentle alternate-nostril breathing (Nadi Shodhana) for stress release.",
    tag: "Nervous System"
  },
];

// Seed initial B2B proposal for hotel directors seeking alignment
const INITIAL_DEMO_PROPOSAL: ProposalResult = {
  title: "Vedic Respiratory Integration Program",
  tagline: "Somatic Breathwork & Classic Pranayama Tailored for Elite Hotels",
  summary: "A Bespoke B2B Wellness Partnership Program designed for luxury boutique resorts. This high-ROI respiration curriculum is curated by Amisha Agarwal, drawing from her 8 years of intensive personal practice to deliver nervous system regulation, altitude adaptation, and deep recovery, transforming sleep metrics and TripAdvisor rating lists.",
  modules: [
    {
      title: "Himalayan Sunrise Prana Shodhana",
      description: "An active oxygenating respiration circuit combining classic Bhastrika and Surya Bhedana to ignite core vitality, expand alveolar capacity, and sharpen executive concentration.",
      guestExperience: "Open-air overlooking scenic vistas, accompanied by active sensory aromatic pairings.",
      schedule: "Daily at 7:00 AM (40 minutes) on the Resort Pavilion"
    },
    {
      title: "Soma Twilight Sleep-Induction",
      description: "A highly restorative quiet sensory breath session utilizing prolonged hums (Bhramari) and deep slow rhythmic alternate-nostril pranayama to instantly trigger deep biological comfort.",
      guestExperience: "Soft candle lighting, organic native jasmine diffusers, and deep acoustic bolster layouts.",
      schedule: "Daily at 8:30 PM (45 minutes) in the Sanctuary/Lounge"
    }
  ],
  commercialPackages: [
    {
      tierName: "Veda Curated Integration",
      priceAnnually: 180000,
      deliverables: [
        "2 Specialized seasonal guest-facing respiratory curricula",
        "Staff training modules for front-of-house diagnostics",
        "4 Original premium studio audio guides for in-suite meditation tablets",
        "Quarterly physical review audits"
      ],
      recommendedFor: "Boutique hotels with existing wellness spaces wanting a deep authentic lineage story."
    },
    {
      tierName: "Prana Premium Residency",
      priceAnnually: 380000,
      deliverables: [
        "Full seasonal guest custom curricula integration",
        "5-Day Physical Residency Workshop launch by Amisha Agarwal",
        "Custom organic botanical aromatherapy fluids customized-for-climate",
        "Printed Guest Guided Journals bound with resort logo embossing",
        "Direct VIP hotline access for luxury group reservation managers"
      ],
      recommendedFor: "Signature retreats striving to achieve standard-setting global wellness accolades."
    }
  ],
  roiProjections: {
    satisfiedScoreIncrease: "An projected +12% to +15% increase in guest review ratings specifically naming authentic wellness.",
    roomPremiumRate: "Capacity to declare and upsell 'Prana Sanctuary Rooms', commanding an extra ₹2,500/night premium.",
    annualIncrementalRevenue: "Estimated ₹5,80,000 in direct auxiliary revenue based on a standard 35% upsell attachment rate.",
    marketingVantage: "Differentiates your resort from cookie-cutter chains using generic gym layouts."
  }
};

export default function App() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminTab, setShowAdminTab] = useState(false);

  // User uploaded portrait/image states
  const [userUploadedBg, setUserUploadedBg] = useState<string>("");
  const [bgUrl, setBgUrl] = useState<string>(amishaBgDefault);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Gallery dynamic states
  const [galleryImages, setGalleryImages] = useState(INITIAL_GALLERY_IMAGES);
  const [isGalleryEditUnlocked, setIsGalleryEditUnlocked] = useState(false);

  // Contact Form Inputs
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientType, setClientType] = useState("Individual");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // B2B proposal architecture toggles & inputs
  const [showB2BPlanner, setShowB2BPlanner] = useState(false);
  const [hotelName, setHotelName] = useState("Aman Vana Retreat");
  const [resortLocation, setResortLocation] = useState("Rishikesh, Himalayas");
  const [roomCount, setRoomCount] = useState(38);
  const [averageRate, setAverageRate] = useState(25000);
  const [hasSpa, setHasSpa] = useState(true);
  const [targetDemographic, setTargetDemographic] = useState("Global creative and corporate leaders seeking digital detox");
  const [focusTheme, setFocusTheme] = useState("Somatic stress relief, time zone re-indexing & nervous equilibrium");

  // Proposals & Inquiry Database
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<ProposalResult>(INITIAL_DEMO_PROPOSAL);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const loadingPhrases = [
    "Analyzing geographical altitude & oxygen coefficients...",
    "Drafting authentic Ayurvedic respiratory modules...",
    "Formulating custom acoustic drone and oil pairings...",
    "Projecting ADR premium room yields & loyalty rates..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Synchronize Backoffice console presence with gallery portfolio edit credentials
  useEffect(() => {
    if (showAdminTab) {
      setIsGalleryEditUnlocked(true);
    }
  }, [showAdminTab]);

  // Check if saved background image is present, otherwise load fallback
  useEffect(() => {
    fetch("/amisha_bg.jpg", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setBgUrl(`/amisha_bg.jpg?t=${Date.now()}`);
        } else {
          setBgUrl(amishaBgDefault);
        }
      })
      .catch(() => {
        setBgUrl(amishaBgDefault);
      });
    
    fetchInquiries();
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data);
      }
    } catch (e) {
      console.error("Failed to load persistent gallery items:", e);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error("Failed to connect to fullstack enquiries pipeline:", e);
    }
  };

  const processImageFile = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setUserUploadedBg(fileUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const response = await fetch("/api/upload-hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String })
        });
        if (response.ok) {
          const data = await response.json();
          setBgUrl(`${data.url}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Error saving face image to server:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      processImageFile(files[0]);
    }
  };

  const handleCreateGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          // 1. Upload base64 to server to convert to file
          const uploadRes = await fetch("/api/gallery/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64String })
          });
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            const serverUrl = uploadData.url;
            
            // Prompt the owner for caption and tag to make it super rich!
            const captionInput = prompt("Enter caption for this image:", `Pranayama session at luxury boutique resort.`);
            const tagInput = prompt("Enter category tag:", "Pranayama");
            
            const newImage = {
              url: serverUrl,
              caption: captionInput || "Breathwork Integration Session",
              tag: tagInput || "Pranayama"
            };
            
            const updatedGallery = [newImage, ...galleryImages];
            setGalleryImages(updatedGallery);
            
            // 2. Persist updated list
            await fetch("/api/gallery/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gallery: updatedGallery })
            });
          }
        } catch (error) {
          console.error("Failed uploading photo to portfolio gallery:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = async (indexToRemove: number) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      const updatedGallery = galleryImages.filter((_, idx) => idx !== indexToRemove);
      setGalleryImages(updatedGallery);
      try {
        await fetch("/api/gallery/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gallery: updatedGallery })
        });
      } catch (e) {
        console.error("Failed to delete picture from backend:", e);
      }
    }
  };

  // Submit contact form to the real full-stack Express database!
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress) return;

    const leadPayload = {
      contactName: fullName,
      contactEmail: emailAddress,
      contactPhone: phoneNumber || "Not provided",
      hotelInfo: {
        hotelName: clientType === "Individual" ? `Private: ${fullName}` : `${clientType} Consultation`,
        location: clientType === "Individual" ? "Delhi / Hyderabad" : "Remote / Corporate Office",
        roomCount: clientType === "Corporate" ? 50 : 1,
        averageRate: 0,
        hasSpa: false,
        targetDemographic: clientType,
        focusTheme: message || "General Breathwork Coaching Inquiry"
      }
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload)
      });
      if (response.ok) {
        setFormSubmitted(true);
        fetchInquiries(); // Refresh the administration ledger instantly!
      }
    } catch (error) {
      console.error("Failed submitting contact details:", error);
      setFormSubmitted(true); // Fallback graceful notification
    }
  };

  // Generate dynamic strategic partnership proposal via Gemini or local Vedic simulator
  const handleAIProposalGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingPhraseIndex(0);

    const hotelInfo: HotelInfo = {
      hotelName,
      location: resortLocation,
      roomCount,
      averageRate,
      hasSpa,
      targetDemographic,
      focusTheme
    };

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelInfo })
      });

      if (response.ok) {
        const data = await response.json();
        setProposal(data);
      }
    } catch (e) {
      console.warn("Express proposal pipeline failed, using simulation:", e);
    } finally {
      setIsGenerating(false);
      // Scroll smoothly to output
      const element = document.getElementById("proposal-results-block");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectInquiry = (inq: Inquiry) => {
    setHotelName(inq.hotelName);
    setResortLocation(inq.hotelInfo.location);
    setRoomCount(inq.hotelInfo.roomCount);
    setAverageRate(inq.hotelInfo.averageRate);
    setHasSpa(inq.hotelInfo.hasSpa);
    setTargetDemographic(inq.hotelInfo.targetDemographic);
    setFocusTheme(inq.hotelInfo.focusTheme);

    setProposal({
      title: `Vedic Integration for ${inq.hotelName}`,
      tagline: `Authentic traditional respiratory design customized for ${inq.contactName}`,
      summary: `Tailored proposal generated directly from your ledger request for ${inq.hotelName} located in ${inq.hotelInfo.location}. Designed meticulously for ${inq.hotelInfo.targetDemographic}.`,
      modules: INITIAL_DEMO_PROPOSAL.modules,
      commercialPackages: INITIAL_DEMO_PROPOSAL.commercialPackages,
      roiProjections: INITIAL_DEMO_PROPOSAL.roiProjections
    });

    const element = document.getElementById("proposal-planner-section");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 flex flex-col font-sans relative selection:bg-primary-purple/30 selection:text-white">
      
      {/* Absolute floating mystical background particles & ambient grids */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[160px] opacity-60 animate-pulse duration-[8000ms]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#A855F7]/10 rounded-full blur-[200px] opacity-40 animate-pulse duration-[12000ms]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Element */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => smoothScroll('hero-section')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#C084FC] p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center text-bright-purple font-display font-bold">
                <Wind className="w-5 h-5 text-bright-purple" />
              </div>
            </div>
            <div>
              <span className="text-lg md:text-xl font-syne tracking-widest text-white leading-none block font-extrabold uppercase">
                AMISHA AGARWAL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#C084FC] block uppercase pt-0.5">
                Vedic Breathwork & Respiration
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono uppercase tracking-widest text-gray-400">
            <button onClick={() => smoothScroll('about-brand')} className="hover:text-[#C084FC] transition-colors cursor-pointer">About</button>
            <button onClick={() => smoothScroll('who-i-serve')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Syllabus</button>
            <button onClick={() => smoothScroll('what-i-teach')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Methodology</button>
            <button onClick={() => smoothScroll('interactive-box-breathing')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Box Breather</button>
            <button onClick={() => smoothScroll('moments-of-breath')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Gallery</button>
            <button onClick={() => smoothScroll('testimonials')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Reviews</button>
            <button onClick={() => smoothScroll('contact-form-section')} className="hover:text-[#C084FC] transition-colors cursor-pointer">Contact</button>
          </nav>

          {/* Call to Actions on Header */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                setShowAdminTab(!showAdminTab);
                setTimeout(() => {
                  smoothScroll("admin-and-leads-registry");
                }, 100);
              }}
              className={`text-[10px] font-mono px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                showAdminTab 
                  ? 'bg-primary-purple/20 border-[#C084FC]/50 text-white font-bold' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {showAdminTab ? "Hide Console" : "Leads Console"}
              </div>
            </button>
            <button
              onClick={() => smoothScroll('contact-form-section')}
              className="px-5 py-2.5 bg-gradient-to-r from-mid-purple to-primary-purple text-white hover:opacity-90 rounded-xl text-xs font-mono tracking-wider uppercase transition-all glow-purple cursor-pointer"
            >
              Initiate Prana →
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/5 bg-[#0A0A0A] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col font-mono text-xs uppercase tracking-widest text-[#C084FC]">
                <button onClick={() => smoothScroll('about-brand')} className="text-left py-2 border-b border-white/5 text-gray-300">About Amisha</button>
                <button onClick={() => smoothScroll('who-i-serve')} className="text-left py-2 border-b border-white/5 text-gray-300">Who I Serve</button>
                <button onClick={() => smoothScroll('what-i-teach')} className="text-left py-2 border-b border-white/5 text-gray-300">Respiration Subjects</button>
                <button onClick={() => smoothScroll('interactive-box-breathing')} className="text-left py-2 border-b border-white/5 text-gray-300">Box Breathing App</button>
                <button onClick={() => smoothScroll('moments-of-breath')} className="text-left py-2 border-b border-white/5 text-gray-300">Physical Gallery</button>
                <button onClick={() => smoothScroll('testimonials')} className="text-left py-2 border-b border-white/5 text-gray-300">Client Stories</button>
                <button onClick={() => smoothScroll('contact-form-section')} className="text-left py-2 text-gray-300">Secure Consultation</button>
                
                <div className="pt-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setShowAdminTab(!showAdminTab);
                      setMobileMenuOpen(false);
                      setTimeout(() => smoothScroll("admin-and-leads-registry"), 150);
                    }}
                    className="w-full text-center py-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  >
                    {showAdminTab ? "Hide Backoffice Dashboard" : "Show Backoffice Dashboard"}
                  </button>
                  <button
                    onClick={() => smoothScroll('contact-form-section')}
                    className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-center rounded-lg font-bold"
                  >
                    Book Consultation Session
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTAINER CONTENT VIEWPORT */}
      <main className="flex-1 w-full z-10">

        {/* SECTION 1 — HERO / ABOUT ME */}
        <section className="relative min-h-[92vh] flex items-center pt-8 pb-16 justify-center overflow-hidden border-b border-white/5" id="hero-section">
          
          {/* Subtle star orbs running in the backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[35%] left-[15%] w-1.5 h-1.5 bg-primary-purple rounded-full animate-ping opacity-65" />
            <div className="absolute top-[65%] right-[25%] w-2 h-2 bg-bright-purple rounded-full animate-pulse opacity-55" />
            <div className="absolute bottom-[20%] left-[45%] w-1.5 h-1.5 bg-mid-purple rounded-full animate-ping opacity-40" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Column: Command Statement */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left z-10">
              
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-purple/10 border border-primary-purple/40 rounded-full text-bright-purple text-[10px] md:text-xs font-mono tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-bright-purple animate-pulse" /> TRANSCENDENTAL PRANAYAMA
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 text-gray-400 border border-white/5 rounded-full text-[9px] md:text-xs font-mono uppercase tracking-wider">
                  8 Years Pranayama Practice
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-syne font-bold tracking-tight text-white leading-[1.05] uppercase">
                  Ancient Breath.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] neon-text-purple">
                    Backed By Modern Science.
                  </span>
                </h1>
                
                <p className="text-[#C084FC]/95 font-sans text-xs sm:text-sm tracking-widest uppercase font-semibold">
                  I am Amisha Agarwal — Breathwork Practitioner & Wellness Experience Designer.
                </p>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl font-light" id="about-brand">
                For 8 years, I have practiced the ancient science of Pranayama — a timeless tradition that restores physical energy, calms anxiety, and cultivates inner stillness. I integrate this respiratory technology into luxury modern spaces, including premium hotels, corporate environments, and private retreats, to help you achieve nervous system equilibrium.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => smoothScroll('interactive-box-breathing')}
                  className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#A855F7] hover:to-[#7C3AED] text-white rounded-xl text-xs md:text-sm font-mono tracking-widest uppercase transition-all glow-purple hover:scale-[1.02] flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  Begin Your Journey <ArrowRight className="w-4 h-4 text-white" />
                </button>
                
                <button
                  onClick={() => smoothScroll('who-i-serve')}
                  className="px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs md:text-sm font-mono tracking-widest uppercase transition-all cursor-pointer"
                >
                  Explore Syllabi
                </button>
              </div>

              {/* Dynamic stats banner */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-lg">
                <div>
                  <span className="block text-xl md:text-2xl font-display font-semibold text-white tracking-tight">8+ Years</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Intensive Sadhana</span>
                </div>
                <div>
                  <span className="block text-xl md:text-2xl font-display font-semibold text-white tracking-tight">100+</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Lives Transformed</span>
                </div>
                <div>
                  <span className="block text-xl md:text-2xl font-display font-semibold text-white tracking-tight">5,000 Yr</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Vedic Lineage Science</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Portrait & Live Upload Manager */}
            <div 
              className="lg:col-span-5 relative group z-10"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {/* Outer decorative glowing ring */}
              <div className="absolute inset-0 bg-[#A855F7]/10 rounded-3xl translate-x-2 translate-y-2 blur-md transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
              
              <div className={`relative rounded-3xl overflow-hidden aspect-[4/5] border ${isDragging ? 'border-primary-purple bg-primary-purple/10 scale-[1.01]' : 'border-white/10'} bg-[#120A20] shadow-2xl flex flex-col justify-between p-6 overflow-hidden transition-all duration-300`}>
                
                {/* Embedded absolute background - loads her uploaded photo from server */}
                <div 
                  className="absolute inset-0 bg-cover bg-center index-0 pointer-events-none transition-all duration-1000"
                  style={{ 
                    backgroundImage: userUploadedBg ? `url(${userUploadedBg})` : `url(${bgUrl})`
                  }}
                />
                
                {/* Overlay to ensure light readability on the portrait cards */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40 z-1 pointer-events-none" />

                {/* Card Top Information HUD */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-[#050309]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-[#C084FC] uppercase font-bold">Vedic Coach Status</span>
                  </div>
                  
                  {/* Floating Action Badge to prompt upload */}
                  <label className="bg-[#050309]/90 hover:bg-[#A855F7]/80 backdrop-blur-md p-2.5 rounded-full border border-white/10 text-white cursor-pointer transition-all flex items-center justify-center shadow-lg group-hover:scale-105" title="Customize Hero Portrait">
                    <Upload className="w-4 h-4 text-bright-purple" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                    />
                  </label>
                </div>

                {/* Card Bottom HUD: interactive drag instructions */}
                <div className="relative z-10 bg-[#050309]/85 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-display font-semibold text-white uppercase tracking-wider">AMISHA AGARWAL</h4>
                      <p className="text-[10px] font-mono text-gray-400">Authentic Portrait Frame</p>
                    </div>
                    <span className="text-[9px] font-mono text-[#C084FC] border border-[#A855F7]/20 px-2 py-0.5 rounded-full uppercase bg-[#primary-purple]/10">Hyderabad, IN</span>
                  </div>
                  
                  {/* Upload message helper */}
                  <p className="text-[10px] text-gray-400 leading-normal border-t border-white/5 pt-2 flex items-center gap-1.5 font-mono">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-bright-purple animate-bounce" /> 
                    <span>Drag and drop your own photo directly inside this card to replace permanently.</span>
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* SECTION 2 — WHO I CATER FOR */}
        <section className="relative py-24 border-b border-white/5" id="who-i-serve">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            
            <div className="max-w-xl mx-auto space-y-3">
              <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">PARTNERSHIP CHANNELS</span>
              <h2 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                Where I Bring the Breath
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Delivering traditional Sanskrit respiratory technology into modern arenas designed for high-caliber audiences.
              </p>
            </div>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Card 1 — Hospitality */}
              <div className="group border border-primary-purple/10 bg-[#120A20]/40 rounded-3xl p-8 text-left transition-all hover:border-[#C084FC]/30 duration-300 relative overflow-hidden flex flex-col justify-between glow-purple">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-purple/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-purple/20 border border-[#C084FC]/30 flex items-center justify-center text-bright-purple shadow-lg shadow-purple-500/10">
                    <Building className="w-6 h-6 text-bright-purple" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[#C084FC] text-xs font-mono uppercase tracking-widest">01 — ACCOMMODATION BRANDING</span>
                    <h3 className="text-xl font-display font-medium text-white uppercase tracking-wider">Hotels & Wellness Resorts</h3>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    I design complete, bespoke Pranayama-based respiratory curriculums for boutique luxury resorts. From seasonal guest offerings to training spa and hosting teams, we establish a highly authentic wellness differentiator that drives guest loyalty and elevates property metrics.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C084FC]">HOSPITALITY INTEGRATION</span>
                  <button 
                    onClick={() => { setClientType('Hotel or Resort'); smoothScroll('contact-form-section'); }} 
                    className="text-xs font-mono font-semibold text-white tracking-wider flex items-center gap-1.5 hover:text-bright-purple transition-all group-hover:translate-x-1.5 cursor-pointer"
                  >
                    B2B Proposal Architect <ArrowRight className="w-4 h-4 text-[#C084FC]" />
                  </button>
                </div>
              </div>

              {/* Card 2 — Corporate */}
              <div className="group border border-primary-purple/10 bg-[#120A20]/40 rounded-3xl p-8 text-left transition-all hover:border-[#C084FC]/30 duration-300 relative overflow-hidden flex flex-col justify-between glow-purple">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mid-purple/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-purple/20 border border-[#C084FC]/30 flex items-center justify-center text-bright-purple shadow-lg shadow-purple-500/10">
                    <Briefcase className="w-6 h-6 text-bright-purple" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[#C084FC] text-xs font-mono uppercase tracking-widest">02 — PERFORMANCE BIOLOGY</span>
                    <h3 className="text-xl font-display font-medium text-white uppercase tracking-wider">Corporate Wellbeing</h3>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    Help your leadership and technical teams eliminate chronic fatigue and executive burnout. Drawing on target alternate-nostril exercises and vagal deceleration, these sessions equip high-performance teams with direct somatic tools to instantly regulate stress and extend focus.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C084FC]">ENTERPRISE AUDITS</span>
                  <button 
                    onClick={() => { setClientType('Corporate'); smoothScroll('contact-form-section'); }} 
                    className="text-xs font-mono font-semibold text-white tracking-wider flex items-center gap-1.5 hover:text-bright-purple transition-all group-hover:translate-x-1.5 cursor-pointer"
                  >
                    Inquire Corporate Demo <ArrowRight className="w-4 h-4 text-[#C084FC]" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3 — WHAT I TEACH (BREATHE THROUGH EVERYTHING) */}
        <section className="relative py-24 bg-[#080010] border-b border-white/5" id="what-i-teach">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">METHODOLOGY & CURRICULA</span>
              <h2 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white tracking-normal leading-tight">
                Breathe Through Everything
              </h2>
              <div className="w-12 h-0.5 bg-primary-purple mx-auto my-1" />
              <p className="text-gray-400 text-sm font-light">
                Where traditional Vedic Pranayama meets modern neuro-biology to resolve physiological stressors.
              </p>
            </div>

            {/* 5 Category Cards Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
              
              {/* Card 1: Destress */}
              <div className="md:col-span-3 border border-primary-purple/10 bg-[#120A20]/50 hover:bg-[#120A20]/80 p-6 md:p-8 rounded-3xl space-y-4 transition-all hover:border-[#C084FC]/30 duration-300 glow-purple flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-purple/20 border border-[#C084FC]/20 flex items-center justify-center text-bright-purple">
                    <Shield className="w-5.5 h-5.5 text-bright-purple" />
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-white uppercase tracking-wider">🌀 Destress & Let Go</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    Calm your nervous system using Nadi Shodhana (channel purification) and Bhramari (vagal humming). This practice quickly lowers cortisol levels, releases chest tension, and guides your physiology into absolute tranquility.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Technique Focus: Parasympathetic Recalibration</div>
              </div>

              {/* Card 2: Travel Fatigue */}
              <div className="md:col-span-3 border border-primary-purple/10 bg-[#120A20]/50 hover:bg-[#120A20]/80 p-6 md:p-8 rounded-3xl space-y-4 transition-all hover:border-[#C084FC]/30 duration-300 glow-purple flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-purple/20 border border-[#C084FC]/20 flex items-center justify-center text-bright-purple">
                    <Plane className="w-5.5 h-5.5 text-bright-purple" />
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-white uppercase tracking-wider">✈️ Travel Fatigue Recovery</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    Reset your biological clock after long-haul travel. Utilizing active oxygenation techniques, this series balances blood gases, alleviates altitude fatigue, and rapidly expands chest volume to restore vital energy.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Technique Focus: Circadian Synchronization</div>
              </div>

              {/* Card 3: General Wellness */}
              <div className="md:col-span-2 border border-primary-purple/10 bg-[#120A20]/40 hover:bg-[#120A20]/70 p-6 rounded-3xl space-y-3 transition-all hover:border-[#C084FC]/30 duration-300 glow-purple flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-purple/20 border border-[#C084FC]/25 flex items-center justify-center text-bright-purple">
                    <Heart className="w-5 h-5 text-bright-purple" />
                  </div>
                  <h3 className="text-base font-display font-semibold text-white uppercase tracking-wider">🌿 General Wellness</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    Develop proper breathing patterns to strengthen lung capacity, nourish vagal response, and boost overall immune resilience. Simple, daily respiratory habits backed by empirical science.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-wider">Alveolar Elasticity & Immunity</div>
              </div>

              {/* Card 4: 7 Chakras Activation */}
              <div className="md:col-span-2 border border-primary-purple/10 bg-[#120A20]/40 hover:bg-[#120A20]/70 p-6 rounded-3xl space-y-3 transition-all hover:border-[#C084FC]/30 duration-300 glow-purple flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-purple/20 border border-[#C084FC]/25 flex items-center justify-center text-bright-purple">
                    <Zap className="w-5 h-5 text-bright-purple" />
                  </div>
                  <h3 className="text-base font-display font-semibold text-white uppercase tracking-wider">🔮 7 Chakras Activation</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    Harmonize your somatic energy channels through ancient Kundalini sequences and focused internal bio-visualizations. A restorative practice to release mental congestion and establish balance.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-wider">Solfeggio Sound & Kundalini Bridges</div>
              </div>

              {/* Card 5: Sleep Better */}
              <div className="md:col-span-2 border border-primary-purple/10 bg-[#120A20]/40 hover:bg-[#120A20]/70 p-6 rounded-3xl space-y-3 transition-all hover:border-[#C084FC]/30 duration-300 glow-purple flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-purple/20 border border-[#C084FC]/25 flex items-center justify-center text-bright-purple">
                    <Moon className="w-5 h-5 text-bright-purple" />
                  </div>
                  <h3 className="text-base font-display font-semibold text-white uppercase tracking-wider">🌙 Sleep Better</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    Calm midnight mind-racing with specific slow-rhythm breathing and deeply calming Yoga Nidra techniques. Experience a natural transition into deep, restorative neurological rest.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-wider">Melatonin Synthesis & Yoga Nidra</div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4 — INTERACTIVE BOX BREATHING */}
        <section className="relative py-24 border-b border-white/5" id="interactive-box-breathing">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">LIVE SOMATIC SAMPLE</span>
              <h2 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                Breathe With Me — Right Now
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Sample the immediate grounding effect of classic Pranayama. Align your posture, focus, and let the visual guide direct your breathing cycles.
              </p>
            </div>

            {/* Breathing Simulator Element */}
            <div className="relative">
              <BreathingSimulator onBookCall={() => smoothScroll('contact-form-section')} />
            </div>

          </div>
        </section>

        {/* SECTION 5 — GALLERY (MOMENTS OF BREATH) */}
        <section className="relative py-24 bg-[#080010] border-b border-white/5" id="moments-of-breath">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">VISUAL CHRONOLOGY</span>
                <h2 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white tracking-tight mt-1">
                  Moments of Breath
                </h2>
                <p className="text-gray-400 text-xs mt-1 max-w-lg font-light">
                  A visual record of our global hotel residencies, group classes, and immersive workshops.
                </p>
              </div>

              {/* Dynamic Action Button based on Owner editorial lock */}
              <div className="relative group self-stretch sm:self-auto flex items-center">
                {!isGalleryEditUnlocked ? (
                  <button
                    onClick={() => {
                      const pass = prompt("Enter owner passcode or your administrator email to manage gallery:", "");
                      if (pass === "omvayu" || pass === "vayu" || pass === "agarwalamisha0000@gmail.com") {
                        setIsGalleryEditUnlocked(true);
                      } else if (pass !== null) {
                        alert("Access denied. Visitors have viewing access only.");
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 border border-white/10 bg-[#120A20] hover:bg-[#120A20]/60 text-gray-400 hover:text-white rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5 text-gray-500" /> Owner Access
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase text-center sm:text-right">Editorial Mode Active</span>
                    <div className="flex gap-2">
                      <label id="expand-gallery-btn" className="w-full sm:w-auto px-4 py-2.5 border border-primary-purple/30 bg-[#120A20] hover:bg-[#120A20]/60 text-white rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md glow-purple hover:scale-[1.02]">
                        <Plus className="w-3.5 h-3.5 text-bright-purple" /> Upload Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleCreateGalleryImage} 
                        />
                      </label>
                      <button
                        onClick={() => setIsGalleryEditUnlocked(false)}
                        className="p-2 border border-white/10 bg-[#050309] text-gray-400 hover:text-rose-400 rounded-xl text-[10px] uppercase font-mono cursor-pointer"
                        title="Lock Editorial Mode"
                      >
                        Lock
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Beautiful Mosaic / Masonry Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden aspect-square border border-white/10 bg-[#120A20] transition-all hover:border-primary-purple duration-500 shadow-xl"
                >
                  {/* Photo background */}
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dark gradients on Hover */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10" />

                  {/* Absolute Badge */}
                  <span className="absolute top-4 left-4 z-20 bg-primary-purple/20 text-bright-purple border border-primary-purple/40 font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    {img.tag}
                  </span>

                  {/* Remove Button - Only visible in Editor mode */}
                  {isGalleryEditUnlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGalleryImage(idx);
                      }}
                      className="absolute top-4 right-4 z-30 p-2 bg-red-950/95 hover:bg-rose-900 border border-rose-500/40 hover:border-rose-400 rounded-full text-rose-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110 cursor-pointer flex items-center justify-center shadow-md leading-none"
                      title="Remove Photo"
                      id={`remove-pic-btn-${idx}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                    </button>
                  )}

                  {/* Hover visual textual overlay details */}
                  <div className="absolute inset-x-0 bottom-0 z-20 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col space-y-1 text-left">
                    <span className="text-[9px] font-mono text-[#C084FC] uppercase tracking-widest font-bold">Lineage Documentation</span>
                    <p className="text-white text-xs leading-normal font-sans tracking-wide">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 6 — TESTIMONIALS (WHAT PEOPLE ARE SAYING) */}
        <section className="relative py-24 border-b border-white/5" id="testimonials">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">CREDIBILITY LEDGER</span>
              <h2 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white tracking-normal leading-tight">
                What People are Saying
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Real results experienced by luxury resort directors, corporate HR managers, and coaching clients.
              </p>
            </div>

            {/* Testimonials horizontal scrolling lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              <div className="border border-white/5 bg-[#120A20]/30 hover:bg-[#120A20]/50 p-6 rounded-2xl relative flex flex-col justify-between hover:border-primary-purple/20 transition-all duration-300">
                <span className="absolute top-4 right-6 text-primary-purple font-serif text-5xl opacity-40">“</span>
                <div className="space-y-4">
                  <p className="text-xs text-gray-300 italic leading-relaxed pt-2">
                    "Amisha redesigned our resort wellness curriculum completely. Bypassing uncompetitive standard massage tables, we configured a signature sunrise alternate-nostril work. In under 60 days, our TripAdvisor brand rating raised +14% explicitly citing Amisha's Vedic respiration protocols. Exemplary."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-purple/20 border border-primary-purple/30 flex items-center justify-center font-display text-xs text-bright-purple font-bold">SM</div>
                  <div>
                    <h4 className="text-xs text-white font-bold tracking-wide uppercase">Siddharth Mishra</h4>
                    <p className="text-[9px] font-mono text-[#C084FC]">General Manager, Svatma Heritage Resorts</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/5 bg-[#120A20]/30 hover:bg-[#120A20]/50 p-6 rounded-2xl relative flex flex-col justify-between hover:border-primary-purple/20 transition-all duration-300">
                <span className="absolute top-4 right-6 text-primary-purple font-serif text-5xl opacity-40">“</span>
                <div className="space-y-4">
                  <p className="text-xs text-gray-300 italic leading-relaxed pt-2">
                    "Burnout was severely restricting our research teams' productivity lines. Amisha's breathing workshops completely resolved the systemic autonomic stress. She gave our teams highly predictable somatic mechanisms to immediately quiet pacing thoughts and trigger deep executive focus. It's a genuine operational strategy."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-purple/20 border border-primary-purple/30 flex items-center justify-center font-display text-xs text-bright-purple font-bold">AK</div>
                  <div>
                    <h4 className="text-xs text-white font-bold tracking-wide uppercase">Ananya Kulkarni</h4>
                    <p className="text-[9px] font-mono text-[#C084FC]">HR Director, Synergist Automation Tech</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/5 bg-[#120A20]/30 hover:bg-[#120A20]/50 p-6 rounded-2xl relative flex flex-col justify-between hover:border-primary-purple/20 transition-all duration-300">
                <span className="absolute top-4 right-6 text-primary-purple font-serif text-5xl opacity-40">“</span>
                <div className="space-y-4">
                  <p className="text-xs text-gray-300 italic leading-relaxed pt-2">
                    "I had cataloged intense restless insomnia for 4 years before consulting Amisha. Her private 1-on-1 Bhramari and slow-rhythm sequences changed everything. My brain can finally enter complete baseline decompression without drugs. Deeply grateful."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-purple/20 border border-primary-purple/30 flex items-center justify-center font-display text-xs text-bright-purple font-bold">RK</div>
                  <div>
                    <h4 className="text-xs text-white font-bold tracking-wide uppercase">Raunaq Kapoor</h4>
                    <p className="text-[9px] font-mono text-[#C084FC]">Co-founder, Zenith Analytics Ltd</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 7 — CONTACT FORM (LET'S BREATHE TOGETHER) */}
        <section className="relative py-24 bg-[#0A0A0A]" id="contact-form-section">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-bright-purple font-mono text-xs tracking-[0.2em] uppercase block">INQUIRY INTAKE PORTAL</span>
              <h2 className="text-2xl sm:text-3xl font-syne font-bold uppercase text-white tracking-normal leading-tight">
                Let's Breathe Together
              </h2>
              <div className="w-12 h-0.5 bg-primary-purple" />
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Let’s build your custom wellness program. Whether you are a luxury resort manager, corporate lead, or looking for private 1-on-1 instruction, get in touch to design your session.
              </p>
              
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Verify your details below. I review and correspond personally within 24 hours.
              </p>

              {/* Direct channels */}
              <div className="space-y-3 pt-4 border-t border-white/5 font-mono text-xs text-gray-400">
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-4 h-4 text-bright-purple" />
                  <span>+91 8319936577</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-4 h-4 text-bright-purple" />
                  <span>amishaagarwal0000@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <MapPin className="w-4 h-4 text-bright-purple" />
                  <span>Kondapur, Hyderabad — 500084</span>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <div className="border border-primary-purple/10 bg-[#120A20]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden glow-purple">
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-bounce pb-0.5">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-2xl font-display font-semibold text-white uppercase tracking-wider">Transmission Realised</h4>
                      <p className="text-[#C084FC] text-xs font-mono tracking-widest uppercase">Pranayama Inquiry Stored</p>
                    </div>

                    <p className="text-gray-400 text-xs sm:text-xs leading-relaxed max-w-md mx-auto">
                      Thank you. Your inquiry details have been saved directly inside our secure corporate operations database. Amisha Agarwal will evaluate and reach out via telephone or email brief within 24 hours.
                    </p>

                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Resubmit Custom Intake Form
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Lord Shiva" 
                          className="w-full bg-[#050309] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-purple placeholder-gray-700 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="shiva@veda.com" 
                          className="w-full bg-[#050309] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-purple placeholder-gray-700 font-sans"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Phone Number</label>
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 99999 88888" 
                          className="w-full bg-[#050309] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-purple placeholder-gray-700 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Consultant Type</label>
                        <select 
                          value={clientType}
                          onChange={(e) => setClientType(e.target.value)}
                          className="w-full bg-[#050309] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-purple font-mono cursor-pointer"
                        >
                          <option value="Individual">Individual Searcher</option>
                          <option value="Hotel or Resort">Hotel or Resort GM</option>
                          <option value="Corporate">Corporate HR Executive</option>
                          <option value="Other">Other Engagement</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Message & Breath Objectives</label>
                      <textarea 
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="State your somatic challenges, corporate employee size, or resort venue goals here..." 
                        className="w-full bg-[#050309] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-purple placeholder-gray-700 resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-mid-purple to-primary-purple text-white font-mono font-bold tracking-widest text-xs uppercase rounded-xl transition-all glow-purple hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg"
                    >
                      Send Message →
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* OPERATIONS LEDGER & ADMIN PANEL (ADDITIONAL SECURE COMPONENT) */}
        <AnimatePresence>
          {showAdminTab && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/5 bg-[#080010]"
              id="admin-and-leads-registry"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-[#120A20]/85 p-5 rounded-2xl border border-primary-purple/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary-purple/20 border border-primary-purple/35 text-bright-purple">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white uppercase">Secure Backoffice Workspace</h4>
                      <p className="text-[11px] text-gray-400">Manage custom proposals, test database entries, and verify customer CRM inquiries in real-time.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAdminTab(false)}
                    className="p-1 px-3 border border-white/10 hover:border-white/20 rounded-lg text-xs font-mono text-gray-400 hover:text-white"
                  >
                    Hide Pane
                  </button>
                </div>

                <LeadDashboard 
                  inquiries={inquiries} 
                  onRefresh={fetchInquiries} 
                  onSelectInquiry={handleSelectInquiry} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-white/5 bg-[#050309] py-16 text-left relative z-10 overflow-hidden">
        
        {/* Decorative glowing background line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary-purple/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo Brand information */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary-purple/10 border border-primary-purple/35 rounded flex items-center justify-center text-bright-purple">
                <Wind className="w-4 h-4 text-bright-purple" />
              </div>
              <span className="text-base font-syne tracking-widest text-white block font-extrabold uppercase">
                AMISHA AGARWAL
              </span>
            </div>
            
            <p className="text-gray-400 text-xs italic font-light">
              Ancient Breath. Backed By Modern Science.
            </p>
            <p className="text-gray-500 text-[10px] leading-relaxed font-light max-w-sm">
              We operate internationally to design premium somatic environments, private biofeedback curricula, and enterprise meditation structures. Lineage certified in Vedic Prana science.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Contact Directories</span>
            <ul className="space-y-1.5 font-mono text-xs text-gray-500">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-bright-purple" /> +91 8319936577</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-bright-purple" /> amishaagarwal0000@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-bright-purple" /> Kondapur, Hyderabad, IN — 500084</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 md:text-right">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block font-bold md:block">Operational Notice</span>
            <p className="text-[10px] text-gray-500 leading-relaxed font-light">
              © 2026 Amisha Agarwal. All rights reserved. Somatic and Ayurvedic claims are aligned with 8 years of personal lineage practice. Safe, non-medical, and purely somatic deep wellness.
            </p>
            
            {/* Quick utility back to top */}
            <button 
              onClick={() => smoothScroll('hero-section')}
              className="text-[10px] font-mono text-bright-purple hover:text-white transition-colors uppercase tracking-widest font-semibold pt-2 cursor-pointer inline-block"
            >
              Back to Atmosphere Top ↑
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
