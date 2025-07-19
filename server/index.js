import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS from Vite default port
app.use(cors({ origin: 'http://localhost:5173' }));

// Endpoint that sends 'hello world' to the frontend
app.get('/hello', (req, res) => {
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
