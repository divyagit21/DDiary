import { useState, useRef, useEffect } from "react";
import axios from 'axios'
import CustomAlert from './CustomAlert';

import { useNavigate } from "react-router-dom";
const Journal = ({ editEntryId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [entry, setEntry] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const textareaRef = useRef();
  const [alertMsg, setAlertMsg] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [journalExists, setJournalExists] = useState(false);

  useEffect(() => {
    if (editEntryId) {
      async function Editing() {
        try {
          const response = await axios.get(`/api/journal/getJournal/${editEntryId}`, {
            withCredentials: true
          });
          const data = response.data.journal;
          setTitle(data.title);
          setDate(data.date);
          setEntry(data.journalNote);
        } catch (error) {
          showAlert("Error fetching journal entry.");
          return;
        }
      }
      Editing();
    }
  }, [editEntryId]);

  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    setDate(formattedDate);
  }, [])

  const showAlert = (msg) => {
    setAlertMsg(msg);
  };

  useEffect(() => {
    if (date) {
      checkIfJournalExists(date);
    }
  }, [date]);

  const checkIfJournalExists = async (dateToCheck) => {
    try {
      const response = await axios.get('/api/journal/checkToday', {
        params: { date: dateToCheck },
        withCredentials: true
      });
      setJournalExists(response.data.exists);
      return response.data.exists;
    } catch (err) {
      setJournalExists(false);
      return false;
    }
  };

  function autoResizeTextarea() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  const handleAdd = async () => {
    if (!entry.trim()) {
      showAlert("Please write journal entry...");
      return;
    }

    const alreadyExists = await checkIfJournalExists(date);
    if (alreadyExists) {
      showAlert('Journal for today exists.Try editing it instead.')
      return;
    }

    var newEntry = {
      title,
      date,
      journalNote: entry,
      analysis: analysisResult,
    };

    if (analysisResult) {
      newEntry.analyzed = true;
    }

    try {
      const addingEntry = await axios.post('/api/journal/addJournal', newEntry, {
        withCredentials: true
      });
      navigate('/history');
    } catch (error) {
      showAlert("Failed to add journal entry.");
    }
  };

  const handleSave = async () => {
    const isEntryValid = () => entry.trim().length > 0;
    if (!isEntryValid())
      return showAlert("Please write journal entry...");
    try {
      if (editEntryId) {
        await axios.put(`/api/journal/updateJournal/${editEntryId}`, {
          title,
          date,
          journalNote: entry,
          analysis: analysisResult,
        }, { withCredentials: true });

        if (analysisResult) {
          await axios.put(`/api/journal/analyze/${editEntryId}`, {
            analysis: analysisResult
          }, { withCredentials: true });
        }
      } else {
        showAlert("Analysis complete not saved yet.");
      }

      navigate('/history');
    } catch (err) {
      showAlert("Failed to save.");
    }
  };

  const handleAnalyze = async () => {
    if (!entry.trim()) return alert("Write something to analyze.");
    try {
      setIsAnalyzing(true);
      const aiRes = await axios.post("http://localhost:5001/api/ai/analyze", { text: entry }, { withCredentials: true });
      const scores = aiRes.data.all_scores;
      if (!scores?.length) return setAnalysisResult("No emotion data returned.");
      const topEmotions = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(e => `${e.label} (${(e.score * 100).toFixed(1)}%)`)
        .join(", ");
      const analysisText = `Top Emotions: ${topEmotions}`;
      setAnalysisResult(analysisText);
      showAlert('Analyzed but not saved')
    } catch (err) {
      setAnalysisResult("Analysis failed – check console.");
    }
    finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {alertMsg && <CustomAlert message={alertMsg} onClose={() => setAlertMsg('')} />}

      <div className="journal-page">
        <div className='navbar'>
          <div><button onClick={() => navigate('/home')}>
            <img src='/assets/home.png' />
          </button>
          </div>
        </div>
        <h1 className="journal-heading">{editEntryId
          ? "Edit Journal Entry" : "New Journal Entry"}</h1>
        <div className="journal-header">
          <input
            className="journal-title"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="journal-date"
            placeholder="mm/dd/yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}

          />
        </div>

        <div className="journal-body">
          <textarea
            ref={textareaRef}
            className="journal-entry"
            placeholder="Write your journal entry here..."
            value={entry}
            onChange={(e) => {
              setEntry(e.target.value);
              autoResizeTextarea();
            }}
          />
        </div>

        <div className="journal-footer">
          {editEntryId ? <button onClick={handleSave} className="journal-analyze" style={{ marginRight: "1rem" }} disabled={isAnalyzing}>
            Save
          </button> : <button onClick={handleAdd} className="journal-analyze" style={{ marginRight: "1rem" }} disabled={isAnalyzing}>
            Add
          </button>}

          <button onClick={handleAnalyze} className="journal-analyze" disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {analysisResult && (
          <div
            style={{
              marginTop: "1rem",
              fontSize: "1.2rem",
              fontFamily: "'Cedarville Cursive', cursive",
              color: "var(--text)",
            }}
          >
            {analysisResult}
          </div>
        )}
        <Stylesheet />
      </div>
    </>
  );
};

const Stylesheet = () => {
  return (
    <style>{`
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
      .journal-page {
        font-family: 'Cedarville Cursive', cursive;
        color: var(--text);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }

      .journal-heading {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1rem;
      }

      .journal-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        width: 100%;
        max-width: 900px;
        margin-bottom: 1rem;
      }

      .journal-title,
      .journal-date {
        background-color: var(--secondary-color);
        border: none;
        padding: 10px;
        border-radius: 5px;
        font-size: 1.1rem;
        color: var(--text);
        font-family: 'Cedarville Cursive', cursive;
        flex: 1 1 200px;
        min-width: 150px;
      }

      .journal-body {
        margin-top: 1rem;
        margin-bottom: 2rem;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .journal-entry {
        width: 100%;
        max-width: 900px;
        min-height: 300px;
        background-color: var(--secondary-color);
        border: none;
        padding: 15px;
        border-radius: 5px;
        font-size: 1.1rem;
        font-family: 'Cedarville Cursive', cursive;
        color: var(--text);
        resize: vertical;
        outline: none;
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color) var(--text);
      }

      .journal-footer {
        display: flex;
        justify-content: center;
        width: 100%;
        gap:5%;
      }

      .journal-analyze {
        background-color: var(--button-color);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1.3rem;
        color: var(--bg-parchment);
        font-family: 'Cedarville Cursive', cursive;
        cursor: pointer;
      }

      .journal-entry::-webkit-scrollbar {
        width: 12px;
      }

      .journal-entry::-webkit-scrollbar-track {
        background: var(--text);
      }

      .journal-entry::-webkit-scrollbar-thumb {
        background-color: var(--secondary-color);
        border-radius: 10px;
        width: 8px;
      }

      .journal-title::placeholder,
      .journal-date::placeholder,
      .journal-entry::placeholder {
        color: var(--text);
        opacity: 1;
      }

      @media (max-width: 768px) {
        .journal-heading {
          font-size: 2rem;
        }

        .journal-title,
        .journal-date {
          font-size: 1rem;
        }

        .journal-entry {
          font-size: 1rem;
        }

        .journal-analyze {
          font-size: 1.1rem;
          width: 100%;
          max-width: 200px;
        }
      }

      @media (max-width: 480px) {
        .journal-heading {
          font-size: 1.7rem;
        }

        .journal-title,
        .journal-date {
          width: 100%;
          font-size: 0.95rem;
        }

        .journal-entry {
          font-size: 0.95rem;
        }

        .journal-analyze {
          font-size: 1rem;
          padding: 10px;
        }
      }
    `}</style>
  );
};


export default Journal;

