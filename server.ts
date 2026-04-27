import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock GitHub OAuth redirect
  app.get("/api/auth/github", (req, res) => {
    // In a real app, this would redirect to GitHub
    const mockCode = "mock_github_code_" + Math.random().toString(36).substring(7);
    res.json({ url: `https://github.com/login/oauth/authorize?client_id=MOCK_ID&code=${mockCode}` });
  });

  // Fetch Real GitHub Repositories
  app.get("/api/github/repos", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed GitHub token" });
    }
    const token = authHeader.split(" ")[1];

    try {
      console.log("Fetching repos for token starting with:", token.substring(0, 10) + "...");
      const response = await axios.get("https://api.github.com/user/repos?per_page=100&sort=updated&type=owner", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "MyDeployii-Deployment-Engine"
        }
      });
      
      const repos = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        language: repo.language || 'Unknown',
        url: repo.html_url,
        description: repo.description
      }));

      res.json(repos);
    } catch (error: any) {
      console.error("GitHub API Proxy Error:", error.response?.data || error.message);
      const status = error.response?.status || 500;
      res.status(status).json({ 
        error: "Failed to fetch repositories from GitHub", 
        details: error.response?.data?.message || error.message,
        githubStatus: status
      });
    }
  });

  // Analyze code with Gemini (Real Implementation)
  app.post("/api/analyze", async (req, res) => {
    const { code, framework } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `
        As an expert DevOps and Software Architect, audit this ${framework || "web"} codebase.
        Provide:
        1. Security vulnerabilities check.
        2. Performance optimizations.
        3. Code quality improvements.
        4. "Deploy-ready" suggestions.
        
        Keep it concise and professional.
        
        CODE:
        ${code}
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      res.json({ analysis: text || "No analysis generated" });
    } catch (error) {
      console.error("Gemini Audit Error:", error);
      res.status(500).json({ error: "Failed to audit codebase" });
    }
  });

  // Simulate Deployment Process
  app.post("/api/deploy", async (req, res) => {
    const { projectId, repoUrl } = req.body;
    
    // This is a simulation for the demo
    const steps = ["cloning", "auditing", "building", "live"];
    let currentStepIndex = 0;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    const sendUpdate = (step: string, log: string) => {
      res.write(`data: ${JSON.stringify({ step, log })}\n\n`);
    };

    const runSimulation = async () => {
      sendUpdate("cloning", `Cloning repository from ${repoUrl}...`);
      await new Promise(r => setTimeout(r, 1500));
      
      sendUpdate("auditing", "Running Gemini AI Security Audit...");
      await new Promise(r => setTimeout(r, 2000));
      
      sendUpdate("building", "Containerizing application with Docker...");
      await new Promise(r => setTimeout(r, 2500));
      
      sendUpdate("live", "Provisioning domain and SSL. Site is now LIVE!");
      res.end();
    };

    runSimulation();
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
