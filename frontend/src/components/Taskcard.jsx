import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomAlert from './CustomAlert';

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
      await axios.put(`/api/tasks/updatetask/${task._id}`, {
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
      completed: false
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
      {alertMsg && <CustomAlert message={alertMsg} onClose={()=>setAlertMsg('')} />}
      <div className='task-card'>
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
            <div className='sub-task-items'>
              <div style={{ display: 'flex', width: '100%' }} key={sub._id}>
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
        <Stylesheet />
      </div>
    </>
  );
};

const Stylesheet = () => {
  return <style>{`
        .task-card {
          padding: 10px;
          background-color: var(--secondary-color);
          border-radius: 5px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 300px; 
        }

        .taskcard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          flex-direction: row;
        }

        .task-icons {
          display: flex;
          align-items: center;
        }

        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
        }

        .icon-img {
          height: 20px;
          width: 30px;
        }

        .task-title {
          width: 100px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }

        .sub-tasks {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }

        .sub-task-items {
          width: 100%;
          display: flex;
          align-items: flex-start;
          margin-bottom: 5px;
        }

       .subtask-input {
  width: 100%;
  min-height: 30px;
  resize: none;
  overflow: hidden;
  padding: 8px;
  border: none;
  background-color: var(--secondary-color);
  color: var(--text);
  font-family: 'Cedarville Cursive', cursive;
  font-size: 1rem;
  line-height: 1.4;
  box-sizing: border-box;
  border-radius: 4px;
}
        .subtask-checked {
          text-decoration: line-through;
          opacity: 0.6;
        }

        .subtask-checkbox {
  appearance: none;
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border: 2px solid var(--text);
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  background-color: transparent;
  position: relative;
}

.subtask-checkbox:checked {
  background-color: var(--secondary-color);
  border-color: var(--text);
}

.subtask-checkbox:checked::after {
  content: '✓';
  color: var(--text);
  font-size: 14px;
  position: absolute;
  top: -2px;
  left: 2px;
  border-color: var(--secondary-color);
}
  @media (max-width:450px){
 .taskcard-header{
    flex-direction:column;
    gap:10px;
 }
}
      `}</style>
}
export default Taskcard
