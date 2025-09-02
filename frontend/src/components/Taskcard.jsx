import React, { lazy,Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import './TaskCard.css'
import API from '../api'
import CustomAlert from './CustomAlert';
// const CustomAlert = lazy(() => import('./CustomAlert'));

const Taskcard = ({ task, handleDeleteTask }) => {
  const [subtasks, setSubtasks] = useState(task.tasksList || []);
  const [alertMsg, setAlertMsg] = useState('');
  const syncSubtasks = async (updatedList) => {
    try {
      const validList = updatedList
        .filter(sub => sub.subtask && sub.subtask.trim() !== '')
        .map(sub => ({
          subtask: sub.subtask.trim(),
          completed: sub.completed
        }));
      await API.put(`/api/tasks/updatetask/${task._id}`, {
        tasksList: validList
      }, {
        withCredentials: true
      });
    } catch (error) {
      setAlertMsg('Failed to sync subtasks:');
    }
  };

  const addtask = async () => {
    const newSubtask = {
      subtask: '',
      completed: false,
      _id: Date.now().toString()
    };
    const updatedList = [...subtasks, newSubtask];
    setSubtasks(updatedList);
    await syncSubtasks(updatedList);
  };

  const handleSubtaskChange = async (id, value) => {
    const updatedList = subtasks.map(sub =>
      sub._id === id ? { ...sub, subtask: value } : sub
    );
    setSubtasks(updatedList);
    await syncSubtasks(updatedList);
  };

  const handleCheckbox = async (id, currentStatus) => {
    const updatedList = subtasks.map(sub =>
      sub._id === id ? { ...sub, completed: !currentStatus } : sub
    );
    setSubtasks(updatedList);
    await syncSubtasks(updatedList);
  };

  const handleBlur = async (id, value) => {
    if (value.trim() === '') {
      const updatedList = subtasks.filter(sub => sub._id !== id);
      setSubtasks(updatedList);
      await syncSubtasks(updatedList);
    }
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <>
{/*       <Suspense fallback={<div>Loading...</div>}> */}
        {alertMsg && <CustomAlert message={alertMsg} onClose={() => setAlertMsg('')} />}
{/*       </Suspense> */}
      <div className='task-card' >
        <div className='taskcard-header'>
          <div className='task-title'>{task.title}</div>
          <div className='task-icons'>
            <button className='icon-button' onClick={addtask}>
              <img className='icon-img' src='/assets/add.png' alt="Add" />
            </button>
            <button onClick={handleDeleteTask} className='icon-button'>
              <img className='icon-img' src='/assets/delete.png' alt="Delete" />
            </button>
          </div>
        </div>
        <div className='sub-tasks' key={task._id}>
          {subtasks.map((sub) => (
            <div className='sub-task-items' key={sub._id}>
              <div style={{ display: 'flex', width: '100%' }}>
                <input
                  type='checkbox'
                  checked={sub.completed}
                  onChange={() => handleCheckbox(sub._id, sub.completed)}
                  className='subtask-checkbox'
                />
                <textarea
                  className={`subtask-input ${sub.completed ? 'subtask-checked' : ''}`}
                  value={sub.subtask}
                  onChange={(e) => handleSubtaskChange(sub._id, e.target.value)}
                  onInput={autoResize}
                  onBlur={(e) => handleBlur(sub._id, e.target.value)}
                  placeholder="Enter sub task"
                  autoFocus
                  rows={1}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(Taskcard)
