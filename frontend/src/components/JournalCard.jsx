import React, { lazy,Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './JournalCard.css'
import CustomAlert from './CustomAlert';

const JournalCard = ({ id, title, date, entry, analyzed, onEdit, onDelete }) => {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [moodExists, setMoodExists] = useState(false);

  const previewLines = entry.split("\n").slice(0, 2).join("\n");

  return (
    <>
        {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
      <div className="journal-card">
        {title && <h3 className="card-title">{title}</h3>}
        <p className="card-date">{date}</p>
        <div className="card-status">
          Mood Tracker:{" "}
          <span className={analyzed ? "status-analyzed" : "status-not-analyzed"}>
            {analyzed ? "Analyzed" : "Not Analyzed"}
          </span>
        </div>
        <pre className="card-preview">{previewLines}</pre>

        <div className="card-actions">
          <button onClick={() => onEdit(id)}>Edit</button>
          <button onClick={() => onDelete(id)}>Delete</button>
        </div>
      </div>
    </>
  );
};

export default React.memo(JournalCard);


