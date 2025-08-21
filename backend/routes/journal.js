const express=require('express')
const Router=express.Router()
const {AddJournal,GetJournal,UpdateJournal,DeleteJournal,GetAllJournals,checkToday}=require('../controllers/journal')
const verifyToken=require('../verifyToken')
const { updateAnalysis } = require('../controllers/journal');

Router.put('/analyze/:id',verifyToken, updateAnalysis);
Router.post('/addJournal',verifyToken,AddJournal);
Router.get('/getJournal/:id',verifyToken,GetJournal);
Router.get('/checkToday',verifyToken,checkToday);
Router.get('/getAllJournals/:id',verifyToken,GetAllJournals);
Router.put('/updateJournal/:id',verifyToken,UpdateJournal);
Router.delete('/deleteJournal/:id',verifyToken,DeleteJournal);

module.exports=Router