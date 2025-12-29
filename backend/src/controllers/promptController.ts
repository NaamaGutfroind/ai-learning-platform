import { Request, Response } from 'express';
import { generateLearningContent } from '../services/promptService';
import Prompt from '../models/Prompt'; 

export const getAIContent = async (req: Request, res: Response) => {
  try {
    const { user_id, category_id, sub_category_id, prompt_text } = req.body;

    let aiResponse;

    try {
      aiResponse = await generateLearningContent(category_id, sub_category_id);
      console.log("Fetched from Real AI API");
    } catch (apiError) {
      console.warn("AI API failed, switching to Offline Mock Mode");

      aiResponse = {
        topic: `${category_id} - ${sub_category_id}`,
        content: `שלום! כרגע המערכת במצב אופליין. הנה מידע בסיסי על ${sub_category_id} בתחום ה-${category_id}.`,
        exercises: [
          `תרגיל 1 בנושא ${sub_category_id}`,
          `תרגיל 2 בנושא ${category_id}`
        ],
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