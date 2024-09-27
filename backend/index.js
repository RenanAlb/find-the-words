const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const themes = require('./temas');

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.get('/temas', async (req, res) => {
  res.status(200).json({ themes });
});

app.listen(port, () => console.log('Servidor ativo em http://localhost:' + port));