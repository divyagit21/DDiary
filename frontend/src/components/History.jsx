import React, { useEffect, useState } from "react";
import JournalCard from "./JournalCard";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext";
import CustomAlert from "./CustomAlert";
import ConfirmationAlert from './ConfirmationAlert';

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
        const response = await axios.get(
          `/api/journal/getAllJournals/${user.id}`,
          { withCredentials: true }
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
      const deleteAnalysis = await axios.delete(`/api/journal/deleteJournal/${deleteId}`,
        {
          withCredentials: true
        })
      setEntries(prevEntries => prevEntries.filter(entry => entry._id !== deleteId));
    }
    catch (err) {
      setMsg("Failed to delete journal entry. Please try again later.");
    }
    finally {
      setIsOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <ConfirmationAlert isOpen={isOpen} onClose={() => { setIsOpen(false); setDeleteId(null) }} onConfirm={confirmDelete} message={"Are you sure you want to delete this journal?"} type={"Delete"} />
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
                analysis={entry.analysis}
                onEdit={onEditEntry}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No journal entries found.</p>
          )}
        </div>
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
        .history-page {
          font-family: 'Cedarville Cursive', cursive;
          color: var(--text);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .history-heading {
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }

        .history-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          width: 100%;
          max-width: 1200px;
        }

        @media (max-width: 600px) {
          .history-heading {
            font-size: 2rem;
          }
        }
      `}</style>
}
export default History;
