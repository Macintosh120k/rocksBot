const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Función para obtener el chatroomId con Puppeteer
async function getChatroomIdWithPuppeteer(slug) {
  const url = `https://kick.com/api/v2/channels/${slug}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    const response = await page.goto(url, { waitUntil: 'networkidle2' });

    if (response.status() !== 200) {
      throw new Error(`Estado HTTP ${response.status()}`);
    }

    const content = await response.text();
    const data = JSON.parse(content);

    await browser.close();

    const chatroomId = data.chatroom?.id;
    if (!chatroomId) throw new Error('No se encontró chatroomId');

    return chatroomId;

  } catch (err) {
    console.error('❌ Error al obtener chatroomId:', err.message);
    await browser.close();
    throw err;
  }
}

// Ruta para obtener el chatroomId
app.get('/getChatroomId', async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Falta el parámetro slug' });
  }

  try {
    const chatroomId = await getChatroomIdWithPuppeteer(slug);
    res.json({ chatroomId });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el chatroomId' });
  }
});
// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
