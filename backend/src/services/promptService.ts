import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config(); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const generateLearningContent = async (category: string, subCategory: string, userPrompt?: string) => {
  try {
   
    const prompt = `Create a learning module for ${category} specifically about ${subCategory}. 
    ${userPrompt ? `The user also asked: "${userPrompt}". Please address this specifically in your explanation.` : ''}
    Return the response in JSON format with the following fields:
    - explanation: a clear explanation of the topic.
    - task: a practical task for the student to perform.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to generate content");
  }
};

