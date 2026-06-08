import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { reviewCode } from './services/geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/testing. Can restrict to React client URL.
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-gemini-api-key'],
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.post('/api/review', async (req, res) => {
  const { code, language } = req.body;
  const customApiKey = req.header('x-gemini-api-key') || null;

  // Basic validation
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code is required and must be a string.' });
  }
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Language is required.' });
  }

  const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'c++', 'sql'];
  const normalizedLanguage = language.toLowerCase();
  
  if (!supportedLanguages.includes(normalizedLanguage)) {
    return res.status(400).json({ 
      error: `Unsupported language: ${language}. Supported languages are: JavaScript, TypeScript, Python, Java, C++, SQL` 
    });
  }

  try {
    const reviewResult = await reviewCode(code, language, customApiKey);
    return res.json({ success: true, data: reviewResult });
  } catch (error) {
    console.error('Error in /api/review endpoint:', error.message);
    return res.status(500).json({ 
      error: 'An error occurred while analyzing the code.', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root catch-all
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

function startServer(port) {
  const server = app.listen(port, () => {
    const actualPort = server.address().port;
    console.log(`Server is running on port ${actualPort}`);
    console.log(`Health check: http://localhost:${actualPort}/api/health`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying an ephemeral port...`);
      startServer(0);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });
}

startServer(Number(PORT) || 5000);
