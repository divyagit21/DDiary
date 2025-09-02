import React, {lazy,Suspense, useState, useEffect, useCallback } from "react";
import QuestionCard from "./QuestionCard";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import API from '../api'
import CustomAlert from './CustomAlert';

const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
};

const questions = [
    "How happy do you feel today?",
    "How joyful are you feeling?",
    "How content are you today?",
    "How relaxed are you?",
    "How loved do you feel?",
    "How valued do you feel?",
    "How proud are you of yourself today?",
    "How grateful do you feel?",
    "How productive are you today?",
    "How motivated are you?",
    "How alive or energetic do you feel?",
    "How excited are you today?",
    "How sad do you feel?",
    "How lonely do you feel?",
    "How angry are you today?",
    "How anxious or worried are you?",
    "How tired do you feel?",
    "How sick or unwell are you?",
    "How bored are you today?",
    "How lazy or unmotivated are you?"
];

const MoodTracker = ({ editMoodId, onSaveComplete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [responses, setResponses] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setDate(formatDate(new Date()));
    }, []);

    useEffect(() => {
        if (!editMoodId && date) {
            const timeOut = setTimeout(() => checkTodayMood(date), 400);
            return () => clearTimeout(timeOut);
        }
    }, [date, editMoodId]);

    const checkTodayMood = async (dateToCheck) => {
        try {
            const encodedDate = encodeURIComponent(dateToCheck);
            const res = await API.get(`/api/moodTracker/getMoodByDate/${encodedDate}`);

            if (res.status === 200 && res.data.mood) {
                setMsg("A mood entry already exists for today.To edit, use the history page.");
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!editMoodId) {
            setLoading(false);
            return;
        }

        const fetchMood = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/api/moodTracker/getMoodById/${editMoodId}`);
                if (res.data.mood) {
                    setResponses(res.data.mood.responses);
                    setDate(res.data.mood.date); 
                    setTitle(res.data.mood.title || "");
                }
            } catch (err) {
                setMsg("Failed to load mood entry.");
            } finally {
                setLoading(false);
            }
        };

        fetchMood();
    }, [editMoodId]);

    const handleChangeCallback = useCallback(
        (question, val) => {
            const key = question.split(" ")[1].toLowerCase();
            if (responses[key] === val) return;
            setResponses((prev) => ({ ...prev, [key]: val }));
        },
        [responses]
    );

    const handleSubmit = async () => {
        setSaving(true);
        const formattedDate = formatDate(date);
        try {
            const hasSelectedMood = Object.values(responses).some(val => val > 0);

            if (!hasSelectedMood) {
                setMsg("Please select at least one mood before saving.");
                return;
            }

            if (editMoodId) {
                await API.put(
                    `/api/moodTracker/updateMood/${editMoodId}`,
                    { responses, date: formattedDate }
                );
                setMsg("Mood updated successfully!");
            } else {
                await API.post(
                    `/api/moodTracker/addMood`,
                    { userId: user.id, responses, date: formattedDate }
                );

                try {
                    const journal = await API.get('/api/journal/checkToday', {
                        params: { date: formattedDate },
                    });

                    if (journal.data.journal?._id) {
                        await API.put(`/api/journal/analyze/${journal.data.journal._id}`, { analyzed: true });
                    }
                } catch (journalErr) {
                    setMsg("No journal to analyze for this date.");
                }

                setMsg("Mood saved successfully!");
            }

            onSaveComplete && onSaveComplete();
            navigate('/trackerHistory')
        } catch (err) {
            setMsg("Failed to add.Try to check if date already exists.");
        }
        finally {
            setSaving(false);
        }
    };


    return (
        <>
            {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
            <div className="mood-tracker-page">
                <div className="navbar">
                    <button onClick={() => navigate('/home')}>
                        <img src="/assets/home.png" alt="Home" />
                    </button>
                </div>

                <h1 className="tracker-heading">Mood Tracker</h1>

                <div className="mood-header">
                    <input
                        className="mood-title"
                        placeholder="Title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="mood-date"
                        placeholder="mm/dd/yyyy"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="questions-list">
                        {questions.map((q, idx) => {
                            const key = q.split(" ")[1].toLowerCase();
                            return (
                                <QuestionCard
                                    key={idx}
                                    question={q}
                                    value={responses[key] || 0}
                                    onChange={(val) => handleChangeCallback(q, val)}
                                />
                            );
                        })}
                    </div>
                )}

                <div className="mood-tracker-footer">
                    <button className="submit-btn" onClick={() => navigate("/trackerHistory")}>
                        Mood Tracker History
                    </button>
                    <button className="submit-btn" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : "Save Mood"}
                    </button>
                </div>
            </div>

            <Stylesheet />
        </>
    );
};

const Stylesheet = () => (
    <style>{`
    
 .navbar {
     display: flex;
     justify-content: flex-start;
     align-items: center;
     width: 100%;
     position:sticky;
     top:0;
 }

.mood-title::placeholder{
    color: var(--text);
    opacity: 1;
}

 button {
     background: none;
     border: none;
 }

 .mood-header {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 1rem;
     width: 100%;
     max-width: 900px;
     margin-bottom: 1rem;
 }

 .mood-title,
 .mood-date {
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

 .mood-tracker-page {
     display: flex;
     flex-direction: column;
     align-items: center;
     padding: 1rem;
     font-family: 'Cedarville Cursive', cursive;
     color: var(--text);
 }

 .mood-tracker-footer {
     display: flex;
     justify-content: center;
     width: 100%;
     gap: 5%;
 }

 .tracker-heading {
     font-size: 2.5rem;
     margin-bottom: 2rem;
     text-align: center;
 }

 .questions-list {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 1rem;
     width: 100%;
     max-width: 1000px;
 }

 .question-card {
     flex: 1 1 45%;
     max-width: 45%;
 }

 .submit-btn {
     margin-top: 1.5rem;
     padding: 0.7rem 1.5rem;
     font-size: 1rem;
     border-radius: 8px;
     border: none;
     background-color: var(--button-color);
     color: var(--bg-parchment);
     cursor: pointer;
     transition: 0.2s;
     font-family: 'Cedarville Cursive', cursive;
 }

 .submit-btn:hover {
     opacity: 0.8;
 }

 @media (max-width:768px) {
     .question-card {
         flex: 1 1 100%;
         max-width: 100%;
     }
 }
  `}</style>
);

export default MoodTracker;

