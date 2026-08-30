import { Employee, Floor, AICommandResult } from '../../types';

export const callGroqApi = async (
  prompt: string,
  apiKey: string,
  modelName: string = 'llama-3.3-70b-versatile',
  context: { employees: Employee[]; floors: Floor[]; activeFloorId: number }
): Promise<AICommandResult> => {
  const { employees, floors } = context;

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
    amenities: d.amenities
  })));

  const systemPrompt = `You are the AI Seating Assistant for Nexus Office Systems.
You have access to current employees and desks in the office.

Current Employees:
${JSON.stringify(simplifiedEmployees)}

Current Desks:
${JSON.stringify(simplifiedDesks)}

Your goal is to parse the administrator's instruction and return a valid JSON object with:
{
  "message": "Friendly markdown message explaining what you did or answered",
  "reasoning": "Detailed explanation of decisions made",
  "steps": [
    { "id": "1", "type": "thought"|"analysis"|"tool_call"|"diff"|"success", "title": "...", "content": "..." }
  ],
  "proposedActions": [
    { "type": "reassign_seat", "employeeId": "...", "targetDeskId": "...", "fromDeskCode": "...", "toDeskCode": "..." }
    or
    { "type": "swap_seats", "employeeId": "...", "secondaryEmployeeId": "...", "deskId": "...", "targetDeskId": "..." }
    or
    { "type": "vacate_seat", "employeeId": "...", "deskId": "..." }
  ]
}
Return pure JSON only.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      message: parsed.message || 'Processed by Groq AI.',
      reasoning: parsed.reasoning || 'Groq analyzed office occupancy constraints.',
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      proposedActions: Array.isArray(parsed.proposedActions) ? parsed.proposedActions : [],
      executed: true
    };
  } catch (error: any) {
    console.error('Groq API error:', error);
    throw error;
  }
};
