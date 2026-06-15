const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Your API configuration
const API_URL = 'http://klyphic.onrender.com/chat';
const TOKEN = '033b3b43aa3d4c93bb0952161c0df3a7';
const MODEL = 'claude-opus-4.7';

// API Route: Proxy to Klyphic
app.post('/api/ask', upload.single('image'), async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        
        console.log(`📝 Question: ${question}`);
        
        // Call your Klyphic API
        const response = await axios.get(API_URL, {
            params: {
                token: TOKEN,
                q: question,
                model: MODEL
            },
            timeout: 30000 // 30 seconds timeout
        });
        
        console.log(`✅ API Response received`);
        
        // Send back the response
        res.json({
            success: true,
            answer: response.data.response || "No response from API",
            metadata: {
                model: response.data.model,
                tokens_used: response.data.tokens_used,
                imageReceived: req.file ? true : false,
                imageName: req.file ? req.file.originalname : null
            }
        });
        
    } catch (error) {
        console.error('❌ API Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || "Unknown error"
        });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Proxy: /api/ask`);
    console.log(`🌐 Open: http://localhost:${PORT}`);
});