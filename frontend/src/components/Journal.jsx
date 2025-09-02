import { lazy, Suspense, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Journal.css'
import API from '../api'
import CustomAlert from './CustomAlert';
// const CustomAlert = lazy(() => import('./CustomAlert'));

const Journal = ({ editEntryId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [entry, setEntry] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const textareaRef = useRef();
  const [alertMsg, setAlertMsg] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [journalExists, setJournalExists] = useState(false);
  const [moodExists, setMoodExists] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editEntryId) {
      setLoading(false);
      return;
    }

    async function fetchEntry() {
      try {
        const response = await API.get(`/api/journal/getJournal/${editEntryId}`);
        const data = response.data.journal;
        setTitle(data.title);
        setDate(data.date);
        setEntry(data.journalNote);
      } catch (error) {
        showAlert("Error fetching journal entry.");
      } finally {
        setLoading(false);
      }
    }
    fetchEntry();
  }, [editEntryId]);

  useEffect(() => {
    if (editEntryId) return;

    const today = new Date();
    const formattedDate = formatDate(today);
    setDate(formattedDate);
    setLoading(false);
  }, [editEntryId]);

  useEffect(() => {
    if (!date) return;
    checkMoodTrackerExists(date);
    checkIfJournalExists(date).then((exists) => {
      if (exists && !editEntryId) {
        showAlert("Journal for today exists. Try editing it instead.");
      }
      setJournalExists(exists);
    });
  }, [date, editEntryId]);

  const showAlert = (msg) => setAlertMsg(msg);

  const formatDate = (dateObj) => {
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const checkMoodTrackerExists = async (dateToCheck) => {
    try {
      const encodedDate = encodeURIComponent(dateToCheck);
      const res = await API.get(`/api/moodTracker/getMoodByDate/${encodedDate}`);
      if (res.status === 200 && res.data.mood) {
        setAnalyzed(res.data.exists ?? true);
      } else {
        setAnalyzed(false);
      }
    } catch {
      setAnalyzed(false);
    }
  };

  const checkIfJournalExists = async (dateToCheck) => {
    try {
      const response = await API.get("/api/journal/checkToday", {
        params: { date: dateToCheck },
      });
      return response.data.exists || false;
    } catch {
      return false;
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleAdd = async () => {
    if (!entry.trim()) {
      showAlert("Please write journal entry...");
      return;
    }
    if (journalExists) {
      showAlert("Journal for today exists. Try editing it instead.");
      return;
    }
    setIsAdding(true);
    try {
      await API.post(
        "/api/journal/addJournal",
        { title, date, journalNote: entry, analyzed },

      );
      navigate("/history");
    } catch {
      showAlert("Failed to add journal entry.");
    }
    finally {
      setIsAdding(false);
    }
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      showAlert("Please write journal entry...");
      return;
    }

    if (!editEntryId) return;
    setIsSaving(true);
    try {
      await API.put(
        `/api/journal/updateJournal/${editEntryId}`,
        { title, date, journalNote: entry, analyzed },
      );
      showAlert("Journal entry updated successfully.");
      navigate("/history");
    } catch {
      showAlert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
{/*       <Suspense fallback={<div>Loading...</div>}> */}
        {alertMsg && <CustomAlert message={alertMsg} onClose={() => setAlertMsg("")} />}
{/*       </Suspense> */}
      <div className="journal-page">
        <div className="navbar">
          <div>
            <button onClick={() => navigate("/home")}>
              <img src="/assets/home.png" alt="Home" />
            </button>
          </div>
        </div>

        <h1 className="journal-heading">{editEntryId ? "Edit Journal Entry" : "New Journal Entry"}</h1>

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
            rows={5}
          />
        </div>

        <div className="journal-footer">
          {editEntryId ? (
            <button onClick={handleSave} className="journal-analyze" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/history')} className="journal-analyze"   >
                Journal History
              </button>
              <button onClick={handleAdd} className="journal-analyze" disabled={isAdding}>
                {isAdding ? "Adding..." : "Add"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Journal;
