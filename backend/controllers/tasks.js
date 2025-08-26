const Task = require('../models/tasks');
const addTask = async (req, res) => {
  try {
    const { title, tasksList } = req.body;
    const userId = req.user.id; 
    const task = new Task({
      title,
      tasksList,
      user: userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve task", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, tasksList } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, tasksList },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};

const allTasks = async (req, res) => {
  try {
    const userId = req.params.userId;

    const tasks = await Task.find({ user: userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tasks", error });
  }
};

module.exports={addTask,getTask,updateTask,deleteTask,allTasks}