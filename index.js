const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/getChatroomId', async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Falta el parámetro slug' });
  }

  try {
    const response = await axios.get(`https://kick.com/api/v2/channels/${slug}`);
    const chatroomId = response.data.chatroom?.id;

    if (!chatroomId) {
      return res.status(404).json({ error: 'No se encontró chatroomId' });
    }

    res.json({ chatroomId });
  } catch (err) {
    console.error('❌ Error al obtener chatroomId:', err.message);
    res.status(500).json({ error: 'Error al obtener el chatroomId' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
