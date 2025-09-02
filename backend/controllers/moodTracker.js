const mongoose = require('mongoose');
const MoodTracker = require('../models/moodTracker');

const addMoodEntry = async (req, res) => {
  try {
    const { userId, date, responses, title } = req.body;
    if (!date || !responses) {
      return res.status(400).json({ message: "Date and responses are required." });
    }

    const JournalDate = new Date(date);
    const month = String(JournalDate.getMonth() + 1).padStart(2, '0');
    const day = String(JournalDate.getDate()).padStart(2, '0');
    const year = JournalDate.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    const existingEntry = await MoodTracker.findOne({ userId, date: formattedDate });
    if (existingEntry) {
      return res.status(400).json({ message: "Mood entry for this date already exists." });
    }

    const newEntry = new MoodTracker({
      userId,
      date: formattedDate,  
      responses,
      title: title || "",
      analyzed: true
    });

    await newEntry.save();

    res.status(201).json({ message: "Mood entry added successfully.", mood: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const updateMoodEntry = async (req, res) => {
  try {
    const { moodId } = req.params;
    const { responses, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({ message: "Invalid mood entry ID." });
    }

    if (!responses && !date) {
      return res.status(400).json({ message: "Nothing to update." });
    }

    const moodEntry = await MoodTracker.findById(moodId);
    if (!moodEntry) {
      return res.status(404).json({ message: "Mood entry not found." });
    }

    if (moodEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    if (responses) {
      moodEntry.responses = { ...moodEntry.responses, ...responses };
      moodEntry.analyzed = Object.values(moodEntry.responses).some(val => val > 0);
    }

    if (date) moodEntry.date = date;

    await moodEntry.save();
    res.status(200).json({ message: "Mood entry updated successfully.", mood: moodEntry });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const deleteMoodEntry = async (req, res) => {
  try {
    const { moodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({ message: "Invalid mood entry ID." });
    }

    const moodEntry = await MoodTracker.findById(moodId);
    if (!moodEntry) {
      return res.status(404).json({ message: "Mood entry not found." });
    }

    if (moodEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    await moodEntry.deleteOne();
    res.status(200).json({ message: "Mood entry deleted successfully.", deletedDate: moodEntry.date });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const getMoodById = async (req, res) => {
  try {
    const { moodId } = req.params; 
    const userId = req.user._id;

    if (!moodId) return res.status(400).json({ message: "Mood ID is required." });

    const moodEntry = await MoodTracker.findOne({ _id: moodId, userId });
    if (!moodEntry) return res.status(404).json({ message: "Mood entry not found." });

    res.status(200).json({ mood: moodEntry });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


const getAllMoods = async (req, res) => {
  try {
    const userId = req.user._id;

    const moods = await MoodTracker.find({ userId }).sort({ date: -1 });
    res.status(200).json({ moods });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const getMoodByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    const JournalDate = new Date(date);
    const month = String(JournalDate.getMonth() + 1).padStart(2, '0');
    const day = String(JournalDate.getDate()).padStart(2, '0');
    const year = JournalDate.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    if (!formattedDate) {
      return res.status(400).json({ message: "Date is required." });
    }
    const moodEntry = await MoodTracker.findOne({ userId, date:formattedDate });

    if (moodEntry) {
      return res.status(200).json({ exists: true, mood: moodEntry });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


module.exports = { addMoodEntry, updateMoodEntry, deleteMoodEntry, getMoodById, getAllMoods, getMoodByDate };
