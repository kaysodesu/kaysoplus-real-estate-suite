// KaysoPlus Real Estate Suite server: API routes from each blended app + the web app itself.
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createRouter as listingStudioRoutes } from "./server/listingStudio";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Listing Studio AI copywriter (from PropScript CRM): /api/generate-copy, /api/refine-copy, /api/health
app.use(listingStudioRoutes());

async function start() {
  const isProduction = process.env.NODE_ENV === "production" || /server\.[cm]?js$/.test(process.argv[1] ?? "");
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KaysoPlus Real Estate Suite running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
