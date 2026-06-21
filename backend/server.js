import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// COLAB API URL
// ======================
const COLAB_API_URL = process.env.COLAB_API_URL;

// ======================
// MAIN API ROUTE
// ======================
app.post('/api/generate-joke', async (req, res) => {
    try {
        const { prompt } = req.body;

        console.log("🚀 Request:", prompt);

        // ======================
        // CALL COLAB MODEL
        // ======================
        const response = await fetch(`${COLAB_API_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error("Colab API failed");
        }

        const data = await response.json();
        const jokeRaw = data.response || "No response from model";

        let jokeFormatted = jokeRaw.replace(/\\n/g, '\n');

        // ======================
        // CLEANUP: EXTRACT ONLY THE JOKE
        // ======================
        if (jokeFormatted.includes('### Response:')) {
            jokeFormatted = jokeFormatted.split('### Response:')[1].trim();
        }

        // ======================
        // CATEGORY LOGIC (optional)
        // ======================
        let selectedCategory = 'joke of the day';

        if (prompt.toLowerCase().includes("word")) {
            selectedCategory = 'Word pairs';
        } else if (prompt.toLowerCase().includes("headline")) {
            selectedCategory = 'headline';
        }

        console.log("📂 Category:", selectedCategory);

        // ======================
        // RESPONSE TO FRONTEND
        // ======================
        res.json({
            joke: jokeFormatted,
            category: selectedCategory
        });

    } catch (error) {
        console.error("❌ Error:", error.message);

        res.status(500).json({
            error: "Server Error",
            details: error.message
        });
    }
});

// ======================
// START SERVER
// ======================
app.listen(5000, () => {
    console.log("✅ Backend running on http://localhost:5000");
});









