import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';
import API_URL from '../config';

const ProgressDashboard = ({ progress }) => {
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data (including progress) from the backend
    axios.get(`${API_URL}/api/progress/user-progress`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('API Response:', response.data); // Debug the response structure
        setUserData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      });
      
    // Fetch badges separately
    axios.get(`${API_URL}/api/badges`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Badges Response:', response.data);
        setBadges(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching badges:', error);
      });
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Progress</h2>

      {/* Progress Chart */}
      <LineChart width={600} height={300} data={progress}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="completed" stroke="#8884d8" />
      </LineChart>

      {/* Display Badges */}
      <h3>Your Badges</h3>
      {isLoading ? (
        <p>Loading your achievements...</p>
      ) : (
        <div className="badge-list">
          {badges && badges.length > 0 ? (
            badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-icon">{badge.icon}</div> {/* Changed to use text icon */}
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No badges earned yet!</p>
          )}
        </div>
      )}
      
      {/* Display Challenges Completed */}
      {userData && userData.challengesCompleted && (
        <div className="challenges-completed">
          <h3>Challenges Completed</h3>
          <p>Total: {userData.challengesCompleted.length}</p>
          <ul>
            {userData.challengesCompleted.map((challenge, index) => (
              <li key={index}>
                {challenge.challengeDetails ? challenge.challengeDetails.title : `Challenge ${challenge.challengeId}`}
                {challenge.passed ? ' (Passed)' : ' (Attempted)'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;