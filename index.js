const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "12345", // Replace with your MySQL password
    database: "guessing_game", // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Generate a random 4-digit number with unique digits
const generateNumber = () => {
    let digits = new Set();
    while (digits.size < 4) {
        digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join("");
};

// State
let computerNumber = generateNumber();

// API Endpoints
app.get("/new-game", (req, res) => {
    computerNumber = generateNumber();
    res.json({ message: "New game started" });
});

app.post("/guess", (req, res) => {
    const { guess } = req.body;
    let plus = 0, minus = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === computerNumber[i]) plus++;
        else if (computerNumber.includes(guess[i])) minus++;
    }

    res.json({ feedback: "+".repeat(plus) + "-".repeat(minus) });
});

app.post("/save-score", (req, res) => {
    const { name, time, moves } = req.body;
    const score = time + moves * 2; // Example formula: time + 2x moves

    db.query(
        "INSERT INTO users (name, best_time, best_moves, score_formula) VALUES (?, ?, ?, ?)",
        [name, time, moves, score],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Failed to save score" });
            }
            res.json({ message: "Score saved successfully." });
        }
    );
});

app.get("/leaderboard", (req, res) => {
    db.query(
        "SELECT name, best_time, best_moves, score_formula FROM users ORDER BY score_formula ASC LIMIT 5",
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Failed to fetch leaderboard" });
            }
            res.json(result);
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
