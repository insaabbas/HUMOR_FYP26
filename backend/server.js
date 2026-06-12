import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/api/generate-joke', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("🚀 Lollify requesting joke for:", prompt);

        const response = await fetch("https://insaabbas-lollify-fast.hf.space/gradio_api/call/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.HF_TOKEN}`
            },
            body: JSON.stringify({ data: [prompt] })
        });

        const { event_id } = await response.json();
        
        if (!event_id) throw new Error("Check your Space status.");

        const resultResponse = await fetch(`https://insaabbas-lollify-fast.hf.space/gradio_api/call/predict/${event_id}`);
        const text = await resultResponse.text();
        
        const match = text.match(/data: \["(.*)"\]/);
        const jokeRaw = match ? match[1] : "The alchemy failed! Try different words.";

        // --- DATABASE LOGIC START ---
        const jokeFormatted = jokeRaw.replace(/\\n/g, '\n');

        // Logic to select your 3 specific categories
        let selectedCategory = 'joke of the day'; 
        if (prompt.toLowerCase().includes("word") || prompt.toLowerCase().includes("alchemy")) {
            selectedCategory = 'Word pairs';
        } else if (prompt.toLowerCase().includes("headline")) {
            selectedCategory = 'headline';
        }

        // Insert into the 5-column table: id (auto), category, input, joke, timestamp (auto)
        const { error: dbError } = await supabase
            .from('jokes')
            .insert([
                { 
                    category: selectedCategory, 
                    input: prompt,    // Added: Saves the words or headline entered
                    joke: jokeFormatted 
                }
            ]);

        if (dbError) {
            console.error("⚠️ Database storage failed:", dbError.message);
        } else {
            console.log(`💾 Saved to Lollify-DB! Input: "${prompt.substring(0, 20)}..."`);
        }
        // --- DATABASE LOGIC END ---

        console.log("✨ Success!");
        res.json({ joke: jokeFormatted });

    } catch (error) {
        console.error("❌ Connection Error:", error.message);
        res.status(500).json({ error: "Space Busy", details: error.message });
    }
});

// Test Supabase connection on startup
const verifyDb = async () => {
    const { error } = await supabase.from('jokes').select('id').limit(1);
    if (error) console.error("❌ DB Connection Error:", error.message);
    else console.log("📡 Connected to Supabase!");
};
verifyDb();

app.listen(5000, () => console.log(`✅ Lollify Backend live at http://localhost:5000`));