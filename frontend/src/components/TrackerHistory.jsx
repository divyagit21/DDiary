import React, { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import MoodTrackerCard from "./MoodTrackerCard";
import { useNavigate } from "react-router-dom";
import './TrackerHistory.css';
import API from '../api'
import ConfirmationAlert from './ConfirmationAlert';
import CustomAlert from './CustomAlert';
// const CustomAlert = lazy(() => import('./CustomAlert'));
// const ConfirmationAlert = lazy(() => import('./ConfirmationAlert'));

const TrackerHistory = ({ onEditMood }) => {
    const { user } = useAuth();
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchMoods = async () => {
            try {
                const response = await API.get('/api/moodTracker/getAllMoods', {
                    withCredentials: true,
                });
                setMoods(response.data.moods || []);
            } catch (err) {
                setMsg("Failed to fetch mood history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMoods();
    }, [user]);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const deleted = await API.delete(
                `/api/moodTracker/deleteMood/${deleteId}`,
                { withCredentials: true }
            );

            setMoods((prev) => prev.filter((m) => m._id !== deleteId));
            setMsg("Mood entry deleted successfully!");

            const deletedDate = deleted.data.deletedDate;
            const response = await API.get("/api/journal/checkToday", {
                params: { date: deletedDate },
                withCredentials: true,
            });

            if (response.data.exists && response.data.journal) {
                await API.put(
                    `/api/journal/analyze/${response.data.journal._id}`,
                    { analyzed: false },
                    { withCredentials: true }
                );
            }

        } catch (err) {
            console.error(err);
            setMsg("Failed to delete mood entry. Please try again later.");
        } finally {
            setIsOpen(false);
            setDeleteId(null);
        }
    };

    const handleMoodUpdated = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/moodTracker/getAllMoods', {
                withCredentials: true,
            });
            setMoods(response.data.moods || []);
        } catch (err) {
            setMsg("Failed to refresh mood history.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
{/*             <Suspense fallback={<div>Loading...</div>}> */}
                {isOpen && (
                    <ConfirmationAlert
                        isOpen={isOpen}
                        onClose={() => {
                            setIsOpen(false);
                            setDeleteId(null);
                        }}
                        onConfirm={confirmDelete}
                        message={"Are you sure you want to delete this mood entry?"}
                        type={"Delete"}
                    />
                )}
                {msg && <CustomAlert message={msg} onClose={() => setMsg("")} />}
{/*             </Suspense> */}

            <div className="tracker-history-page">
                <div className="navbar">
                    <div>
                        <button onClick={() => navigate('/home')}>
                            <img src="/assets/home.png" alt="Home" />
                        </button>
                    </div>
                </div>

                <h1 className="history-heading">Mood Tracker History</h1>
                <div className="history-list">
                    {loading ? (
                        <p>Loading...</p>
                    ) : moods.length > 0 ? (
                        moods.map((mood) => (
                            <MoodTrackerCard
                                key={mood._id}
                                moodId={mood._id}
                                date={mood.date}
                                handleDelete={handleDelete}
                                responses={mood.responses}
                                onMoodUpdated={handleMoodUpdated}
                            />
                        ))
                    ) : (
                        <p>No mood entries found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrackerHistory;
