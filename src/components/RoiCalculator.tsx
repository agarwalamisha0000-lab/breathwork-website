import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Award, HelpCircle, Check, ArrowRight } from 'lucide-react';

export default function RoiCalculator() {
  const [rooms, setRooms] = useState(40);
  const [adr, setAdr] = useState(25000); // INR per night
  const [occupancy, setOccupancy] = useState(65); // percentage
  const [tier, setTier] = useState<'standard' | 'premium'>('premium');

  // Strategic variables matching Vedic breathwork consultancy
  const cost = tier === 'standard' ? 180000 : 380000;
  
  // 1. In-room upgraded signature breathwork suite premium potential (approx 10% ADR premium)
  const roomUpgradePremium = Math.round(adr * 0.10);
  
  // We assume only 15% of rooms are designated as "Prana Core Spaces" with custom tablet audio + oil pairings
  const upgradedRoomCount = Math.round(rooms * 0.15);
  
  // Annual premium room revenue: rooms * nights * occupancy * rate premium
  const annualUpgradeRevenue = Math.round(upgradedRoomCount * 365 * (occupancy / 100) * roomUpgradePremium);
  
  // 2. Extra TripAdvisor Review loyalty bookings (approx 1.5% overall occupancy bump due to wellness differentiation)
  const loyaltyOccupancyBump = 1.5;
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
  const upgradedValues = [100, 115, 130, 150, 175, 198];

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
    <div className="bg-white border border-sage-100 rounded-3xl p-6 md:p-8 shadow-xl relative" id="resort-roi-calculator">
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-gold-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Sliders */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 border border-sage-100 rounded-full text-sage-600 text-[10px] font-mono tracking-widest uppercase mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Commercial Yield Calculator
            </div>
            <h3 className="text-2xl md:text-3xl font-serif text-charcoal-900 leading-tight tracking-wide mb-3">
              Map Your Financial Resonance
            </h3>
            <p className="text-sm text-sage-600 mb-6 leading-relaxed">
              General Managers and owners know beautiful feelings require solid economics. Adjust your resort variables to see how bespoke pranayama integrations deliver strong, tangible bottom-line results.
            </p>

            {/* Room Count Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-charcoal-900">Resort Room Capacity</span>
                <span className="text-gold-600 font-mono font-bold">{rooms} Rooms</span>
              </div>
              <input
                id="rooms-count-slider"
                type="range"
                min="15"
                max="100"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-sage-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sage-400 font-mono mt-1">
                <span>15 Rooms (Boutique)</span>
                <span>100 Rooms (Max Boutique Scale)</span>
              </div>
            </div>

            {/* Average Daily Rate (ADR) Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-charcoal-900">Average Daily Rate (ADR)</span>
                <span className="text-gold-600 font-mono font-bold">₹{adr.toLocaleString("en-IN")} / night</span>
              </div>
              <input
                id="adr-slider"
                type="range"
                min="10000"
                max="80000"
                step="2500"
                value={adr}
                onChange={(e) => setAdr(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-sage-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sage-400 font-mono mt-1">
                <span>₹10,000</span>
                <span>₹80,000 (Luxury Standard)</span>
              </div>
            </div>

            {/* Occupancy Rate Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-charcoal-900">Annual Occupancy Rate</span>
                <span className="text-gold-600 font-mono font-bold">{occupancy}%</span>
              </div>
              <input
                id="occupancy-slider"
                type="range"
                min="30"
                max="90"
                value={occupancy}
                onChange={(e) => setOccupancy(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-sage-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sage-400 font-mono mt-1">
                <span>30% Low Season</span>
                <span>90% Peak Sanctuary</span>
              </div>
            </div>

            {/* Program tier selector */}
            <div className="mb-4">
              <span className="text-xs font-semibold block text-charcoal-900 mb-2">Proposed Program Retainer Tier</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="calc-tier-standard"
                  onClick={() => setTier('standard')}
                  className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${
                    tier === 'standard'
                      ? 'border-gold-500/40 bg-gold-50 text-gold-800 font-semibold'
                      : 'border-sage-100 bg-white text-sage-500 hover:text-sage-800'
                  }`}
                >
                  Veda Standard Retainer
                  <span className="block text-[10px] text-sage-400 font-mono font-normal mt-0.5">₹1.8L Annually</span>
                </button>
                <button
                  id="calc-tier-premium"
                  onClick={() => setTier('premium')}
                  className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${
                    tier === 'premium'
                      ? 'border-gold-500/40 bg-gold-50 text-gold-800 font-semibold'
                      : 'border-sage-100 bg-white text-sage-500 hover:text-sage-800'
                  }`}
                >
                  Prana Premium Residency
                  <span className="block text-[10px] text-sage-400 font-mono font-normal mt-0.5">₹3.8L Annually</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Projections and Revenue chart */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-sage-50/50 border border-sage-100 rounded-2xl p-6">
          <div>
            <div className="flex items-center justify-between border-b border-sage-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-sage-400 uppercase tracking-wider block">Estimated Annual Return</span>
                <span className="text-3xl md:text-4xl font-serif text-sage-950 font-semibold">
                  ₹{totalIncrementalRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-gold-600 uppercase tracking-widest block font-bold">UNLOCKED MULTIPLIER</span>
                <span className="inline-block bg-gold-500 text-charcoal-950 font-mono font-extrabold text-base px-3 py-1 rounded-full mt-1">
                  {roiMultiplier}x ROI
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 border border-sage-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span className="text-xs font-semibold text-charcoal-900">Room Upgrade Yield</span>
                </div>
                <span className="text-lg font-mono font-bold text-sage-800">₹{annualUpgradeRevenue.toLocaleString("en-IN")}</span>
                <span className="block text-[10px] text-sage-400 mt-1 leading-normal">
                  Based on upgrading {upgradedRoomCount} rooms to "Prana Spaces" with an extra ₹{roomUpgradePremium.toLocaleString("en-IN")}/night premium.
                </span>
              </div>

              <div className="bg-white p-4 border border-sage-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-charcoal-900">Loyalty Review Bump</span>
                </div>
                <span className="text-lg font-mono font-bold text-sage-800">₹{annualLoyaltyRevenue.toLocaleString("en-IN")}</span>
                <span className="block text-[10px] text-sage-400 mt-1 leading-normal">
                  Assumes a 1.5% bump in annual occupied nights generated by outstanding TripAdvisor guest reviews referencing custom respiration.
                </span>
              </div>
            </div>

            {/* Custom SVG Graph */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-[10px] text-sage-500 font-mono mb-2 px-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gold-500 rounded-full inline-block" /> Prana Resonated Revenue Trend</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-sage-300 rounded-full inline-block" /> Baseline Unmodified Growth</span>
              </div>
              
              <div className="w-full bg-white content-center border border-sage-100 rounded-xl p-2 relative overflow-hidden">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#f1f3f1" strokeWidth="1" />
                  <line x1="20" y1="70" x2={chartWidth - 20} y2="70" stroke="#f1f3f1" strokeWidth="1" />
                  <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="#f1f3f1" strokeWidth="1" />
                  <line x1="20" y1="160" x2={chartWidth - 20} y2="160" stroke="#eef2ee" strokeWidth="1" />

                  {/* Fill Area representing upgraded lift */}
                  <path 
                    d={`M 20,${chartHeight - 20} L ${upgradedPath} L ${chartWidth - 20},${chartHeight - 20} Z`} 
                    fill="url(#goldGradient)" 
                    opacity="0.08" 
                  />

                  {/* Paths */}
                  <path d={`M ${baselinePath}`} fill="none" stroke="#dae2da" strokeWidth="2.5" strokeDasharray="3 3" />
                  <path d={`M ${upgradedPath}`} fill="none" stroke="#b58d3d" strokeWidth="3" />

                  {/* Highlighting Markers */}
                  <circle cx={chartWidth - 20} cy={chartHeight - ((198-80)/130)*(chartHeight-40) - 20} r="6" fill="#b58d3d" stroke="#ffffff" strokeWidth="2" />
                  <circle cx={chartWidth - 20} cy={chartHeight - ((125-80)/130)*(chartHeight-40) - 20} r="4" fill="#a3b8a3" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b58d3d" />
                      <stop offset="100%" stopColor="#ffffff" />
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
                      fill="#8fa392" 
                      fontFamily="monospace"
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sage-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[11px] text-sage-500 font-medium">
                Net Profit Increase of <strong className="text-sage-800">₹{netProfit.toLocaleString("en-IN")}</strong> / first year.
              </span>
            </div>
            <a 
              href="#proposal-architect"
              className="text-xs text-gold-600 font-semibold flex items-center gap-1 hover:text-gold-500 transition-colors"
            >
              Get Custom Report Proposal <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
