import { Employee, Floor, AICommandResult, AIStep, AIProposedAction } from '../../types';

export const callGeminiApi = async (
  prompt: string,
  apiKey: string,
  modelName: string = 'gemini-1.5-flash',
  context: { employees: Employee[]; floors: Floor[]; activeFloorId: number }
): Promise<AICommandResult> => {
  const { employees, floors } = context;

  // Build a concise snapshot of the current office state for the LLM
  const simplifiedEmployees = employees.map(e => ({
    id: e.id,
    name: e.name,
    role: e.role,
    department: e.department,
    floorId: e.floorId,
    deskId: e.deskId,
    preferences: e.preferences
  }));

  const simplifiedDesks = floors.flatMap(f => f.desks.map(d => ({
    id: d.id,
    code: d.code,
    floorId: f.id,
    status: d.status,
    currentEmployeeId: d.currentEmployeeId,
    departmentZone: d.departmentZone,
    amenities: d.amenities,
    type: d.type
  })));

  const systemPrompt = `You are the AI Seating Assistant for Nexus Office Systems.
You have access to current employees and desks in the office.

Current Employees:
${JSON.stringify(simplifiedEmployees)}

Current Desks:
${JSON.stringify(simplifiedDesks)}

Your goal is to parse the administrator's instruction and return a JSON response with:
1. "message": Friendly markdown message explaining what you did or the answer.
2. "reasoning": Chain of thought explanation.
3. "steps": Array of { "type": "thought"|"analysis"|"tool_call"|"diff"|"success", "title": string, "content": string }
4. "proposedActions": Array of actions to perform. Each action object:
   - For reassigning a single person: { "type": "reassign_seat", "employeeId": string, "targetDeskId": string, "fromDeskCode": string, "toDeskCode": string }
   - For swapping two people: { "type": "swap_seats", "employeeId": string, "secondaryEmployeeId": string, "deskId": string, "targetDeskId": string }
   - For vacating a seat: { "type": "vacate_seat", "employeeId": string, "deskId": string }
   - If only answering a query (no mutation needed), proposedActions should be empty [].

RESPOND ONLY WITH VALID JSON adhering to the above format. Do NOT wrap in extra backticks unless standard JSON.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nAdministrator Request: "${prompt}"` }] }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No response text received from Gemini.');
    }

    const parsed = JSON.parse(candidateText);

    return {
      message: parsed.message || 'Action processed by Gemini AI.',
      reasoning: parsed.reasoning || 'Gemini evaluated constraints and formulated seating actions.',
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      proposedActions: Array.isArray(parsed.proposedActions) ? parsed.proposedActions : [],
      executed: true
    };
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
};
