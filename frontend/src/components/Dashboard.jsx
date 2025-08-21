import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext";
import CustomAlert from "./CustomAlert";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [emotionTotals, setEmotionTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const {user} =useAuth()

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        const response = await axios.get(`/api/journal/getAllJournals/${user.id}`, {
          withCredentials: true
        });
        const journals = response.data.journals || [];

        const totals = {};
        const counts = {};

        journals.forEach((entry) => {
          if (entry.analyzed && entry.analysis) {
            const analysis = parseAnalysisString(entry.analysis);
            Object.entries(analysis).forEach(([emotion, score]) => {
              totals[emotion] = (totals[emotion] ?? 0) + score;
              counts[emotion] = (counts[emotion] ?? 0) + 1;
            });
          }
        });

        const cumulativePercentage = {};
        for (const emotion in totals) {
          cumulativePercentage[emotion] = totals[emotion] / counts[emotion];
        }

        setEmotionTotals(cumulativePercentage);
      } catch (error) {
        setMsg("Error fetching journals. Please try again later.")
      }
      finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, []);

  const parseAnalysisString = (str) => {
    const result = {};
    const cleaned = str.replace(/^Top Emotions:\s*/i, "");
    const parts = cleaned.split(",");
    parts.forEach((part) => {
      const [name, p] = part.trim().split(" ")
      if (!name || !p) return;
      const percent = p.replace("%)", "").replace("(", "");
      if (name && percent) {
        result[name.trim().toLowerCase()] = parseFloat(percent);
      }
    });

    return result;
  };


  const generatePieData = (emotion, percent) => ({
    labels: [emotion, "Other"],
    datasets: [
      {
        label: `${emotion} Chart`,
        data: [percent, 100 - percent],
        backgroundColor: [
          "#7e5f40",
          "#d6b98c"
        ],
        hoverBackgroundColor: [
          "#7e5f40",
          "#d6b98c"
        ],
        borderColor: "#7e5f40",
        borderWidth: 1
      }
    ]
  });
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#7e5f40"
        }
      },
      tooltip: {
        titleColor: "#d6b98c",
        bodyColor: "#d6b98c"
      }
    }
  };

  return (
    <>
    {msg && <CustomAlert message={msg} onClose={()=>setMsg('')} />}
    <div className="dashboard-page">
      <div className='navbar'>
        <div><button onClick={() => navigate('/home')}>
          <img src='/assets/home.png' />
        </button>
        </div>
      </div>
      <h1>Emotion Overview</h1>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(emotionTotals).length === 0 ? (
        <p>No analyzed data found.</p>
      ) : (
        <div className="emotion-charts">
          {Object.entries(emotionTotals).map(([emotion, percent]) => (
            <div className="emotion-chart" key={emotion}>
              <h3>
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)} (
                {percent.toFixed(1)}%)
              </h3>
              <Pie data={generatePieData(emotion, percent)} options={options} />
            </div>
          ))}
        </div>
      )}
      <Stylesheet />
    </div>
    </>
  );
};

const Stylesheet = () => {
  return <style>{`
        .navbar{
          display:flex;
          justify-content:flex-start;
          align-items:center;
          width:100%;
        }
         button{
           background:none;
           border:none;
        }
        .dashboard-page {
          font-family: 'Cedarville Cursive', cursive;
          padding: 1rem;
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-size: 2.2rem;
          margin-bottom: 2rem;
          color: var(--secondary-text);
        }

        .emotion-charts {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          color: var(--secondary-text);
          width: 100%;
          max-width: 920px;
        }

        .emotion-chart {
          width: 250px;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
        }
        .emotion-chart h3 {
          margin-bottom: 0.5rem;
        }
      `}</style>
}

export default Dashboard;
