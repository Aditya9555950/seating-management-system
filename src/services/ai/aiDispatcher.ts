import { Employee, Floor, AICommandResult, AISettings } from '../../types';
import { runLocalAiAgent } from './localAiEngine';
import { callGeminiApi } from './geminiProvider';
import { callGroqApi } from './groqProvider';

export const processAiPrompt = async (
  prompt: string,
  context: { employees: Employee[]; floors: Floor[]; activeFloorId: number },
  settings: AISettings
): Promise<AICommandResult> => {
  // If Gemini provider is configured with key
  if (settings.provider === 'gemini' && settings.geminiApiKey.trim()) {
    try {
      return await callGeminiApi(prompt, settings.geminiApiKey, settings.geminiModel, context);
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to Autonomous Engine:', err);
      const fallbackResult = runLocalAiAgent(prompt, context);
      fallbackResult.reasoning = `[Notice: Gemini API fallback used due to network/key error] ${fallbackResult.reasoning}`;
      return fallbackResult;
    }
  }

  // If Groq provider is configured with key
  if (settings.provider === 'groq' && settings.groqApiKey.trim()) {
    try {
      return await callGroqApi(prompt, settings.groqApiKey, settings.groqModel, context);
    } catch (err: any) {
      console.warn('Groq API call failed, falling back to Autonomous Engine:', err);
      const fallbackResult = runLocalAiAgent(prompt, context);
      fallbackResult.reasoning = `[Notice: Groq API fallback used due to network/key error] ${fallbackResult.reasoning}`;
      return fallbackResult;
    }
  }

  // Default: Use our built-in local Autonomous AI Engine
  return runLocalAiAgent(prompt, context);
};
