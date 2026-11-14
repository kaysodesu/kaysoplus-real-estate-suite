// Generated from the original app's server.ts for the combined suite.
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createRouter() {
  const app = express.Router();

  app.use(express.json());

  // Initialize Gemini AI client lazily
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Prompt Studio Generation endpoint
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const {
        clientName,
        property,
        sqft,
        beds,
        features,
        formula, // 'luxury' | 'first_time' | 'social_thread' | 'zillow_optimized' | 'custom'
        customPrompt,
        tone = "Professional & Engaging",
        length = "medium", // 'concise' | 'medium' | 'detailed'
        targetAudience = "General Buyers",
      } = req.body;

      const genAI = getGeminiClient();

      if (!genAI) {
        // Return structured fallback based on the formula if API key is not yet set
        return res.json({
          success: true,
          isFallback: true,
          copy: generateLocalFormulaCopy({
            clientName,
            property,
            sqft,
            beds,
            features,
            formula,
          }),
        });
      }

      const promptInstructions = `
You are an elite real estate copywriter and MLS listing strategist for high-performing realtors.
Generate a captivating, ready-to-publish real estate listing copy based on these client & property details:

Client / Agent: ${clientName || "Real Estate Partner"}
Property Name / Address: ${property || "Premier Residence"}
Square Footage: ${sqft || "N/A"}
Bedrooms / Bathrooms: ${beds || "N/A"}
Key Amenities & Raw Feature Notes: ${features || "Modern styling and prime location."}
Selected Formula Archetype: ${formula}
Tone: ${tone}
Length: ${length}
Target Audience: ${targetAudience}
${customPrompt ? `Additional Custom Directives: ${customPrompt}` : ""}

Formula style guidelines:
- If 'luxury': Use opulent, architectural, high-end vocabulary, sensory descriptions, exclusive lifestyle framing, and private showing invitation.
- If 'first_time': Highlight turnkey convenience, equity growth, functional layout, low maintenance, community perks, and encouraging call to action.
- If 'social_thread': Format as a 4-5 tweet/post social media hook thread with numbers (1/, 2/, 3/...), emojis, clean line breaks, and clear DM/link CTA.
- If 'zillow_optimized': Highly skimmable, bullet-pointed spec breakdown, MLS keywords for high search ranking, clear neighborhood highlights, and seller contact prompt.
- If 'custom': Follow the user's custom directives while ensuring compelling listing flow.

Output ONLY the formatted copy without conversational preamble or meta commentary.
`;

      const response = await genAI.models.generateContent({
        model: "gemini-3.7-flash",
        contents: promptInstructions,
      });

      const copy = response.text || "";

      res.json({
        success: true,
        isFallback: false,
        copy: copy.trim(),
      });
    } catch (error: any) {
      console.error("Gemini copy generation error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate AI copy",
      });
    }
  });

  // AI Copy Refinement / Quick Action endpoint
  app.post("/api/refine-copy", async (req, res) => {
    try {
      const { currentCopy, action, customInstruction } = req.body;
      const genAI = getGeminiClient();

      if (!genAI) {
        return res.status(400).json({
          success: false,
          error: "Gemini API key is not configured for refinement.",
        });
      }

      let instruction = "";
      switch (action) {
        case "make_punchier":
          instruction = "Make this real estate listing copy punchier, more dynamic, and remove fluff while preserving all core specs.";
          break;
        case "elevate_luxury":
          instruction = "Rewrite this listing with heightened luxury, bespoke architectural tone, and refined affluent phrasing.";
          break;
        case "add_hashtags":
          instruction = "Add highly optimized real estate and neighborhood hashtags, SEO tags, and a strong Instagram/Facebook CTA at the bottom.";
          break;
        case "shorten_bullet_points":
          instruction = "Convert the main body into clean, high-converting bullet points with bold feature anchors.";
          break;
        case "custom":
          instruction = customInstruction || "Refine and improve the flow of this copy.";
          break;
        default:
          instruction = "Polish and enhance this real estate listing copy.";
      }

      const response = await genAI.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Original Real Estate Copy:\n"""\n${currentCopy}\n"""\n\nRefinement Request: ${instruction}\n\nReturn ONLY the revised real estate copy.`,
      });

      res.json({
        success: true,
        copy: (response.text || "").trim(),
      });
    } catch (error: any) {
      console.error("Refinement error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to refine copy",
      });
    }
  });

  // Helper local formula generator for fallback
  function generateLocalFormulaCopy({
    property,
    sqft,
    beds,
    features,
    formula,
  }: {
    clientName: string;
    property: string;
    sqft: string;
    beds: string;
    features: string;
    formula: string;
  }) {
    const p = property || "123 Maple St";
    const s = sqft || "Custom Size";
    const b = beds || "Premium Layout";
    const f = features || "Elite custom detailing and premier location.";

    switch (formula) {
      case "luxury":
        return `✨ ICONIC STATEMENT RESIDENCE: TOURS OPEN ✨\n\nIntroducing a masterfully tailored living experience at ${p}.\n\nSpecs Checklist:\n• Architectural Blueprint: ${s}\n• Layout Masterwork: ${b}\n\nCore Lifestyle Elements:\n${f}\n\nThis curated inventory block sets a new standard for luxury operational design. Connect for private viewing calendar.`;
      case "first_time":
        return `🔑 COMPACT SOVEREIGNTY ARCHITECTURE 🔑\n\nStop missing out on real equity growth. Welcome home to ${p}!\n\nThis turn-key asset provides an optimal footprint of ${s} and a gorgeous ${b} layout configuration.\n\nHighlights Include:\n📌 ${f}\n\nBuilt for high-turnover productivity & effortless living. Own your tomorrow.`;
      case "social_thread":
        return `1/ Big news for real estate acquisition teams. A pristine high-volume opportunity has hit the board at ${p}. Full breakdown on the design assets below 👇\n\n2/ Space breakdown: Leveraging an expansive footprint of ${s} with an optimized ${b}.\n\n3/ The critical value driver here lies in the feature matrix: ${f}\n\n4/ DM the studio queue right now to lock down priority file review paths. This inventory asset is moving fast.`;
      case "zillow_optimized":
      default:
        return `Exceptional opportunity to capture premium real estate tracking values at ${p}. Spanning an efficient ${s} with ${b}.\n\nHighlight features include:\n• ${f}\n\nTurn-key, meticulously prepared, and market optimized. Schedule your tour today!`;
    }
  }

  return app;
}
