import React from "react";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

function App() {
    return (
        <div className="App">
            <header>
                <h1>Guessing Number Game</h1>
            </header>
            <main>
                <Game />
                <Leaderboard />
            </main>
        </div>
    );
}

export default App;
