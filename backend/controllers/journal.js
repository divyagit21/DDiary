const Journal = require('../models/journal');
const User = require('../models/user');
const mongoose = require('mongoose');

const updateAnalysis = async (req, res) => {
  try {
    const journalId = req.params.id;
    const { analysis } = req.body;
    if (!analysis) {
      return res.status(400).json({ message: 'Analysis text is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({ message: 'Invalid journal ID.' });
    }
    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found.' });
    }
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }
    const updatedJournal = await Journal.findByIdAndUpdate(
      journalId,
      {
        analysis,
        analyzed: true
      },
      { new: true }
    );
    res.status(200).json(updatedJournal);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

const checkToday = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized – user not found" });
    }
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = req.query.date || `${month}/${day}/${year}`;
    const existing = await Journal.findOne({ user: req.user._id, date: formattedDate });
    return res.json({ exists: !!existing });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const AddJournal = async (req, res) => {
  try {
    const journalData = req.body;
    const JournalDate = journalData.date
    if (!JournalDate || !journalData.journalNote) {
      return res.status(400).json({ message: "date, and journal note are required." });
    }
    const newjournal = new Journal({ title: journalData.title, date: JournalDate, journalNote: journalData.journalNote, user: req.user._id, analyzed: journalData.analyzed, analysis: journalData.analysis })
    const addedJournal = await newjournal.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { journalList: addedJournal._id }
    })
    return res.status(201).json({ message: "Journal successfully added." })
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const DeleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid journal ID." });
    }
    const journal = await Journal.findOne({ _id: id });
    if (!journal) {
      return res.status(404).json({ message: "Journal not found." });
    }
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this journal." });
    }
    await journal.deleteOne();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { journalList: id }
    });

    return res.status(200).json({ message: "Journal deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, journalNote, date } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid journal ID." });
    }

    const journal = await Journal.findOne({ _id: id });
    if (!journal) {
      return res.status(404).json({ message: "Journal not found or unauthorized" });
    }
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this journal." });
    }

    if (title !== undefined) journal.title = title;
    if (journalNote !== undefined) journal.journalNote = journalNote;
    if (date !== undefined) journal.date = date;
    await journal.save();
    return res.status(200).json({ message: "Journal updated successfully", journal });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findOne({ _id: id });
    if (!journal) {
      return res.status(404).json({ message: "Journal not found or access denied." });
    }
    return res.status(200).json({ journal });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


const GetAllJournals = async (req, res) => {
  try {
    const { id } = req.params;
    const journals = await Journal.find({ user: id }).sort({ date: -1 });
    res.status(200).json({ journals });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { AddJournal, DeleteJournal, UpdateJournal, GetJournal, GetAllJournals, updateAnalysis, checkToday }