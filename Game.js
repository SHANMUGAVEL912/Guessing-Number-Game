import React, { useState, useEffect } from "react";
import axios from "axios";
 import "./Game.css";

const Game = () => {
    const [name, setName] = useState("");
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [timer, setTimer] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        let interval;
        if (gameStarted) {
            interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameStarted]);

    const startGame = async () => {
        setGameStarted(true);
        setTimer(0);
        setMoves(0);
        setFeedback("");
        await axios.get("http://localhost:5000/new-game");
    };

    const handleGuess = async () => {
        setMoves((prev) => prev + 1);
        const response = await axios.post("http://localhost:5000/guess", { guess });
        setFeedback(response.data.feedback);

        if (response.data.feedback === "++++") {
            setGameStarted(false);
            alert(`Congratulations ${name}! You guessed the number in ${timer}s and ${moves} moves.`);
            await axios.post("http://localhost:5000/save-score", { name, time: timer, moves });
        }
    };

    return (
        <div className="game-container">
            {!gameStarted ? (
                <div className="start-game">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={startGame}>Start Game</button>
                </div>
            ) : (
                <div className="gameplay">
                    <p>Time: {timer}s | Moves: {moves}</p>
                    <input
                        type="text"
                        placeholder="Enter your guess"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                    <button onClick={handleGuess}>Submit Guess</button>
                    <p>Feedback: {feedback}</p>
                </div>
            )}
        </div>
    );
};

export default Game;
