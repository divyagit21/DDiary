import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MoodTracker from './MoodTracker';

const MoodTrackerWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const onSaveComplete = () => {
    navigate('/trackerHistory');
  };

  return <MoodTracker editMoodId={id || null} onSaveComplete={onSaveComplete} />;
};

export default MoodTrackerWrapper;
