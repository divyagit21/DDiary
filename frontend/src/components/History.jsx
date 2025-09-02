import React, { lazy,Suspense, useEffect, useState } from "react";
import JournalCard from "./JournalCard";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext";
import './History.css'
import API from '../api'
import ConfirmationAlert from './ConfirmationAlert';
import CustomAlert from './CustomAlert';


const History = ({ onEditEntry }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)


  useEffect(() => {
    const getJournals = async () => {
      try {
        const response = await API.get(
          `/api/journal/getAllJournals/${user.id}`
        );
        setEntries(response.data.journals);
      } catch (error) {
        setMsg("Failed to fetch journals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getJournals();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteAnalysis = await API.delete(`/api/journal/deleteJournal/${deleteId}`,
        )
      setEntries(prevEntries => prevEntries.filter(entry => entry._id !== deleteId));
      setMsg("Journal entry deleted successfully!");
    }
    catch (err) {
      setMsg("Failed to delete journal entry. Please try again later.");
    }
    finally {
      setIsOpen(false);
      setDeleteId(null);
    }
  };


  async function onEdit(editEntryId) {
    navigate(`/journal/${editEntryId}`);
  }

  return (
    <>
        {isOpen && <ConfirmationAlert isOpen={isOpen} onClose={() => { setIsOpen(false); setDeleteId(null) }} onConfirm={confirmDelete} message={"Are you sure you want to delete this journal?"} type={"Delete"} />}
        {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
      <div className="history-page">
        <div className='navbar'>
          <div><button onClick={() => navigate('/home')}>
            <img src='/assets/home.png' />
          </button>
          </div>
        </div>
        <h1 className="history-heading">Journal History</h1>
        <div className="history-list">
          {loading ? (
            <p>Loading...</p>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <JournalCard
                key={entry._id}
                id={entry._id}
                title={entry.title}
                date={entry.date}
                entry={entry.journalNote}
                analyzed={entry.analyzed}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No journal entries found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
