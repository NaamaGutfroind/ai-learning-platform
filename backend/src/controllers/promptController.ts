import { Request, Response } from 'express';
import { generateLearningContent } from '../services/promptService';
import Prompt from '../models/Prompt'; 

export const getAIContent = async (req: Request, res: Response) => {
  try {
    const { user_id, category_id, sub_category_id, prompt_text } = req.body;

    let aiResponse;

    try {
      // עדכון: הוספנו את prompt_text כפרמטר שלישי לפונקציה
      aiResponse = await generateLearningContent(category_id, sub_category_id, prompt_text);
      console.log("Fetched from Real AI API");
    } catch (apiError) {
      console.warn("AI API failed, switching to Offline Mock Mode");

      // עדכון ה-Mock: הוספנו התייחסות לשאלת המשתמש גם כאן
      aiResponse = {
        explanation: `שלום! כרגע המערכת במצב אופליין (ללא חיבור ל-AI). \nהנה מידע בסיסי על ${sub_category_id} בתחום ה-${category_id}. ${prompt_text ? `\nבנוגע לשאלתך: "${prompt_text}", נשמח להרחיב עליה כשתחזור המערכת למצב אונליין.` : ''}`,
        task: `המשימה שלך: קרא עוד על הנושא ${sub_category_id} ונסה לסכם אותו ב-3 משפטים.`,
        isMock: true
      };
    }

    const newPrompt = new Prompt({
      user_id,
      category_id,
      sub_category_id,
      prompt: prompt_text,
      response: JSON.stringify(aiResponse)
    });

    await newPrompt.save();

    res.status(201).json({
      success: true,
      message: aiResponse.isMock
        ? "Generated Offline Content (Mock)"
        : "Generated from AI API",
      data: newPrompt
    });

  } catch (error) {
    console.error("General Error:", error);
    res.status(500).json({ message: "שגיאה בתהליך הפקת התוכן" });
  }
};


/**
 * @desc    שליפת היסטוריה למשתמש ספציפי
 */
export const getHistory = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params; 
    const history = await Prompt.find({ user_id }).sort({ created_at: -1 }); 
    res.status(200).json(history);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};

/**
 * @desc    שליפת כל ההיסטוריה למנהל (כולל שמות משתמשים)
 */
export const getAllPrompts = async (req: Request, res: Response) => {
  try {
    const prompts = await Prompt.find()
      .populate('user_id', 'name') 
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: prompts.length,
      data: prompts
    });
  } catch (error) {
    console.error("Admin History error:", error);
    res.status(500).json({ message: "שגיאה בשליפת היסטוריה כללית למנהל" });
  }
};