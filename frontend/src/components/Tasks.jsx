import React, { lazy,Suspense, useState, useEffect } from 'react'
import Taskcard from './Taskcard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';
import './Tasks.css'
import API from '../api'
import ConfirmationAlert from './ConfirmationAlert';
import CustomAlert from './CustomAlert';
// const CustomAlert = lazy(() => import('./CustomAlert'));
// const ConfirmationAlert = lazy(() => import('./ConfirmationAlert'));

const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, settaskName] = useState('')
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setloding] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const storedTasks = async () => {
      try {
        const getTask = await API.get(`api/tasks/getalltasks/${user.id}`, {
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
  }, []);

  const handleDeleteTask = React.useCallback((id) => {
    setDeleteId(id);
    setIsOpen(true);
  }, [])

  async function confirmDelete() {
    try {
      const deleteTask = await API.delete(`/api/tasks/deletetask/${deleteId}`, {
        withCredentials: true
      })
      setTasks(prev => {
        const updatedTasks = prev.filter(task => task._id !== deleteId);
        return updatedTasks;
      });
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
    try {
      const res = await API.post('/api/tasks/addtask', newtask, {
        withCredentials: true
      })
      setTasks(prev => {
        const updatedTasks = [res.data, ...prev];
        return updatedTasks;
      });
    }
    catch (err) {
      showAlert('Failed to add task. Please try again later.')
    }

    settaskName('');
  }

  const deleteHandlers = React.useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      map[task._id] = () => handleDeleteTask(task._id);
    });
    return map;
  }, [tasks, handleDeleteTask]);


  return (
    <>
{/*       <Suspense fallback={<div>Loading...</div>}> */}
        {alertMsg && <CustomAlert message={alertMsg} onClose={() => setAlertMsg('')} />}
        {isOpen &&
          <ConfirmationAlert isOpen={isOpen} onClose={() => { setIsOpen(false); setDeleteId(null) }} onConfirm={confirmDelete} message={"Are you sure you want to delete this Task?"} type={"Delete"} />
        }
{/*       </Suspense> */}
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
            <Taskcard key={task._id} task={task} handleDeleteTask={deleteHandlers[task._id]} />
          )) : <div>No tasks available</div>}
        </div>
      </div>
    </>
  )
}

export default Tasks
