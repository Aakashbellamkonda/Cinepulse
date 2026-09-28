import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/gemini/recommend', async (req, res) => {
    try {
      const { prompt, userPreferences } = req.body;
      const systemInstruction = `You are CinePulse AI, an expert cinematic concierge and movie recommendation assistant. You help users find movies based on their mood, preferences, cast, or genre, and give witty insights or popcorn trivia. Return clean markdown formatted response.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt || `Recommend some amazing movies based on preferences: ${JSON.stringify(userPreferences || {})}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || 'Enjoy your movie experience with CinePulse!' });
    } catch (error: any) {
      console.error('Gemini recommendation error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
    }
  });

  // Razorpay Order Creation Simulation
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt } = req.body;
      // Generate a mock Razorpay order ID
      const orderId = `order_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      res.json({
        id: orderId,
        amount: amount * 100, // in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        status: 'created',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create razorpay order' });
    }
  });

  // Razorpay Payment Verification Simulation
  app.post('/api/razorpay/verify', async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      // In test mode, verify success
      if (razorpay_payment_id) {
        res.json({
          success: true,
          message: 'Payment verified successfully by Razorpay',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
      } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Payment verification failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CinePulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
