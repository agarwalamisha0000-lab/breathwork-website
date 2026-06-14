import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Landmark, MapPin, CheckCircle, Clock, Trash2, Sliders, ExternalLink, RefreshCw } from 'lucide-react';
import { Inquiry, ProposalResult } from '../types';

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
        return <span className="bg-orange-50 text-orange-600 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING REVIEW</span>;
      case 'contacted':
        return <span className="bg-blue-50 text-blue-600 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1"><Mail className="w-3 h-3" /> INTRO DUCTION SENT</span>;
      case 'scheduled':
        return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><Calendar className="w-3 h-3" /> DEMO SCHEDULED</span>;
    }
  };

  return (
    <div className="bg-white border border-sage-100 rounded-3xl p-6 md:p-8 shadow-xl" id="partner-leads-registry">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-sage-100 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono text-gold-600 tracking-widest block uppercase font-bold">OPERATIONS CENTER</span>
          <h3 className="text-2xl font-serif text-charcoal-900 font-semibold tracking-wide">
            Partnership Applications & Inquiries
          </h3>
          <p className="text-xs text-sage-500 mt-0.5">
            Real-time synchronization of luxury General Managers requesting custom Vedic curriculum reviews.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-sage-50 hover:bg-sage-100 border border-sage-200 text-sage-600 rounded-xl transition-all self-end sm:self-auto flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Leades
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-sage-50 pb-2">
        {(['all', 'pending', 'scheduled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-sage-800 text-white'
                : 'text-sage-500 hover:text-charcoal-900 bg-sage-50 hover:bg-sage-100'
            }`}
          >
            {tab === 'all' ? 'All Applicants' : tab === 'pending' ? 'Unreviewed New' : 'Demo Set'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-sage-50/50 border border-dashed border-sage-200 rounded-2xl">
            <Landmark className="w-8 h-8 text-sage-300 mx-auto mb-2" />
            <span className="block text-sm font-semibold text-sage-800">No matching luxury inquiries found</span>
            <span className="text-xs text-sage-400">Use the Proposal Architect form above to generate and submit a test lead.</span>
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="border border-sage-100 hover:border-gold-500/30 rounded-2xl p-5 hover:bg-gold-50/10 transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-serif text-charcoal-900 font-semibold">{inq.hotelName}</h4>
                  <div className="flex gap-2">
                    <span className="bg-sage-100 text-sage-800 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {inq.hotelInfo.location}
                    </span>
                    <span className="bg-gold-50 text-gold-800 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase">
                      {inq.hotelInfo.roomCount} Rooms • {inq.hotelInfo.averageRate > 30000 ? 'Ultra Luxury' : 'Boutique'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                  <div className="flex items-center gap-2 text-sage-600">
                    <Landmark className="w-3.5 h-3.5 text-sage-400" />
                    <span>Focus: <strong className="text-sage-800 font-medium">{inq.hotelInfo.focusTheme}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-600">
                    <Mail className="w-3.5 h-3.5 text-sage-400" />
                    <span>{inq.contactName} ({inq.contactEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-600">
                    <Phone className="w-3.5 h-3.5 text-sage-400" />
                    <span>{inq.contactPhone}</span>
                  </div>
                </div>

                <p className="text-xs text-sage-500 leading-normal bg-sage-50 p-2.5 rounded-xl border border-sage-100 italic">
                  "Seeking customized curriculum for {inq.hotelInfo.targetDemographic}. Existing wellness offerings are felt to be generic."
                </p>
              </div>

              <div className="flex md:flex-col justify-between items-end gap-3 self-stretch border-t md:border-t-0 md:border-l border-sage-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                <div className="text-left md:text-right w-full">
                  <span className="text-[10px] font-mono text-sage-400 block">Applied On</span>
                  <span className="text-xs text-sage-700 font-mono font-medium">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex gap-2 md:w-full mt-2 justify-end">
                  <button
                    onClick={() => onSelectInquiry(inq)}
                    className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 md:w-full justify-center shadow-lg shadow-gold-500/5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> RE-GENERATE PROPOSAL
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
