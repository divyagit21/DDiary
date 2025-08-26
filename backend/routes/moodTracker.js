const verifyToken=require('../verifyToken')
const express = require('express');
const router = express.Router();
const {getAllMoods,getMoodById,addMoodEntry,updateMoodEntry,deleteMoodEntry,getMoodByDate} = require('../controllers/moodTracker');

router.get('/getMoodById/:moodId',verifyToken, getMoodById);
router.post('/addMood',verifyToken, addMoodEntry);
router.put('/updateMood/:moodId',verifyToken, updateMoodEntry); 
router.delete('/deleteMood/:moodId',verifyToken, deleteMoodEntry);
router.get('/getAllMoods',verifyToken, getAllMoods);
router.get('/getMoodByDate/:date', verifyToken, getMoodByDate);

module.exports=router