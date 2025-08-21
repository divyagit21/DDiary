const express = require('express');
const router = express.Router();
const axios = require('axios');
const verifyToken = require('../verifyToken');

router.post('/analyze',verifyToken, async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post('http://localhost:5001/api/ai/analyze', { text });
    const { mbti } = response.data;
    res.json({ mbti });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze journal entry' });
  }
});

module.exports = router;
