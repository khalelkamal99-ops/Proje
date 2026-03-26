import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainGrammar(question: string, userAnswer: string, correctAnswer: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Sen bir İngilizce öğretmenisin. Öğrencinin yaptığı hatayı veya doğru cevabı açıkla.
        Soru: ${question}
        Öğrencinin Cevabı: ${userAnswer}
        Doğru Cevap: ${correctAnswer}
        
        Lütfen kısa, anlaşılır ve teşvik edici bir açıklama yap. Türkçe açıkla.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Açıklama alınamadı, lütfen daha sonra tekrar deneyin.";
  }
}
