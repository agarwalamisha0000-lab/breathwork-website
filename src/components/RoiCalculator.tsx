import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Award, HelpCircle, Check, ArrowRight } from 'lucide-react';

export default function RoiCalculator() {
  const [rooms, setRooms] = useState(45);
  const [adr, setAdr] = useState(25000); // INR per night
  const [occupancy, setOccupancy] = useState(65); // percentage
  const [tier, setTier] = useState<'standard' | 'premium'>('premium');

  // Strategic variables matching Vedic breathwork partnerships
  const cost = tier === 'standard' ? 180000 : 380000;
  
  // 1. In-room upgraded signature breathwork suite premium potential (approx 10% ADR premium)
  const roomUpgradePremium = Math.round(adr * 0.10);
  
  // We assume only 15% of rooms are designated as "Prana Core Spaces" with custom tablet audio + oil pairings
  const upgradedRoomCount = Math.round(rooms * 0.15);
  
  // Annual premium room revenue: rooms * nights * occupancy * rate premium
  const annualUpgradeRevenue = Math.round(upgradedRoomCount * 365 * (occupancy / 100) * roomUpgradePremium);
  
  // 2. Extra TripAdvisor Review loyalty bookings (approx 1.5% overall occupancy bump due to wellness differentiation)
  const loyaltyOccupancyBump = 1.8;
  const annualLoyaltyRevenue = Math.round(rooms * 365 * (loyaltyOccupancyBump / 100) * adr);

  // Total Estimated Incremental Revenue
  const totalIncrementalRevenue = annualUpgradeRevenue + annualLoyaltyRevenue;
  
  // ROI Ratio & Net Profit
  const netProfit = totalIncrementalRevenue - cost;
  const roiMultiplier = (totalIncrementalRevenue / cost).toFixed(1);

  // Generate 12-month data points for the customized SVG Chart (Baseline revenue growth vs Prana-Vayu upgraded revenue growth)
  const chartWidth = 500;
  const chartHeight = 180;
  const points = 6;
  const months = ["Jun", "Aug", "Oct", "Dec", "Feb", "Apr"];
  
  // Baseline vs Upgrade curves
  const baselineValues = [100, 105, 110, 115, 120, 125];
  const upgradedValues = [100, 118, 135, 155, 180, 204];

  const getSvgCoordinates = (values: number[]) => {
    return values.map((val, idx) => {
      const x = (idx / (points - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((val - 80) / 130) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    }).join(' ');
  };

  const baselinePath = getSvgCoordinates(baselineValues);
  const upgradedPath = getSvgCoordinates(upgradedValues);

  return (
    <div className="bg-[#120A20]/80 border border-primary-purple/20 rounded-3xl p-6 md:p-8 shadow-xl relative glow-purple" id="resort-roi-calculator">
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-primary-purple/5 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Sliders */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A0A0A] border border-white/5 rounded-full text-gray-400 text-[10px] font-mono tracking-widest uppercase mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-bright-purple" /> Commercial Yield Projections
            </div>
            <h3 className="text-2xl md:text-3xl font-display text-white font-bold leading-tight tracking-wide mb-3">
              Calculate Corporate & Resort ROI
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              General Managers and luxury directors know that high-end wellness requires solid economics. Move the sliders to test how custom Pranayama increases ADR and TripAdvisor score bookings.
            </p>

            {/* Room Count Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-white">Resort / Company Capacity</span>
                <span className="text-bright-purple font-mono font-bold">{rooms} Premium Units</span>
              </div>
              <input
                id="rooms-count-slider"
                type="range"
                min="15"
                max="100"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-primary-purple"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                <span>15 Keys (Boutique)</span>
                <span>100 Keys (Standard Capacity)</span>
              </div>
            </div>

            {/* Average Daily Rate (ADR) Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-white">Average Daily Room Rate (ADR)</span>
                <span className="text-bright-purple font-mono font-bold">₹{adr.toLocaleString("en-IN")} / night</span>
              </div>
              <input
                id="adr-slider"
                type="range"
                min="10000"
                max="80000"
                step="2500"
                value={adr}
                onChange={(e) => setAdr(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-primary-purple"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                <span>₹10,000 INR</span>
                <span>₹80,000 INR (Ultra Luxury)</span>
              </div>
            </div>

            {/* Occupancy Rate Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-white">Annual Occupancy / Size Rate</span>
                <span className="text-bright-purple font-mono font-bold">{occupancy}%</span>
              </div>
              <input
                id="occupancy-slider"
                type="range"
                min="30"
                max="90"
                value={occupancy}
                onChange={(e) => setOccupancy(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-primary-purple"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                <span>30% Season Low</span>
                <span>90% Peak Booking</span>
              </div>
            </div>

            {/* Program tier selector */}
            <div className="mb-4">
              <span className="text-xs font-semibold block text-white mb-2">Proposed Program Retainer Tier</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="calc-tier-standard"
                  type="button"
                  onClick={() => setTier('standard')}
                  className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    tier === 'standard'
                      ? 'border-primary-purple bg-primary-purple/20 text-white font-bold'
                      : 'border-white/5 bg-[#050309] text-gray-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  Veda Curated Retainer
                  <span className="block text-[9px] text-gray-500 font-mono font-normal mt-0.5">₹1.8L Annually</span>
                </button>
                <button
                  id="calc-tier-premium"
                  type="button"
                  onClick={() => setTier('premium')}
                  className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    tier === 'premium'
                      ? 'border-primary-purple bg-primary-purple/20 text-white font-bold'
                      : 'border-white/5 bg-[#050309] text-gray-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  Prana Premium Residency
                  <span className="block text-[9px] text-gray-500 font-mono font-normal mt-0.5">₹3.8L Annually</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Projections and Revenue chart */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#050309]/80 border border-white/5 rounded-2xl p-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Estimated Annual Return</span>
                <span className="text-3xl md:text-4xl font-display text-white font-bold">
                  ₹{totalIncrementalRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-bright-purple uppercase tracking-widest block font-bold">ESTIMATED GAIN</span>
                <span className="inline-block bg-primary-purple text-white font-mono font-semibold text-xs px-3 py-1 rounded-full mt-1 uppercase">
                  {roiMultiplier}x Yield
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#120A20]/40 p-4 border border-primary-purple/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-bright-purple" />
                  <span className="text-xs font-semibold text-gray-200">Room Upgrade Yield</span>
                </div>
                <span className="text-lg font-mono font-bold text-bright-purple">₹{annualUpgradeRevenue.toLocaleString("en-IN")}</span>
                <span className="block text-[10px] text-gray-400 mt-1 leading-normal">
                  Based on upgrading {upgradedRoomCount} rooms to "Prana Spaces" with an extra ₹{roomUpgradePremium.toLocaleString("en-IN")}/night premium.
                </span>
              </div>

              <div className="bg-[#120A20]/40 p-4 border border-primary-purple/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-bright-purple" />
                  <span className="text-xs font-semibold text-gray-200">TripAdvisor Loyalty Review Bump</span>
                </div>
                <span className="text-lg font-mono font-bold text-bright-purple">₹{annualLoyaltyRevenue.toLocaleString("en-IN")}</span>
                <span className="block text-[10px] text-gray-400 mt-1 leading-normal">
                  Assumes a {loyaltyOccupancyBump}% bump in bookings generated by outstanding reviews referencing custom respiration programs.
                </span>
              </div>
            </div>

            {/* Custom SVG Graph */}
            <div className="mb-4">
              <div className="flex flex-wrap justify-between items-center text-[9px] text-gray-500 font-mono mb-2 px-1 gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-bright-purple rounded-full inline-block" /> Prana Custom Wellness Upgrade Lift</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-800 border border-white/10 rounded-full inline-block" /> Baseline Traditional Occupancy</span>
              </div>
              
              <div className="w-full bg-[#050309] border border-white/5 rounded-xl p-2 relative overflow-hidden">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#1d1230" strokeWidth="1" />
                  <line x1="20" y1="70" x2={chartWidth - 20} y2="70" stroke="#1d1230" strokeWidth="1" />
                  <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="#1d1230" strokeWidth="1" />
                  <line x1="20" y1="160" x2={chartWidth - 20} y2="160" stroke="#150a25" strokeWidth="1" />

                  {/* Fill Area representing upgraded lift */}
                  <path 
                    d={`M 20,${chartHeight - 20} L ${upgradedPath} L ${chartWidth - 20},${chartHeight - 20} Z`} 
                    fill="url(#purpleGradient)" 
                    opacity="0.12" 
                  />

                  {/* Paths */}
                  <path d={`M ${baselinePath}`} fill="none" stroke="#2a1c40" strokeWidth="2" strokeDasharray="3 3" />
                  <path d={`M ${upgradedPath}`} fill="none" stroke="#A855F7" strokeWidth="3" />

                  {/* Highlighting Markers */}
                  <circle cx={chartWidth - 20} cy={chartHeight - ((204-80)/130)*(chartHeight-40) - 20} r="5" fill="#C084FC" stroke="#050309" strokeWidth="2" />
                  <circle cx={chartWidth - 20} cy={chartHeight - ((125-80)/130)*(chartHeight-40) - 20} r="4" fill="#2a1c40" stroke="#050309" strokeWidth="1.5" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#050309" />
                    </linearGradient>
                  </defs>

                  {/* Labels */}
                  {months.map((m, i) => (
                    <text 
                      key={m} 
                      x={(i / (points - 1)) * (chartWidth - 40) + 20} 
                      y={chartHeight - 4} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fill="#8B5CF6" 
                      fontFamily="monospace"
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs text-gray-400 font-medium">
                Annual Net Yield Increase of <strong className="text-white">₹{netProfit.toLocaleString("en-IN")}</strong>.
              </span>
            </div>
            <a 
              href="#proposal-architect"
              className="text-xs text-bright-purple font-semibold flex items-center gap-1 hover:text-white transition-colors"
            >
              Get Custom Partnership Report <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
