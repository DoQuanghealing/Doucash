// SỬA TẠI ĐÂY: Sử dụng đúng tên thư viện @google/generative-ai
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Transaction, User, Goal, IncomeProject, FixedCost, FinancialReport } from '../types';

// Cấu hình Model dựa trên hướng dẫn mới nhất
const FLASH_MODEL = 'gemini-1.5-flash';
const PRO_MODEL = 'gemini-1.5-pro';

// SỬA TẠI ĐÂY: Lấy API KEY từ import.meta.env (chuẩn Vite) hoặc process.env (chuẩn Node)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiService = {
  isAvailable: () => !!API_KEY,

  generateWeeklyInsight: async (transactions: Transaction[], users: User[]): Promise<string> => {
    if (!GeminiService.isAvailable()) return "AI đang quan sát trong im lặng.";
    try {
      const model = genAI.getGenerativeModel({ model: FLASH_MODEL });
      const prompt = `Phân tích các giao dịch gần đây của ${users.map(u => u.name).join(' & ')}. Ngôn ngữ: Tiếng Việt. Giọng điệu: Hơi mỉa mai nhưng thực tế. Tối đa 2 câu. Dữ liệu: ${JSON.stringify(transactions.slice(-15))}`;
      const result = await model.generateContent(prompt);
      return result.response.text() || "Đã ghi nhận thói quen chi tiêu.";
    } catch (e) {
      return "AI đang bận tính toán tiền lãi.";
    }
  },

  generateReflectionPrompt: async (overspentCategory: string, amountOver: number): Promise<string> => {
    if (!GeminiService.isAvailable()) return "Đó là lựa chọn của bạn.";
    try {
      const model = genAI.getGenerativeModel({ model: FLASH_MODEL });
      const prompt = `Người dùng đã chi quá tay ${amountOver} VND trong danh mục ${overspentCategory}. Viết 1 câu phản tư ngắn gọn, mỉa mai bằng tiếng Việt.`;
      const result = await model.generateContent(prompt);
      return result.response.text() || "Đó là lựa chọn của bạn.";
    } catch (e) {
      return "Đó là lựa chọn của bạn.";
    }
  },

  generateTransactionComment: async (transaction: any): Promise<string> => {
    if (!GeminiService.isAvailable()) return "";
    try {
      const model = genAI.getGenerativeModel({ model: FLASH_MODEL });
      const prompt = `Viết 1 câu mỉa mai ngắn bằng tiếng Việt về việc chi ${transaction.amount} VND cho ${transaction.category}.`;
      const result = await model.generateContent(prompt);
      return result.response.text() || "";
    } catch (e) { return ""; }
  },

  generateBadge: async (transactions: Transaction[]): Promise<{title: string, description: string}> => {
     if (!GeminiService.isAvailable()) return { title: 'Người bí ẩn', description: 'Tiền đi đâu không ai biết.' };
     try {
        const model = genAI.getGenerativeModel({ 
            model: FLASH_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
        const prompt = `Tạo một huy hiệu thành tích mỉa mai dựa trên các giao dịch này: ${JSON.stringify(transactions)}. Trả về JSON {title, description}`;
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
      } catch (e) {
        return { title: 'Người bí ẩn', description: 'Tiền đi đâu không ai biết.' };
      }
  },

  generateIncomePlan: async (idea: string): Promise<any> => {
      if (!GeminiService.isAvailable()) return null;
      try {
          const model = genAI.getGenerativeModel({ 
              model: PRO_MODEL,
              generationConfig: {
                  responseMimeType: "application/json",
              }
          });
          const prompt = `Lập kế hoạch thu nhập chi tiết cho ý tưởng: "${idea}". Đơn vị: VND. Ngôn ngữ: Tiếng Việt. Trả về JSON có cấu hình: {name, description, expectedIncome, milestones: [{title, daysFromNow}]}`;
          const result = await model.generateContent(prompt);
          return JSON.parse(result.response.text());
      } catch (e) { return null; }
  },

  generateComprehensiveReport: async (transactions: Transaction[], goals: Goal[], projects: IncomeProject[], fixedCosts: FixedCost[]): Promise<FinancialReport | null> => {
      if (!GeminiService.isAvailable()) return null;
      try {
          const model = genAI.getGenerativeModel({ 
              model: PRO_MODEL,
              generationConfig: {
                  responseMimeType: "application/json",
              }
          });
          const prompt = `Phân tích sức khỏe tài chính dựa trên dữ liệu giao dịch, mục tiêu và hóa đơn cố định. Trả về JSON FinancialReport gồm: healthScore (0-100), incomeTrend {status, percentage, message}, projectVelocity {rating, completedProjects, message}, goalForecast {canMeetFixedCosts, majorGoalPrediction, advice}. Dữ liệu: ${JSON.stringify({transactions, goals, projects, fixedCosts})}`;
          const result = await model.generateContent(prompt);
          return JSON.parse(result.response.text());
      } catch (e) { return null; }
  }
};
