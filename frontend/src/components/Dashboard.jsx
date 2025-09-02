import React, { lazy, Suspense, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import './Dashboard.css'
import API from '../api'
import CustomAlert from "./CustomAlert";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [emotionTotals, setEmotionTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMoodResponses = async () => {
      try {
        const res = await API.get(`/api/moodTracker/getAllMoods`);
        const moods = res.data.moods || [];

        if (moods.length === 0) {
          setEmotionTotals({});
          return;
        }

        const totals = {};
        const maxScorePerCard = 5;
        const numCards = moods.length;
        const maxTotal = numCards * maxScorePerCard;

        moods.forEach(entry => {
          const responses = entry.responses || {};
          Object.entries(responses).forEach(([emotion, score]) => {
            totals[emotion] = (totals[emotion] ?? 0) + score;
          });
        });

        const totalScoreAllEmotions = Object.values(totals).reduce((sum, val) => sum + val, 0);

        const percentages = {};
        Object.entries(totals).forEach(([emotion, totalScore]) => {
          const percent = (totalScore / totalScoreAllEmotions) * 100;
          if (percent > 0) percentages[emotion] = percent;
        });

        setEmotionTotals(percentages);
      } catch (error) {
        setMsg("Error fetching moods. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodResponses();
  }, []);

  const generatePieData = (emotion, percent) => ({
    labels: [emotion, "Other"],
    datasets: [
      {
        label: `${emotion} Chart`,
        data: [percent, 100 - percent],
        backgroundColor: ["#7e5f40", "#d6b98c"],
        hoverBackgroundColor: ["#7e5f40", "#d6b98c"],
        borderColor: "#7e5f40",
        borderWidth: 1
      }
    ]
  });

  const options = {
    plugins: {
      legend: { labels: { color: "#7e5f40" } },
      tooltip: { titleColor: "#d6b98c", bodyColor: "#d6b98c" }
    }
  };

  return (
    <>
        {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
      <div className="dashboard-page">
        <div className='navbar'>
          <div>
            <button onClick={() => navigate('/home')}>
              <img src='/assets/home.png' alt="Home" />
            </button>
          </div>
        </div>
        <h1>Mood Tracker Overview</h1>
        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(emotionTotals).length === 0 ? (
          <p>No mood data found.</p>
        ) : (
          <div className="emotion-charts">
            {Object.entries(emotionTotals).map(([emotion, percent]) => (
              <div className="emotion-chart" key={emotion}>
                <h3>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)} ({percent.toFixed(1)}%)
                </h3>
                <Pie data={generatePieData(emotion, percent)} options={options} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
