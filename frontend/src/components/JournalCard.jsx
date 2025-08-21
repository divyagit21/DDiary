import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomAlert from "./CustomAlert";

const JournalCard = ({ id, title, date, entry, analyzed, analysis, onEdit, onDelete}) => {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  async function onEdit(editEntryId) {
    navigate(`/journal/${editEntryId}`);
  }

  const previewLines = entry.split("\n").slice(0, 2).join("\n");

  return (
    <div className="journal-card">
      {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
      {title && <h3 className="card-title">{title}</h3>}
      <p className="card-date">{date}</p>
      <div className="card-status">
        Status:{" "}
        <span className={analyzed ? "status-analyzed" : "status-not-analyzed"}>
          {analyzed ? "Analyzed" : "Not Analyzed"}
        </span>
      </div>
      <pre className="card-preview">{previewLines}</pre>

      {analyzed && analysis && (
        <div className="card-analysis">{analysis}</div>
      )}

      <div className="card-actions">
        <button onClick={() => onEdit(id)}>Edit</button>
        <button onClick={()=>onDelete(id)}>Delete</button>
      </div>
      <Stylesheet />
    </div>
  );
};

const Stylesheet = () => {
  return <style>{`
        .journal-card {
          background-color: var(--secondary-color);
          color: var(--text);
          border-radius: 8px;
          padding: 1rem;
          width: 200px;
          height: 200px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-title {
          font-size: 1.1rem;
          margin: 0 0 0.2rem;
        }

        .card-date {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }

        .card-preview {
          font-size: 0.85rem;
          font-family: 'Cedarville Cursive', cursive;
          flex-grow: 1;
          margin-bottom: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-status {
          font-size: 0.85rem;
        }

        .status-analyzed {
          color: green;
          font-weight: bold;
        }

        .status-not-analyzed {
          color: red;
          font-weight: bold;
        }

        .card-analysis {
          font-size: 0.75rem;
          font-style: italic;
          margin-top: 0.3rem;
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
        
        @media (max-width:300){
            .journal-card{
              height: auto;
            }
        }
      `}</style>
}
export default JournalCard;
