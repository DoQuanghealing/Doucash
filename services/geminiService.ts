import { GoogleGenAI } from "@google/genai";
import { Transaction, User } from "../types";

// Vite: chỉ đọc biến env qua import.meta.env với prefix VITE_
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

// Nên dùng model ổn định cho nội bộ (preview dễ đổi hành vi)
const MODEL_NAME = "gemini-2.5-flash";

// Khởi tạo AI client chỉ khi có key
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function safeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/\s+/g, " ").trim();
}

export const GeminiService = {
  isAvailable: () => !!apiKey && !!ai,

  generateWeeklyInsight: async (
    transactions: Transaction[],
    users: User[]
  ): Promise<string> => {
    if (!ai) return "AI tạm im lặng (thiếu API key).";

    // An toàn: nếu chưa đủ 2 user thì vẫn chạy
    const name1 = users?.[0]?.name ?? "Người 1";
    const name2 = users?.[1]?.name ?? "Người 2";

    const recentTx = transactions.slice(-15);

    // Đưa dữ liệu ngắn gọn, tránh quá dài
    const txString = recentTx
      .map((t) => {
        const desc = safeText((t as any).description);
        const line = `${t.date}: ${t.amount} - ${t.category}${desc ? ` (${desc})` : ""}`;
        return line;
      })
      .join("\n");

    const prompt = `
Bạn là trợ lý phản tư tài chính cho ứng dụng quản lý chi tiêu của hai vợ chồng.

Bối cảnh: cặp đôi tên ${name1} và ${name2}.
Giao dịch gần đây (mới nhất ở cuối):
${txString}

Vai trò: quan sát và phản chiếu hành vi. Không dạy đời. Không cổ vũ sáo rỗng. Không phán xét.
Giọng điệu: trưởng thành, điềm tĩnh, hơi mỉa nhẹ, tôn trọng.

Quy tắc bắt buộc:
- Tối đa 2 câu.
- Không đưa lời khuyên.
- Không đặt câu hỏi.
- Không emoji.
- Không dấu chấm than.
- Tránh câu sáo rỗng kiểu “cố lên”, “bạn làm được”.
- Ưu tiên nhận xét về nhịp chi tiêu và xu hướng (ổn/ lệch/ căng).

Chỉ trả về đúng nội dung 2 câu, không thêm tiêu đề.
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      const text = safeText((response as any).text);
      return text || "Tiền tuần này đi khá nhanh. Kế hoạch vẫn còn, nhưng đang bị thử.";
    } catch (e) {
      // Không log chi tiết nếu sợ lộ thông tin môi trường
      return "AI đang quan sát trong im lặng (lỗi tạm thời).";
    }
  },

  generateReflectionPrompt: async (
    overspentCategory: string,
    amountOver: number
  ): Promise<string> => {
    if (!ai) return `Ngân sách mục "${overspentCategory}" đang bị vượt.`;

    const prompt = `
Người dùng vừa vượt ngân sách ở danh mục "${overspentCategory}" khoảng ${amountOver}.
Hãy tạo 1 câu phản tư ngắn.

Giọng: trưởng thành, điềm tĩnh, hơi mỉa nhẹ.
Quy tắc: tối đa 20 từ. Không lời khuyên. Không câu hỏi. Không emoji. Không dấu chấm than.
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      const text = safeText((response as any).text);
      return text || "Khoản này không sai. Chỉ là nó làm mục tiêu chậm lại.";
    } catch {
      return "Khoản này không sai. Chỉ là nó làm mục tiêu chậm lại.";
    }
  },

  generateTransactionComment: async (transaction: any): Promise<string> => {
    if (!ai) return "";

    const amount = transaction?.amount ?? "";
    const category = transaction?.category ?? "một khoản";
    const desc = safeText(transaction?.description);

    const prompt = `
Người dùng vừa ghi nhận một giao dịch chi tiêu: ${amount} cho "${category}"${desc ? ` (${desc})` : ""}.
Hãy tạo 1 câu phản hồi ngắn sau khi lưu giao dịch.

Giọng: trưởng thành, điềm tĩnh, hơi mỉa nhẹ.
Quy tắc: 1 câu, tối đa 15 từ. Không emoji. Không câu hỏi. Không dấu chấm than. Không lời khuyên.
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return safeText((response as any).text);
    } catch {
      return "";
    }
  },

  generateBadge: async (
    transactions: Transaction[]
  ): Promise<{ title: string; description: string }> => {
    if (!ai) return { title: "Người mới ghi chép", description: "Ít nhất bạn đã bắt đầu." };

    const sample = transactions.slice(-10);

    const prompt = `
Dựa trên 10 giao dịch gần nhất sau (JSON): ${JSON.stringify(sample)}
Hãy tạo 1 huy hiệu thành tích (tên + mô tả ngắn).

Yêu cầu:
- Giọng: hài mỉa nhẹ, kiểu “khô”, trưởng thành.
- Không emoji. Không dấu chấm than.
- title: tối đa 5 từ.
- description: tối đa 10 từ.
Trả về đúng JSON dạng: {"title":"...","description":"..."}
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const text = safeText((response as any).text);
      const obj = JSON.parse(text || "{}");

      // Fallback an toàn
      const title = safeText(obj.title) || "Bậc thầy chi tiêu";
      const description = safeText(obj.description) || "Tiền đi nhanh, bạn vẫn bình tĩnh.";
      return { title, description };
    } catch {
      return { title: "Người tiêu bí ẩn", description: "Tiền đi đâu, ai cũng tò mò." };
    }
  },
};
