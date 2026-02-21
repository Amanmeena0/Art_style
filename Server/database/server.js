const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    try {
        const userData = req.body; // e.g., { text: "Hello AI" }

        // Forward the request to your Python server
        const response = await axios.post('http://localhost:8000/predict', userData);
        
        // Send the ML result back to the frontend
        res.json({
            status: "success",
            ml_results: response.data
        });
    } catch (error) {
        res.status(500).json({ error: "Python server is down!" });
    }
});

app.listen(3000, () => console.log('Node server running on port 3000'));