require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoOIDCError } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Error while connecting to MongoDB", err));

app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Start Server
app.listen(PORT, () => console.log("Server is running on port", PORT));