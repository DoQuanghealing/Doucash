import { GoogleGenAI } from "@google/genai";
import { Transaction, Budget, User } from '../types';

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

export const GeminiService = {
  // Checks if we can use AI
  isAvailable: () => !!apiKey,

  generateWeeklyInsight: async (transactions: Transaction[], users: User[]): Promise<string> => {
    if (!apiKey) return "AI Insights unavailable (Missing API Key).";

    const recentTx = transactions.slice(-15);
    const txString = recentTx.map(t => `${t.date}: $${t.amount} on ${t.category} (${t.description})`).join('\n');

    const prompt = `
      Analyze these recent financial transactions for a couple named ${users[0].name} and ${users[1].name}.
      Transactions:
      ${txString}

      Act as a financial reflection assistant.
      Role: Observer and mirror. Not a teacher. Not a cheerleader. Not a judge.
      Tone: Mature, calm, witty, slightly sarcastic, respectful.
      
      Strict Rules:
      1. Maximum 2 sentences.
      2. NO advice.
      3. NO questions.
      4. NO emojis.
      5. NO exclamation marks.
      6. NO cliches like "keep trying" or "you can do it".
      7. Focus on reflecting behavior honestly.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "Spending patterns noted.";
    } catch (e) {
      console.error(e);
      return "The AI is observing silently (Error).";
    }
  },

  generateReflectionPrompt: async (overspentCategory: string, amountOver: number): Promise<string> => {
    if (!apiKey) return `Overspending detected in ${overspentCategory}.`;

    const prompt = `
      The user just went $${amountOver} over budget in the '${overspentCategory}' category.
      Generate a short reflection statement.
      Tone: Mature, calm, slightly ironic.
      Rules: Max 20 words. NO questions. NO emojis. NO exclamation marks. NO advice.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "That is a choice you made.";
    } catch (e) {
      return "That is a choice you made.";
    }
  },

  generateTransactionComment: async (transaction: any): Promise<string> => {
    if (!apiKey) return "";

    const prompt = `
      The user just spent $${transaction.amount} on ${transaction.category} (${transaction.description}).
      Generate a subtle, calm, slightly ironic, adult, one-sentence reflection. 
      Rules: NO emojis. NO questions. NO exclamation marks. Max 15 words.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "";
    } catch (e) {
      return "";
    }
  },

  generateBadge: async (transactions: Transaction[]): Promise<{title: string, description: string}> => {
     if (!apiKey) return { title: 'Budget Novice', description: 'Tracking has begun.' };

     // Simple heuristic for demo
     const prompt = `
        Based on these transactions: ${JSON.stringify(transactions.slice(-10))}
        Invent a creative, sarcastic achievement badge title and short description (max 10 words).
        Tone: Dry humor.
        Rules: NO emojis. NO exclamation marks.
        Example: "Latte Legend: Funded the local cafe renovation."
        Return JSON format: { "title": "...", "description": "..." }
     `;

      try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        return JSON.parse(text || '{}');
      } catch (e) {
        return { title: 'Mystery Spender', description: 'Money moves in mysterious ways.' };
      }
  }
};