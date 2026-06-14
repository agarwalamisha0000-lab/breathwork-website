export interface HotelInfo {
  hotelName: string;
  location: string;
  roomCount: number;
  averageRate: number; // in INR (₹)
  hasSpa: boolean;
  targetDemographic: string;
  focusTheme: string;
}

export interface Inquiry {
  id: string;
  hotelName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  hotelInfo: HotelInfo;
  createdAt: string;
  status: 'pending' | 'contacted' | 'scheduled';
}

export interface ProposalResult {
  title: string;
  tagline: string;
  summary: string;
  modules: Array<{
    title: string;
    description: string;
    guestExperience: string;
    schedule: string;
  }>;
  commercialPackages: Array<{
    tierName: string;
    priceAnnually: number;
    deliverables: string[];
    recommendedFor: string;
  }>;
  roiProjections: {
    satisfiedScoreIncrease: string;
    roomPremiumRate: string;
    annualIncrementalRevenue: string;
    marketingVantage: string;
  };
}
