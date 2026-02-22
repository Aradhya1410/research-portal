const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// ---------- TEXT ANALYSIS FUNCTION ----------

function analyzeText(text) {
    if (!text || text.trim().length < 50) {
        return {
            tone: "Neutral",
            confidenceLevel: "Low",
            positives: ["Text extraction limited or document may be scanned."],
            concerns: ["Low text readability detected."],
            forwardGuidance: ["Not mentioned in transcript"],
            capacityUtilization: ["Not mentioned in transcript"],
            growthInitiatives: ["Not mentioned in transcript"]
        };
    }

    const lowerText = text.toLowerCase();
    const sentences = text.split(/[.!?]\s+/).filter(s => s.trim().length > 40);

    const positiveKeywords = ["growth", "strong", "increase", "improved", "record", "expansion", "profit", "positive", "momentum"];
    const concernKeywords = ["decline", "risk", "challenge", "pressure", "uncertain", "slowdown", "weak", "loss"];
    const guidanceKeywords = ["revenue", "margin", "capex", "guidance", "outlook", "forecast"];
    const capacityKeywords = ["capacity", "utilization", "production", "output"];
    const growthKeywords = ["new project", "launch", "expansion", "investment", "initiative", "acquisition"];

    const positives = sentences.filter(s =>
        positiveKeywords.some(word => s.toLowerCase().includes(word))
    ).slice(0, 5);

    const concerns = sentences.filter(s =>
        concernKeywords.some(word => s.toLowerCase().includes(word))
    ).slice(0, 5);

    const forwardGuidance = sentences.filter(s =>
        guidanceKeywords.some(word => s.toLowerCase().includes(word))
    ).slice(0, 5);

    const capacityUtilization = sentences.filter(s =>
        capacityKeywords.some(word => s.toLowerCase().includes(word))
    ).slice(0, 3);

    const growthInitiatives = sentences.filter(s =>
        growthKeywords.some(word => s.toLowerCase().includes(word))
    ).slice(0, 3);

    let tone = "Neutral";
    if (positives.length > concerns.length) tone = "Optimistic";
    if (concerns.length > positives.length) tone = "Cautious";

    let confidenceLevel = "Medium";
    if (text.length > 5000) confidenceLevel = "High";
    if (text.length < 1000) confidenceLevel = "Low";

    return {
        tone,
        confidenceLevel,
        positives: positives.length ? positives : ["Not clearly mentioned"],
        concerns: concerns.length ? concerns : ["No major concerns explicitly stated"],
        forwardGuidance: forwardGuidance.length ? forwardGuidance : ["Not mentioned in transcript"],
        capacityUtilization: capacityUtilization.length ? capacityUtilization : ["Not mentioned in transcript"],
        growthInitiatives: growthInitiatives.length ? growthInitiatives : ["Not mentioned in transcript"]
    };
}

// ---------- PDF UPLOAD ROUTE ----------
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        const analysis = analyzeText(pdfData.text);


        res.json({
            message: "PDF processed successfully",
            analysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
});
module.exports = app;
