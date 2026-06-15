import React, { useState } from 'react';
import { Mail, Phone, Calendar, Landmark, MapPin, Clock, RefreshCw } from 'lucide-react';
import { Inquiry } from '../types';

interface LeadDashboardProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export default function LeadDashboard({ inquiries, onRefresh, onSelectInquiry }: LeadDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'scheduled'>('all');

  const filteredInquiries = inquiries.filter(inq => {
    if (activeTab === 'all') return true;
    return inq.status === activeTab;
  });

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-orange-500/10 text-orange-400 text-[9px] font-mono tracking-wider px-2.5 py-1 rounded border border-orange-500/20 flex items-center gap-1"><Clock className="w-3" /> UNREAD PROPOSAL</span>;
      case 'contacted':
        return <span className="bg-purple-500/10 text-bright-purple text-[9px] font-mono tracking-wider px-2.5 py-1 rounded border border-primary-purple/20 flex items-center gap-1"><Mail className="w-3" /> INITIAL OUTREACH</span>;
      case 'scheduled':
        return <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono tracking-wider px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1"><Calendar className="w-3" /> APPOINTMENT BOOKED</span>;
    }
  };

  return (
    <div className="bg-[#120A20]/80 border border-primary-purple/20 rounded-3xl p-6 md:p-8 shadow-xl glow-purple" id="partner-leads-registry">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono text-bright-purple tracking-widest block uppercase font-bold">OPERATIONS CENTER</span>
          <h3 className="text-2xl font-display text-white font-bold tracking-wide">
            Inquiry Ledger & Collaboration Planner
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            View real-time submissions from individuals, resorts, and corporate wellbeing coordinators.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 px-3 bg-[#050309] hover:bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all self-end sm:self-auto flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Ledger
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-2">
        {(['all', 'pending', 'scheduled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-primary-purple/20 border border-primary-purple/40 text-white'
                : 'text-gray-400 hover:text-white bg-[#050309]'
            }`}
          >
            {tab === 'all' ? 'All Leads' : tab === 'pending' ? 'Pending Action' : 'Agreements Set'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-[#050309] border border-dashed border-white/10 rounded-2xl">
            <Landmark className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="block text-sm font-semibold text-white">No active listings found</span>
            <span className="text-xs text-gray-500">Contact form submissions are cataloged in this ledger instantly.</span>
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="border border-white/5 hover:border-primary-purple/40 rounded-2xl p-5 hover:bg-primary-purple/5 transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-display text-white font-bold">{inq.hotelName}</h4>
                  <div className="flex gap-2">
                    <span className="bg-[#050309] text-gray-400 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-white/5">
                      <MapPin className="w-2.5 h-2.5" /> {inq.hotelInfo.location}
                    </span>
                    <span className="bg-primary-purple/10 text-bright-purple text-[9px] font-mono px-2 py-0.5 rounded-full uppercase border border-primary-purple/20">
                      {inq.hotelInfo.roomCount} Keys/Cap • {inq.hotelInfo.averageRate > 30000 ? 'Tier 1 Focus' : 'Nervous Integration'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Landmark className="w-3.5 h-3.5 text-bright-purple" />
                    <span>Focus: <strong className="text-white font-medium">{inq.hotelInfo.focusTheme}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-bright-purple" />
                    <span>{inq.contactName} ({inq.contactEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-bright-purple" />
                    <span>{inq.contactPhone}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-normal bg-[#050309] p-2.5 rounded-xl border border-white/5 italic">
                  "Core context of interest: {inq.hotelInfo.targetDemographic}."
                </p>
              </div>

              <div className="flex md:flex-col justify-between items-end gap-3 self-stretch border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                <div className="text-left md:text-right w-full">
                  <span className="text-[10px] font-mono text-gray-500 block">Received At</span>
                  <span className="text-xs text-white font-mono font-medium">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex gap-2 md:w-full mt-2 justify-end">
                  <button
                    onClick={() => onSelectInquiry(inq)}
                    className="py-1.5 px-3 bg-gradient-to-r from-mid-purple to-primary-purple hover:from-primary-purple hover:to-mid-purple text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 md:w-full justify-center cursor-pointer shadow-md glow-purple"
                  >
                    Select Lead Target
                  </button>
                </div>

                <div className="mt-2 w-full flex justify-end">
                  {getStatusBadge(inq.status)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
