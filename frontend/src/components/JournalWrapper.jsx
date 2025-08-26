import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Journal from './Journal';

const JournalWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const onSaveComplete = () => {
    navigate('/history');
  };

  return <Journal editEntryId={id || null} onSaveComplete={onSaveComplete} />;
};

export default JournalWrapper;

