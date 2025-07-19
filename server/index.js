const express = require('express');
const app = express();
const PORT = process.env.PORT;

// Endpoint that sends 'hellow world' to the frontend
app.get('/hello', (req, res) => {
  res.send('hellow world');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
