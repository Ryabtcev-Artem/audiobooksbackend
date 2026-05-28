import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const dbPath = path.resolve(process.cwd(), 'views.json');

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

async function readDb() {
  try {
    const text = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(text || '{}');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

app.get('/views', async (req, res) => {
  const db = await readDb();
  res.json(db);
});

app.get('/views/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const db = await readDb();
  res.json({ bookId, views: Number(db[bookId] ?? 0) });
});

app.post('/views/:bookId/increment', async (req, res) => {
  const { bookId } = req.params;
  const db = await readDb();
  const next = Number(db[bookId] ?? 0) + 1;
  db[bookId] = next;
  await writeDb(db);
  res.json({ bookId, views: next });
});

app.post('/views/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { views } = req.body;
  const db = await readDb();
  db[bookId] = Number(views ?? db[bookId] ?? 0);
  await writeDb(db);
  res.json({ bookId, views: db[bookId] });
});

app.listen(PORT, () => {
  console.log(`Audiobooks backend running on http://localhost:${PORT}`);
});
