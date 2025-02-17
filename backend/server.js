require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const axios = require("axios")
const path = require("path")

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const TEEHEE_API_URL = process.env.TEEHEE_API_URL;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Error while connecting to MongoDB", err));

const jokeSchema = new mongoose.Schema({
    jokeID: { type: String, unique: true },
    question: String,
    answer: String,
    votes: { type: Map, of: Number, default: { "😂": 0, "👍": 0, "❤️": 0 } }
});
const Joke = mongoose.model("Joke", jokeSchema);

app.get("/api/joke", async (req, res) => {
    try {
        const { data } = await axios.get(TEEHEE_API_URL);
        const joke = await Joke.findOneAndUpdate(
            { jokeID: data.id },
            { question: data.question, answer: data.answer },
            { new: true, upsert: true }
        );
        res.json(joke);
    } catch (error) {
        res.status(500).json({ message: "Error fetching joke" });
    }
});

app.post("/api/joke/vote", async (req, res) => {
    const { jokeID, emoji } = req.body;

    try {
        const joke = await Joke.findOneAndUpdate(
            { jokeID },
            { $inc: { [`votes.${emoji}`]: 1 } },
            { new: true }
        );

        joke ? res.json(joke) : res.status(404).json({ message: "Joke not found" })
    } catch (error) {
        res.status(500).json({ message: "Error updating vote" })
    }
});

// Serve Frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start Server
app.listen(PORT, () => console.log("Server is running on port", PORT));