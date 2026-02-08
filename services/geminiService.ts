import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Transaction, Goal, IncomeProject, FixedCost, FinancialReport, ProsperityPlan, Budget, Wallet } from '../types';

// --- CẤU HÌNH HỆ THỐNG ---
const SYSTEM_INSTRUCTION_BUTLER = "Bạn là một quản gia tài chính mỉa mai nhưng trung thành. Trả lời bằng tiếng Việt. Quan trọng: Luôn viết hoa chữ cái đầu tiên của câu, còn lại viết thường hoàn toàn. Câu thoại ngắn dưới 20 từ.";

const SYSTEM_INSTRUCTION_CFO = `Bạn là Giám đốc Tài chính (CFO) ảo của Manicash. Nhiệm vụ của bạn là phân tích dữ liệu để tạo báo cáo "Sức khỏe & Thịnh vượng".
Xưng hô: gọi người dùng là "Cậu chủ" hoặc "Cô chủ".

QUY TẮC TRÌNH BÀY:
- Các đoạn văn diễn giải: Viết chữ thường hoàn toàn, chỉ viết hoa chữ cái đầu tiên của mỗi câu.
- Nhãn quan trọng: Các từ 'DỰ BÁO', 'CẢNH BÁO', 'BÁO ĐỘNG', 'NGUỒN TỐT NHẤT' phải viết IN HOA toàn bộ.`;

// Khởi tạo API Client một lần duy nhất để tiết kiệm tài nguyên
const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiService = {
  isAvailable: () => !!API_KEY,

  // 1. Phản hồi mỉa mai cực ngắn (Dùng model Flash để tốc độ nhanh nhất)
  generateTransactionComment: async (transaction: any): Promise<string> => {
    if (!API_KEY) return "";
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      systemInstruction: SYSTEM_INSTRUCTION_BUTLER 
    });
    
    const prompt = `Mỉa mai cực ngắn việc chi ${transaction.amount} cho ${transaction.category}. 1 câu duy nhất.`;
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) { return ""; }
  },

  // 2. Lời nhắc phản tư khi tiêu lố
  generateReflectionPrompt: async (overspentCategory: string, amountOver: number): Promise<string> => {
    if (!API_KEY) return "Tiền không tự sinh ra đâu ạ.";
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      systemInstruction: SYSTEM_INSTRUCTION_BUTLER 
    });
    
    const prompt = `Người dùng chi lố ${amountOver} cho ${overspentCategory}. Viết 1 câu mỉa mai thức tỉnh.`;
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) { return "Hệ thống phản tư đang bận."; }
  },

  // 3. Kế hoạch thịnh vượng (JSON Mode)
  generateProsperityPlan: async (transactions: Transaction[], fixedCosts: FixedCost[], goals: Goal[]): Promise<ProsperityPlan | null> => {
    if (!API_KEY) return null;
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const summary = {
      transactions: transactions.slice(-15).map(t => ({ cat: t.category, val: t.amount })),
      fixedCosts: fixedCosts.map(c => ({ title: c.title, val: c.amount })),
      goals: goals.map(g => ({ name: g.name, target: g.targetAmount, current: g.currentAmount }))
    };

    const prompt = `${SYSTEM_INSTRUCTION_CFO}\n\nDựa trên dữ liệu: ${JSON.stringify(summary)}. Trả về JSON ProsperityPlan: statusTitle, statusEmoji, healthScore, summary, savingsStrategies[], incomeStrategies[], badHabitToQuit{habit, why}.`;

    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("AI Error:", error);
      return null; 
    }
  },

  // 4. Báo cáo CFO toàn diện (Dùng model Pro để phân tích sâu)
  generateComprehensiveReport: async (
    transactions: Transaction[], 
    goals: Goal[], 
    budgets: Budget[],
    wallets: Wallet[],
    gender: 'MALE' | 'FEMALE' = 'MALE'
  ): Promise<FinancialReport | null> => {
    if (!API_KEY) return null;
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const dataContext = {
      wallets: wallets.map(w => ({ name: w.name, bal: w.balance })),
      budgets: budgets.map(b => ({ cat: b.category, lim: b.limit, spent: b.spent })),
      goals: goals.map(g => ({ name: g.name, cur: g.currentAmount, tar: g.targetAmount })),
      recentTransactions: transactions.slice(-30).map(t => ({ cat: t.category, amt: t.amount }))
    };

    const prompt = `${SYSTEM_INSTRUCTION_CFO}\n\nPhân tích cho ${gender === 'FEMALE' ? 'Cô chủ' : 'Cậu chủ'}: ${JSON.stringify(dataContext)}. Trả về JSON FinancialReport hoàn chỉnh.`;

    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error("CFO Error:", error);
      return null;
    }
  }
};
