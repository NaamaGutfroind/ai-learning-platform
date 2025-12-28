import { Request, Response } from 'express';
import { generateLearningContent } from '../services/promptService';
import Prompt from '../models/Prompt'; 

/**
 * @desc    
 * @route   
 */
export const getAIContent = async (req: Request, res: Response) => {
  try {
    const { _id, user_id, category_id, sub_category_id, prompt_text } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Please provide a custom _id for this prompt" });
    }

    
    const aiResponse = await generateLearningContent(category_id, sub_category_id);

    const newPrompt = new Prompt({
      _id: _id, 
      user_id,
      category_id,
      sub_category_id,
      prompt: prompt_text,
      response: JSON.stringify(aiResponse) 
    });

    await newPrompt.save(); 

    res.status(201).json({
      message: "Saved to Docker with custom ID!",
      data: newPrompt
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Error saving prompt to Docker" });
  }
};

/**
 * @desc    
 * @route  
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
 * @desc   
 * @route  
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