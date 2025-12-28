export const cleanAIResponse = (text: string): string => {
  if (!text) return '';
  return text.trim().replace(/^"|"$/g, ''); 
};