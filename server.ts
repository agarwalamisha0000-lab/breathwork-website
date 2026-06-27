import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { google } from "googleapis";
import { createServer as createViteServer } from "vite";
import { HotelInfo, Inquiry, ProposalResult } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies with increased size limit for base64 images
app.use(express.json({ limit: "20mb" }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Mock/In-memory database for tracking B2B inquiries (seeded with high-quality luxury entries)
let inquiries: Inquiry[] = [
  {
    id: "inq_1",
    hotelName: "Svatma Boutique Heritage Resort",
    contactName: "Srinivasan Raman",
    contactEmail: "gm@svatmatanjore.com",
    contactPhone: "+91 98450 12891",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "scheduled",
    hotelInfo: {
      hotelName: "Svatma Boutique Heritage Resort",
      location: "Thanjavur, Tamil Nadu",
      roomCount: 38,
      averageRate: 18000,
      hasSpa: true,
      targetDemographic: "Cultured Heritage & Wellness Seekers",
      focusTheme: "Sound Vibration, Temple Arts & Traditional Rest"
    }
  },
  {
    id: "inq_2",
    hotelName: "Glenburn Tea Estate & Retreat",
    contactName: "Margaret Taylor",
    contactEmail: "info@glenburnretreat.com",
    contactPhone: "+91 81005 32910",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "contacted",
    hotelInfo: {
      hotelName: "Glenburn Tea Estate & Retreat",
      location: "Darjeeling, Himalayas",
      roomCount: 18,
      averageRate: 42000,
      hasSpa: false,
      targetDemographic: "Elite International Travelers seeking Absolute Rest",
      focusTheme: "High-Altitude Himalayan Air Purification & Reset"
    }
  }
];

// Helper to calculate realistic default ROI projections based on hotel parameters
function generateLocalProposal(info: HotelInfo): ProposalResult {
  const currencySymbol = "₹";
  const adr = info.averageRate;
  const rooms = info.roomCount;
  
  // Logical projections
  const wellnessPremium = Math.round(adr * 0.08); // 8% premium
  const additionalDirectRevenue = Math.round(rooms * 365 * 0.40 * (adr * 0.05)); // 40% occupancy, 5% spend lift
  
  return {
    title: `Soma-Vayu Breathwork Sanctuary at ${info.hotelName}`,
    tagline: `Unlocking the healing power of conscious Vedic respiration to elevate guest satisfaction and unlock a unique brand narrative.`,
    summary: `A boutique wellness program designed specifically for ${info.hotelName} in ${info.location}. This custom curriculum bypasses generic spa treatments and deepens the hotel's luxury identity. By utilizing local geography (air quality, altitude, and climate), we create an immersive sensory respiration experience that guests will rave about in reviews.`,
    modules: [
      {
        title: "Dusk Nadi Shodhana (Purification Circle)",
        description: "A soothing twilight respiratory meditation designed to balance the sympathetic nervous system, perfect for travelers with jetlag or travelers looking to settle in.",
        guestExperience: "Performed with herbal oil diffusions and soft lighting in a courtyard or designated quiet area.",
        schedule: "Daily at 5:30 PM (45-minute session)"
      },
      {
        title: "Prana Awakening (Morning Vitalization)",
        description: "An active Vedic breathing module consisting of Bhastrika and Kapalabhati to awaken internal fire, boost cellular oxygenation, and energize guests for active sightseeing.",
        guestExperience: "Open-air overlooking local scenery, accompanied by dynamic warm muscle stretches.",
        schedule: "Daily at 7:00 AM (40-minute session)"
      }
    ],
    commercialPackages: [
      {
        tierName: "Veda Standard Partnership",
        priceAnnually: 180000,
        deliverables: [
          "Complete curriculum setup and 4 key guest-facing guides",
          "Bi-weekly live video masterclasses for resort guests",
          "Staff training for front-desk wellness onboarding",
          "Custom audio guides recorded for in-room guest tablet/TV"
        ],
        recommendedFor: "Resorts starting to define their wellness vertical"
      },
      {
        tierName: "Prana Premium Residency",
        priceAnnually: 380400,
        deliverables: [
          "Everything in Veda Standard",
          "3-Day physical workshop residency by Amisha Agarwal",
          "Interactive guest booklets with customized botanical pairing",
          "TripAdvisor and Guest Review Optimization Toolkit",
          "24/7 client GM consult pipeline"
        ],
        recommendedFor: "Aspirational luxury boutique properties aiming for standard-setting signature stays"
      }
    ],
    roiProjections: {
      satisfiedScoreIncrease: "An projected +12% increase in guest satisfaction ratings on major OTA platforms (TripAdvisor, Booking.com) focusing on memorable hospitality experiences.",
      roomPremiumRate: `Ability to implement a '${info.focusTheme || "Prana Core Space"}' room upgrade charging a premium of ${currencySymbol}${wellnessPremium.toLocaleString("en-IN")}/night.`,
      annualIncrementalRevenue: `${currencySymbol}${additionalDirectRevenue.toLocaleString("en-IN")} in ancillary revenue from premium retreats, repeat guests, and private corporate group packages.`,
      marketingVantage: `Unlocks a brand story centered around the authentic Vedic lineage of breath integration, creating strong organic marketing assets and local PR visibility.`
    }
  };
}

// API: Generate Custom Breathwork Proposal for a Hotel using Gemini
app.post("/api/generate-proposal", async (req, res) => {
  const { hotelInfo } = req.body;
  if (!hotelInfo || !hotelInfo.hotelName || !hotelInfo.location) {
    return res.status(400).json({ error: "Missing required hotel parameters" });
  }

  const { hotelName, location, roomCount, averageRate, hasSpa, targetDemographic, focusTheme } = hotelInfo as HotelInfo;

  // Let's create the prompt
  const prompt = `
Generate a highly customized, premium B2B wellness partnership and breathwork proposal for a boutique hotel or resort.
The target decision maker is the Owner or General Manager, who wants to see strategic alignment and a return on investment (ROI).

Here are the specific hotel parameters provided by the GM:
- Hotel Name: ${hotelName}
- Location: ${location}
- Room Count: ${roomCount}
- Average Daily Room Rate (ADR): ₹${averageRate.toLocaleString("en-IN")} INR per night
- Has an Existing Spa: ${hasSpa ? "Yes" : "No, they need wellness to be a distinct standalone differentiator outside of conventional spa spaces"}
- Core Guest Demographic: ${targetDemographic}
- Desired Wellness Theme / Frustration Focus: ${focusTheme || "Custom bespoke relaxation and dynamic prana"}

The yoga / breathwork instructor proposing this is "Amisha Agarwal", an expert Breathwork Instructor with 8 years of intensive pranayama practice, representing her personal brand "Amisha Agarwal". 
We offer bespoke premium respiratory integrations (not generic classes, but high-end signature guest respiratory journeys).

Please generate a professional, ROI-driven proposal in JSON matching our schema.
Make sure the tone is ultra-luxurious, commercial, professional, respectful of traditional Vedic pranayama wisdom, but highly strategic for hoteliers wanting guest experience scores (TripAdvisor) and high yield.

Provide custom-designed breathing sessions tailored perfectly to their geographical microclimate or environment (e.g. if mountains: altitude acclimatization and warming breath; if coastal/beach: cooling marine pranayama, ocean rhythm synchronization; if heritage palace: royal silence and sound vibration; if urban: digital-detox, sympathetic down-regulation).

Calculated Projections references:
- Design realistic pricing for our annual retaining fee (should be between ₹1,20,000 to ₹4,80,000 per year, depending on their room count and guest demographic).
- Formulate realistic ROI metrics showing how their room rate premium (+5% to +10%) or booking occupancy rate will increase.
`;

  try {
    // Call Gemini with structured schema
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master Vedic breathwork teacher and upscale hospitality wellness program designer. You format highly polished professional business proposals for premium hoteliers seeking ROI and premium branding.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "tagline", "summary", "modules", "commercialPackages", "roiProjections"],
          properties: {
            title: { type: Type.STRING, description: "A beautiful, premium partnership title, e.g. 'The Soma Sanctum at Glenburn Tea Estate'" },
            tagline: { type: Type.STRING, description: "A luxury brand headline that bridges Vedic lineage with high guest experience yield" },
            summary: { type: Type.STRING, description: "A rich paragraph that explicitly connects their resort context (rooms, location, demographic) to the breathwork opportunity, addressing their specific wellness theme/frustration and proving why a spa is not required to create world-class wellness stories." },
            modules: {
              type: Type.ARRAY,
              description: "2 custom signature guest experiences tailored for their specific resort environment, locations, and theme",
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "guestExperience", "schedule"],
                properties: {
                  title: { type: Type.STRING, description: "The name of the custom session (e.g., 'Alti-Prana Acclimatization Protocol' or 'Sunset Soma Restorations')" },
                  description: { type: Type.STRING, description: "Detailed summary of the physiological and experiential mechanism" },
                  guestExperience: { type: Type.STRING, description: "Description of the sensory atmosphere (oil pairings, music, location like rooftops, beach, garden)" },
                  schedule: { type: Type.STRING, description: "Proposed daily or weekly time slot and longevity" }
                }
              }
            },
            commercialPackages: {
              type: Type.ARRAY,
              description: "2 progressive tier packages with realistic annual partnership fees in Indian Rupees",
              items: {
                type: Type.OBJECT,
                required: ["tierName", "priceAnnually", "deliverables", "recommendedFor"],
                properties: {
                  tierName: { type: Type.STRING, description: "E.g., 'Prana Signature Integration' or 'Full Residency Partnership'" },
                  priceAnnually: { type: Type.INTEGER, description: "The actual estimated annual retainer fee in ₹ INR" },
                  deliverables: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-5 high-value corporate/hospitality items"
                  },
                  recommendedFor: { type: Type.STRING, description: "Who this tier fits best (e.g., 'Best for boutique estates wanting full branding change')" }
                }
              }
            },
            roiProjections: {
              type: Type.OBJECT,
              required: ["satisfiedScoreIncrease", "roomPremiumRate", "annualIncrementalRevenue", "marketingVantage"],
              properties: {
                satisfiedScoreIncrease: { type: Type.STRING, description: " Tripadvisor / reviews lift projection" },
                roomPremiumRate: { type: Type.STRING, description: "How much premium they can charge for a wellness package room addon" },
                annualIncrementalRevenue: { type: Type.STRING, description: "Total incremental revenue projection based on room ADR, occupancy rate, and loyalty ratings" },
                marketingVantage: { type: Type.STRING, description: "The PR angle they gain over competitive standard corporate chains" }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const proposal: ProposalResult = JSON.parse(text);
    return res.json(proposal);

  } catch (error) {
    console.error("Gemini API Error, falling back to local simulation:", error);
    // Secure fallback so the luxury experience is never broken even if the key is missing or encounters a rate limit!
    const fallbackProposal = generateLocalProposal(hotelInfo);
    return res.json(fallbackProposal);
  }
});

// API: List all inquiries
app.get("/api/inquiries", (req, res) => {
  res.json(inquiries);
});

// API: Register a new inquiry and automatically associate/generate a baseline proposal
app.post("/api/inquiries", async (req, res) => {
  const { contactName, contactEmail, contactPhone, hotelInfo } = req.body;
  
  if (!contactName || !contactEmail || !hotelInfo || !hotelInfo.hotelName) {
    return res.status(400).json({ error: "Missing contact name, email, or hotel details" });
  }

  const newInquiry: Inquiry = {
    id: `inq_${Date.now()}`,
    hotelName: hotelInfo.hotelName,
    contactName,
    contactEmail,
    contactPhone: contactPhone || "N/A",
    createdAt: new Date().toISOString(),
    status: "pending",
    hotelInfo
  };

  inquiries.unshift(newInquiry);
  console.log("New inquiry created:", newInquiry);

  // Write to Google Sheet
  try {
    console.log("Attempting to write to Google Sheets for inquiry:", newInquiry.id);
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: '17M5MR9sNUsdkgPYI0tRjE_aVSu4nbeEXb4UrFQSYrTw',
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[newInquiry.createdAt, contactName, contactEmail, contactPhone, hotelInfo.hotelName]],
      },
    });
    console.log("Successfully wrote to Google Sheets");
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    // Don't fail the request if sheet fails
  }

  res.status(201).json(newInquiry);
});

// API: Upload custom hero background / portrait image
app.post("/api/upload-hero", (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image data" });
  }

  try {
    // Strip the Data URI scheme (e.g. "data:image/jpeg;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Ensure /public directory exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicFilePath = path.join(publicDir, "amisha_bg.jpg");
    fs.writeFileSync(publicFilePath, buffer);

    // Also write to /dist directory if it exists, for instant production serve without rebuild
    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      const distFilePath = path.join(distDir, "amisha_bg.jpg");
      fs.writeFileSync(distFilePath, buffer);
    }

    console.log("Custom hero image saved successfully components with path /amisha_bg.jpg");
    res.json({ success: true, url: "/amisha_bg.jpg" });
  } catch (error) {
    console.error("Error saving uploaded image:", error);
    res.status(500).json({ error: "Failed to save uploaded image" });
  }
});

// Default pre-seeded gallery images in case persistent file doesn't exist yet
const DEFAULT_GALLERY_IMAGES = [
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
  }
];

const GALLERY_FILE_PATH = path.join(process.cwd(), "gallery.json");

// API: Get gallery images (either loaded from custom database/file or pre-seeded default)
app.get("/api/gallery", (req, res) => {
  try {
    if (fs.existsSync(GALLERY_FILE_PATH)) {
      const data = fs.readFileSync(GALLERY_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
  } catch (error) {
    console.error("Failed to read gallery registry file:", error);
  }
  return res.json(DEFAULT_GALLERY_IMAGES);
});

// API: Upload custom gallery photo (accepts base64, saves as local file, and returns URL)
app.post("/api/gallery/upload", (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image data for gallery upload" });
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const uniqueFilename = `gallery_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const publicFilePath = path.join(publicDir, uniqueFilename);
    fs.writeFileSync(publicFilePath, buffer);

    // Copy to dist folder in case it is served directly from there in production
    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      const distFilePath = path.join(distDir, uniqueFilename);
      fs.writeFileSync(distFilePath, buffer);
    }

    console.log(`Successfully uploaded and stored gallery photo: /${uniqueFilename}`);
    res.json({ success: true, url: `/${uniqueFilename}` });
  } catch (error) {
    console.error("Error storing custom gallery photo:", error);
    res.status(500).json({ error: "Failed to store custom gallery photo" });
  }
});

// API: Save updated gallery configuration array persistently
app.post("/api/gallery/save", (req, res) => {
  const { gallery } = req.body;
  if (!gallery || !Array.isArray(gallery)) {
    return res.status(400).json({ error: "Invalid gallery list payload" });
  }

  try {
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(gallery, null, 2), "utf-8");
    console.log("Persistent gallery configuration saved successfully.");
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving persistent gallery config:", error);
    res.status(500).json({ error: "Failed to save persistent gallery config" });
  }
});

// Vite server integrations
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Amisha Agarwal B2B Server running on port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Error booting Amisha Agarwal fullstack server:", err);
});
