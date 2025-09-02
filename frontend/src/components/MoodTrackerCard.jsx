import React, { lazy,Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from './CustomAlert';
// const CustomAlert = lazy(() => import('./CustomAlert'));
const MoodTrackerCard = ({ moodId, date, responses, handleDelete, onMoodUpdated }) => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const nonZeroResponses = Object.entries(responses).filter(([_, val]) => val > 0);
  const maxVisible = 2;
  const visibleResponses = nonZeroResponses.slice(0, maxVisible);
  const hiddenCount = nonZeroResponses.length - visibleResponses.length;
  return (
    <>
{/*       <Suspense fallback={<div>Loading...</div>}> */}
        {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
{/*       </Suspense> */}
      <div className="mood-card">
        <div className="mood-date">{date}</div>
        <div className="mood-responses">
          {visibleResponses.map(([q, val], idx) => (
            <div key={idx} className="mood-response" title={`${q}: ${val}`}>
              <strong>{q}</strong>: {val}
            </div>
          ))}
          {hiddenCount > 0 && <div className="mood-response">... and {hiddenCount} more</div>}
          {nonZeroResponses.length === 0 && (
            <div className="mood-response">No recorded responses</div>
          )}
        </div>
        <div className="card-actions">
          <button onClick={() => navigate(`/tracker/${moodId}`)}>Edit</button>
          <button onClick={() => handleDelete(moodId)}>Delete</button>
        </div>
        <Stylesheet />
      </div>
    </>
  );
};

const Stylesheet = () => (
  <style>{`
    .mood-card {
      background-color: var(--secondary-color);
          color: var(--text);
          border-radius: 8px;
          padding: 1rem;
          width: 200px;
          height: 120px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
    }
    .mood-date {
      font-weight: bold;
      font-size: 0.9rem;
    }
    .mood-responses {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 2px;
      overflow: hidden;
    }
    .mood-response {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .card-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        .card-actions button {
          font-size: 0.8rem;
          font-family: 'Cedarville Cursive', cursive;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: var(--button-color);
          color: var(--bg-parchment);
        }

        .card-actions button:hover {
          opacity: 0.85;
        }
        
  `}</style>
);

export default React.memo(MoodTrackerCard);

