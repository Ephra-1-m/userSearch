const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'Missing name' });

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(name)} site:facebook.com OR site:instagram.com OR site:tiktok.com`);

    const links = await page.$$eval('a', anchors =>
      anchors
        .map(a => a.href)
        .filter(href => href.includes('facebook.com') || href.includes('instagram.com') || href.includes('tiktok.com'))
    );

    await browser.close();

    res.json({ name, results: links.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search', details: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
