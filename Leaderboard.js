import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("http://localhost:5000/leaderboard");
                setLeaders(response.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err.message);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            {leaders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Time (s)</th>
                            <th>Moves</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{leader.name}</td>
                                <td>{leader.best_time}</td>
                                <td>{leader.best_moves}</td>
                                <td>{leader.score_formula}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No scores yet!</p>
            )}
        </div>
    );
};

export default Leaderboard;
