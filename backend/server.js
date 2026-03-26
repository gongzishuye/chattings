import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { personNameMap } from './config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PERSONS_DIR = join(__dirname, 'persons');

function getSystemPrompt(personId) {
  const filePath = join(PERSONS_DIR, `${personId}.md`);
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return readFileSync(join(PERSONS_DIR, 'elon-musk.md'), 'utf-8');
  }
}

function getPersonsList() {
  const files = readdirSync(PERSONS_DIR).filter(f => f.endsWith('.md'));
  return files.map(f => ({
    id: f.replace('.md', ''),
    name: personNameMap[f.replace('.md', '')] || f.replace('.md', '')
  }));
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

app.get('/api/persons', (req, res) => {
  res.json(getPersonsList());
});

app.post('/api/chat', async (req, res) => {
  const { messages, person = 'elon-musk' } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  const systemPrompt = getSystemPrompt(person);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await anthropic.messages.stream({
      model: 'MiniMax-M2.7',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
