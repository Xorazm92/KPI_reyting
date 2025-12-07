
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all companies
app.get('/api/companies', (req, res) => {
  res.json({
    success: true,
    count: 43,
    message: 'Companies fetched successfully'
  });
});

// Test KPI calculation
app.post('/api/test-kpi', (req, res) => {
  const { ltifr, trir } = req.body;
  res.json({
    success: true,
    scores: {
      ltifr: Math.max(0, 100 - (ltifr * 20)),
      trir: Math.max(0, 100 - (trir * 10))
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API Server running on http://0.0.0.0:${PORT}`);
});
