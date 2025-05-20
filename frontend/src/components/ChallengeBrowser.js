import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/components.css'; // ensure styles are applied

const ChallengeBrowser = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get('/api/challenges');
        setChallenges(res.data);
      } catch (err) {
        console.error('Error fetching challenges:', err);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="challenge-browser">
      <h2>Coding Challenges</h2>
      <div className="challenge-list">
        {challenges.map(challenge => (
          <div key={challenge._id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <span className={`difficulty ${challenge.difficulty}`}>
              {challenge.difficulty}
            </span>
            <Link to={`/compile/${challenge._id}`} className="solve-btn">
              Solve Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeBrowser;
