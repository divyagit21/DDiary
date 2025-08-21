import React, { useState, useEffect } from 'react'
import Taskcard from './Taskcard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CustomAlert from './CustomAlert';
import ConfirmationAlert from './ConfirmationAlert'
import { useAuth } from './AuthContext';

const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, settaskName] = useState('')
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setloding] = useState(true);
  const {user}= useAuth();

  function handleDeleteTask(id) {
    setDeleteId(id);
    setIsOpen(true);
  }

  async function confirmDelete() {
    try {
      setTasks(prev => {
        const updatedTasks = prev.filter(task => task.id !== deleteId);
        return updatedTasks;
      });
      const deleteTask = await axios.delete(`/api/tasks/deletetask/${deleteId}`, {
        withCredentials: true
      })
    }
    catch (err) {

    }
    finally {
      setDeleteId(null);
      setIsOpen(false);
    }
  }
  const showAlert = (msg) => {
    setAlertMsg(msg);
  };

  async function handleAdd() {
    if (!taskName.trim()) {
      showAlert("Please write task name...");
      return;
    }

    const newtask = {
      title: taskName
    }
    const res = await axios.post('/api/tasks/addtask', newtask, {
      withCredentials: true
    })
    setTasks(prev => {
      const updatedTasks = [...prev, newtask];
      return updatedTasks;
    });

    settaskName('');
  }


  useEffect(() => {
    const storedTasks = async () => {
      try {
        const getTask = await axios.get(`api/tasks/getalltasks/${user.id}`, {
          withCredentials: true
        })
        setTasks(getTask.data);
      }
      catch (error) {
        showAlert('Failed to fetch tasks');
      }
      finally {
        setloding(false);
      }
    }
    storedTasks();
  }, [tasks]);

  return (
    <>
      {alertMsg && <CustomAlert message={alertMsg} onClose={() => setAlertMsg('')} />}
      <ConfirmationAlert isOpen={isOpen} onClose={() => { setIsOpen(false); setDeleteId(null) }} onConfirm={confirmDelete} message={"Are you sure you want to delete this Task?"} type={"Delete"} />

      <div className='task-page'>
        <div className='navbar'>
          <div><button onClick={() => navigate('/home')}>
            <img src='/assets/home.png' />
          </button>
          </div>
        </div>
        <h1 className="tasks-heading">Tasks</h1>
        <div className='task-header'>
          <div>
            <input className='task-name' placeholder='Enter Task title...' value={taskName} onChange={(e) => settaskName(e.target.value)} />
          </div>
          <div>
            <button className='task-add' onClick={handleAdd}>Add</button>
          </div>
        </div>

        <div className='tasks-list'>
          {loading ? <div>Loading...</div> : tasks.length > 0 ? tasks.map((task) => (
            <Taskcard key={task._id} task={task} handleDeleteTask={() => handleDeleteTask(task._id)} />
          )) : <div>No tasks available</div>}
        </div>
        <Stylesheet />
      </div>
    </>
  )
}
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

        .tasks-heading {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .task-page {
        font-family: 'Cedarville Cursive', cursive;
        color: var(--text);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        }

        .task-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .task-name {
          background-color: var(--secondary-color);
          border: none;
          padding: 10px 15px;
          min-width: 250px;
          border-radius: 5px;
          font-size: 1.2rem;
          font-family: 'Cedarville Cursive', cursive;
          color: var(--text);
          flex: 1 1 250px;
        }

        .task-add {
          background-color: var(--button-color);
          border: none;
          padding: 10px 15px;
          min-width: 100px;
          border-radius: 5px;
          font-size: 1.2rem;
          color: var(--bg-parchment);
          font-family: 'Cedarville Cursive', cursive;
          flex-shrink: 0;
        }

        .task-name::placeholder {
          color: var(--text);
          opacity: 1;
        }

        .tasks-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start; 
          gap: 1rem;
          padding: 0 1rem;
        }

        @media (max-width: 768px) {
          .task-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.8rem;
          }

          .task-name,
          .task-add {
            width: 90%;
            font-size: 1rem;
          }

          .tasks-heading {
            font-size: 2rem;
          }
        }

        @media (max-width: 485px) {
          .task-page {
            padding: 0.5rem;
          }

          .navbar{
              display:flex;
              align-items:center;
              justify-content:flex-start;
              width:100%;
              top:25px;
          }
          img{
              height:2rem;
              width:2rem;
          }
          .tasks-heading {
            font-size: 1.5rem;
          }

          .task-name,
          .task-add {
            font-size: 0.95rem;
          }
        }
      `}</style>
}
export default Tasks
