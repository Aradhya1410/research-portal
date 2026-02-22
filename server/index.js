


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Server running on Vercel 🚀");
});

// Text analysis function
function analyzeText(text) {
    if (!text || text.trim().length < 20) {
        return {
            tone: "Neutral",
            confidenceLevel: "Low",
            positives: ["Text too short for proper analysis"],
            concerns: ["Insufficient data"],
            forwardGuidance: ["Not available"],
            capacityUtilization: ["Not available"],
            growthInitiatives: ["Not available"]
        };
    }

    const lower = text.toLowerCase();

    let tone = "Neutral";
    if (lower.includes("growth") || lower.includes("profit")) {
        tone = "Optimistic";
    }
    if (lower.includes("risk") || lower.includes("loss")) {
        tone = "Cautious";
    }

    return {
        tone,
        confidenceLevel: "Medium",
        positives: ["Basic keyword-based analysis completed"],
        concerns: ["Manual review recommended"],
        forwardGuidance: ["Future outlook depends on context"],
        capacityUtilization: ["Not specifically mentioned"],
        growthInitiatives: ["Not specifically mentioned"]
    };
}

// POST route (NO file upload)
app.post("/upload", (req, res) => {
    try {
        const { text } = req.body;

        const result = analyzeText(text);

        res.json({
            message: "Analysis successful",
            analysis: result
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = app;