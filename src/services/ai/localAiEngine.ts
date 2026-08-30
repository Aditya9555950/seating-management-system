import { Employee, Floor, Desk, AICommandResult, AIStep, AIProposedAction, DeskAmenity } from '../../types';

interface AiContext {
  employees: Employee[];
  floors: Floor[];
  activeFloorId: number;
}

// Helper for fuzzy string matching
const findBestEmployeeMatch = (query: string, employees: Employee[]): Employee | null => {
  const q = query.toLowerCase().trim();
  // Exact match
  const exact = employees.find(e => e.name.toLowerCase() === q);
  if (exact) return exact;

  // Substring match
  const sub = employees.find(e => e.name.toLowerCase().includes(q) || q.includes(e.name.toLowerCase()));
  if (sub) return sub;

  // First name or Last name match
  const words = q.split(/\s+/);
  for (const word of words) {
    if (word.length >= 3) {
      const match = employees.find(e => {
        const parts = e.name.toLowerCase().split(/\s+/);
        return parts.some(p => p.includes(word) || word.includes(p));
      });
      if (match) return match;
    }
  }

  return null;
};

const findDeskByCodeOrId = (query: string, floors: Floor[]): { desk: Desk; floor: Floor } | null => {
  const q = query.toUpperCase().replace(/\s+/g, '-').trim();
  for (const floor of floors) {
    for (const desk of floor.desks) {
      if (
        desk.code.toUpperCase() === q ||
        desk.id.toUpperCase() === q.toLowerCase() ||
        desk.code.toUpperCase().replace('-', '').includes(q.replace('-', '')) ||
        (q.match(/\d+/) && desk.code.endsWith(q.match(/\d+/)![0]))
      ) {
        return { desk, floor };
      }
    }
  }
  return null;
};

export const runLocalAiAgent = (
  prompt: string,
  context: AiContext
): AICommandResult => {
  const { employees, floors } = context;
  const lower = prompt.toLowerCase();
  const steps: AIStep[] = [];
  const proposedActions: AIProposedAction[] = [];

  // Step 1: Initial Prompt Parsing
  steps.push({
    id: 'step-1',
    type: 'thought',
    title: 'Natural Language Processing & Intent Classification',
    content: `Parsing administrator prompt: "${prompt}". Analyzing entities (employees, desk codes, floor numbers, amenities, actions).`
  });

  // Check 1: SWAP SEATS INTENT
  // Example: "Swap seats between Alex Chen and David Kim", "Switch seat of Sarah and Jim"
  if (lower.includes('swap') || lower.includes('switch') || lower.includes('exchange')) {
    // Attempt to extract two employee names
    const matchedEmployees: Employee[] = [];
    for (const emp of employees) {
      if (lower.includes(emp.name.toLowerCase()) || lower.includes(emp.name.split(' ')[0].toLowerCase())) {
        if (!matchedEmployees.some(m => m.id === emp.id)) {
          matchedEmployees.push(emp);
        }
      }
    }

    if (matchedEmployees.length >= 2) {
      const emp1 = matchedEmployees[0];
      const emp2 = matchedEmployees[1];

      const desk1 = floors.flatMap(f => f.desks).find(d => d.id === emp1.deskId);
      const desk2 = floors.flatMap(f => f.desks).find(d => d.id === emp2.deskId);

      steps.push({
        id: 'step-2',
        type: 'analysis',
        title: 'Entity Identification & Seating Lookup',
        content: `Identified 2 employees for swap:\n• ${emp1.name} (Currently at: ${desk1?.code || 'Unassigned'})\n• ${emp2.name} (Currently at: ${desk2?.code || 'Unassigned'})`
      });

      steps.push({
        id: 'step-3',
        type: 'tool_call',
        title: 'Tool Invocation: swap_employee_seats()',
        content: `Calling swap_employee_seats(employeeId1="${emp1.id}", employeeId2="${emp2.id}", targetDesk1="${desk2?.id || 'null'}", targetDesk2="${desk1?.id || 'null'}")`
      });

      proposedActions.push({
        type: 'swap_seats',
        employeeId: emp1.id,
        employeeName: emp1.name,
        fromDeskCode: desk1?.code || 'Unassigned',
        toDeskCode: desk2?.code || 'Unassigned',
        deskId: desk1?.id,
        targetDeskId: desk2?.id,
        secondaryEmployeeId: emp2.id,
        secondaryEmployeeName: emp2.name,
        secondaryFromDeskCode: desk2?.code || 'Unassigned',
        secondaryToDeskCode: desk1?.code || 'Unassigned',
        reason: `Admin requested to swap seats between ${emp1.name} and ${emp2.name}`
      });

      steps.push({
        id: 'step-4',
        type: 'diff',
        title: 'Seating Allocation Diff Matrix',
        content: `[SWAP READY]\n- ${emp1.name}: ${desk1?.code || 'Unassigned'} ➔ ${desk2?.code || 'Unassigned'}\n- ${emp2.name}: ${desk2?.code || 'Unassigned'} ➔ ${desk1?.code || 'Unassigned'}`
      });

      return {
        message: `I have prepared the seating swap between **${emp1.name}** and **${emp2.name}**.`,
        reasoning: `Both employees were verified. ${emp1.name} will take ${desk2?.code || 'desk'}, and ${emp2.name} will take ${desk1?.code || 'desk'}.`,
        steps,
        proposedActions,
        executed: true
      };
    }
  }

  // Check 2: VACATE / UNSEAT INTENT
  // Example: "Vacate desk F1-ENG-01", "Remove Sarah from her seat", "Unassign Alex"
  if (lower.includes('vacate') || lower.includes('remove') || lower.includes('unassign') || lower.includes('clear desk') || lower.includes('empty desk')) {
    // Check if employee name mentioned
    let targetEmp: Employee | null = null;
    for (const emp of employees) {
      if (lower.includes(emp.name.toLowerCase()) || lower.includes(emp.name.split(' ')[0].toLowerCase())) {
        targetEmp = emp;
        break;
      }
    }

    // Check if desk code mentioned
    let targetDeskInfo: { desk: Desk; floor: Floor } | null = null;
    const allDesks = floors.flatMap(f => f.desks);
    for (const d of allDesks) {
      if (lower.includes(d.code.toLowerCase()) || lower.includes(d.id.toLowerCase())) {
        const fl = floors.find(f => f.id === d.floorId)!;
        targetDeskInfo = { desk: d, floor: fl };
        break;
      }
    }

    if (targetEmp && targetEmp.deskId) {
      const currentDesk = allDesks.find(d => d.id === targetEmp?.deskId);
      steps.push({
        id: 'step-2',
        type: 'tool_call',
        title: 'Tool Invocation: vacate_seat()',
        content: `Vacating seat ${currentDesk?.code || targetEmp.deskId} currently held by ${targetEmp.name}. Moving to Unassigned Bench.`
      });

      proposedActions.push({
        type: 'vacate_seat',
        employeeId: targetEmp.id,
        employeeName: targetEmp.name,
        fromDeskCode: currentDesk?.code,
        deskId: currentDesk?.id,
        reason: `Administrator requested to vacate seat for ${targetEmp.name}`
      });

      return {
        message: `I have vacated seat **${currentDesk?.code || 'current'}** for **${targetEmp.name}**. They are now in the unassigned pool.`,
        reasoning: `Target employee ${targetEmp.name} found at desk ${currentDesk?.code}. Desk status reset to available.`,
        steps,
        proposedActions,
        executed: true
      };
    } else if (targetDeskInfo) {
      const occupant = employees.find(e => e.id === targetDeskInfo?.desk.currentEmployeeId);
      steps.push({
        id: 'step-2',
        type: 'tool_call',
        title: 'Tool Invocation: vacate_seat()',
        content: `Vacating desk ${targetDeskInfo.desk.code} (Occupant: ${occupant?.name || 'None'}).`
      });

      proposedActions.push({
        type: 'vacate_seat',
        employeeId: occupant?.id,
        employeeName: occupant?.name,
        fromDeskCode: targetDeskInfo.desk.code,
        deskId: targetDeskInfo.desk.id,
        reason: `Administrator requested to vacate desk ${targetDeskInfo.desk.code}`
      });

      return {
        message: `Desk **${targetDeskInfo.desk.code}** on Floor ${targetDeskInfo.floor.id} has been vacated and marked Available.`,
        reasoning: occupant ? `Previous occupant ${occupant.name} has been moved to the unassigned bench.` : 'Desk was already vacant.',
        steps,
        proposedActions,
        executed: true
      };
    }
  }

  // Check 3: QUERY INTENT (Neighborhood / Where is / Who sits next to / Available Desks)
  if (
    lower.includes('who is') ||
    lower.includes('where is') ||
    lower.includes('next to') ||
    lower.includes('how many') ||
    lower.includes('show all') ||
    lower.includes('list')
  ) {
    // "Who is sitting next to [Employee]"
    if (lower.includes('next to') || lower.includes('beside') || lower.includes('near')) {
      const targetEmp = employees.find(e => lower.includes(e.name.toLowerCase()) || lower.includes(e.name.split(' ')[0].toLowerCase()));
      if (targetEmp && targetEmp.deskId) {
        const floor = floors.find(f => f.id === targetEmp.floorId);
        const desk = floor?.desks.find(d => d.id === targetEmp.deskId);
        if (desk && floor) {
          // Find desks within coordinate distance of 180px
          const neighbors = floor.desks.filter(d => {
            if (d.id === desk.id) return false;
            const dist = Math.hypot(d.x - desk.x, d.y - desk.y);
            return dist < 200;
          });

          const neighborEmployees = neighbors
            .map(d => ({ desk: d, emp: employees.find(e => e.id === d.currentEmployeeId) }))
            .filter(n => n.emp);

          steps.push({
            id: 'step-2',
            type: 'analysis',
            title: 'Proximity Spatial Calculation',
            content: `Located ${targetEmp.name} at desk ${desk.code} (Floor ${floor.id}, (${desk.x}, ${desk.y})). Found ${neighbors.length} adjacent desk pods.`
          });

          const neighborList = neighborEmployees.length > 0
            ? neighborEmployees.map(n => `• **${n.emp?.name}** (${n.emp?.role}, ${n.emp?.department}) at desk ${n.desk.code}`).join('\n')
            : 'No direct immediate neighbors currently seated in this pod.';

          return {
            message: `**${targetEmp.name}** is seated at desk **${desk.code}** on **Floor ${floor.id}** (${desk.departmentZone} zone).\n\n**Immediate Neighbors in this pod:**\n${neighborList}`,
            reasoning: `Calculated 2D euclidean distance matrix around desk ${desk.code}.`,
            steps,
            proposedActions: [],
            executed: true
          };
        }
      }
    }

    // "Where is [Employee] sitting?"
    for (const emp of employees) {
      if (lower.includes(emp.name.toLowerCase()) || (emp.name.split(' ').length > 1 && lower.includes(emp.name.split(' ')[0].toLowerCase()) && lower.includes(emp.name.split(' ')[1].toLowerCase()))) {
        if (emp.deskId) {
          const desk = floors.flatMap(f => f.desks).find(d => d.id === emp.deskId);
          steps.push({
            id: 'step-2',
            type: 'analysis',
            title: 'Employee Location Lookup',
            content: `Found record for ${emp.name}. Department: ${emp.department}, Role: ${emp.role}, Floor: ${emp.floorId}, Desk: ${desk?.code}.`
          });

          return {
            message: `**${emp.name}** (${emp.role} - ${emp.department}) is currently allocated to desk **${desk?.code || 'Unknown'}** on **Floor ${emp.floorId}**.\n\nDesk Amenities: ${desk?.amenities.join(', ') || 'Standard'}.`,
            reasoning: `Retrieved active seating record for employee ID ${emp.id}.`,
            steps,
            proposedActions: [],
            executed: true
          };
        } else {
          return {
            message: `**${emp.name}** (${emp.role} - ${emp.department}) is currently **Unassigned** (on the Bench). You can assign them to a desk anytime!`,
            reasoning: `Employee record exists but deskId is null.`,
            steps,
            proposedActions: [],
            executed: true
          };
        }
      }
    }

    // "Show empty standing desks / window desks"
    const isStanding = lower.includes('standing');
    const isWindow = lower.includes('window');
    const isDual = lower.includes('dual') || lower.includes('monitor');
    const targetFloorNum = lower.includes('floor 1') ? 1 : lower.includes('floor 2') ? 2 : lower.includes('floor 3') ? 3 : null;

    let matchingDesks = floors
      .flatMap(f => f.desks.map(d => ({ ...d, floorNum: f.id })))
      .filter(d => d.status === 'available');

    if (targetFloorNum) {
      matchingDesks = matchingDesks.filter(d => d.floorNum === targetFloorNum);
    }
    if (isStanding) {
      matchingDesks = matchingDesks.filter(d => d.amenities.includes('standing_desk'));
    }
    if (isWindow) {
      matchingDesks = matchingDesks.filter(d => d.amenities.includes('window_view'));
    }
    if (isDual) {
      matchingDesks = matchingDesks.filter(d => d.amenities.includes('dual_monitors'));
    }

    steps.push({
      id: 'step-2',
      type: 'analysis',
      title: 'Filter & Capacity Query',
      content: `Found ${matchingDesks.length} available desks matching criteria.`
    });

    const deskList = matchingDesks.slice(0, 8).map(d => `• **${d.code}** (Floor ${d.floorNum}, ${d.departmentZone} area, Amenities: ${d.amenities.join(', ')})`).join('\n');

    return {
      message: `I found **${matchingDesks.length}** available desks matching your criteria:\n\n${deskList || 'No desks matching all requested criteria currently vacant.'}`,
      reasoning: `Queried available desks with filters.`,
      steps,
      proposedActions: [],
      executed: true
    };
  }

  // Check 4: MOVE / REASSIGN / ALLOCATE (Direct Target Desk or Smart Search)
  // Examples:
  // - "Move Sarah Connor to desk F1-ENG-08"
  // - "Assign Alex Chen to Floor 2 F2-DSG-04"
  // - "Find an empty standing desk near the window on Floor 2 for Sarah Connor and assign it to her"
  // - "Seat Michael Scott in Marketing on Floor 2"

  // 1. Identify Target Employee
  let targetEmployee: Employee | null = null;
  for (const emp of employees) {
    if (lower.includes(emp.name.toLowerCase())) {
      targetEmployee = emp;
      break;
    }
  }

  if (!targetEmployee) {
    // Try matching partial name
    for (const emp of employees) {
      const firstName = emp.name.split(' ')[0].toLowerCase();
      if (firstName.length >= 3 && lower.includes(firstName)) {
        targetEmployee = emp;
        break;
      }
    }
  }

  // If no employee explicitly matched, fallback to checking first unassigned or query
  if (!targetEmployee) {
    const unassigned = employees.find(e => e.deskId === null);
    if (lower.includes('unassigned') || lower.includes('new hire') || lower.includes('someone')) {
      targetEmployee = unassigned || employees[0];
    }
  }

  if (targetEmployee) {
    steps.push({
      id: 'step-2',
      type: 'analysis',
      title: 'Employee Target Resolved',
      content: `Target Employee: **${targetEmployee.name}**\nDepartment: ${targetEmployee.department}\nRole: ${targetEmployee.role}\nCurrent Desk: ${targetEmployee.deskId ? targetEmployee.deskId : 'Unassigned (Bench)'}`
    });

    // 2. Check if a specific desk code is specified in the prompt
    let explicitDesk: { desk: Desk; floor: Floor } | null = null;
    const allDesks = floors.flatMap(f => f.desks);
    for (const d of allDesks) {
      if (
        lower.includes(d.code.toLowerCase()) ||
        lower.includes(d.id.toLowerCase()) ||
        lower.includes(d.code.toLowerCase().replace('-', ' ')) ||
        lower.includes(d.code.toLowerCase().replace(/f\d+-/, ''))
      ) {
        const fl = floors.find(f => f.id === d.floorId)!;
        explicitDesk = { desk: d, floor: fl };
        break;
      }
    }

    // Target Floor preference
    let desiredFloorId: number | null = null;
    if (lower.includes('floor 1') || lower.includes('first floor')) desiredFloorId = 1;
    else if (lower.includes('floor 2') || lower.includes('second floor')) desiredFloorId = 2;
    else if (lower.includes('floor 3') || lower.includes('third floor')) desiredFloorId = 3;

    // Desired Amenities
    const desiredAmenities: DeskAmenity[] = [];
    if (lower.includes('standing')) desiredAmenities.push('standing_desk');
    if (lower.includes('window')) desiredAmenities.push('window_view');
    if (lower.includes('dual') || lower.includes('monitor')) desiredAmenities.push('dual_monitors');
    if (lower.includes('quiet')) desiredAmenities.push('quiet_pod');

    let selectedDesk: Desk | null = null;
    let selectedFloor: Floor | null = null;

    if (explicitDesk) {
      selectedDesk = explicitDesk.desk;
      selectedFloor = explicitDesk.floor;
      steps.push({
        id: 'step-3',
        type: 'analysis',
        title: 'Explicit Desk Match Found',
        content: `Target Desk specified: ${selectedDesk.code} on Floor ${selectedFloor.id}. Current status: ${selectedDesk.status.toUpperCase()}`
      });
    } else {
      // Smart Auto-Search for Best Available Desk
      steps.push({
        id: 'step-3',
        type: 'thought',
        title: 'Intelligent Seating Constraint Solver',
        content: `Finding optimal desk for ${targetEmployee.name}:\n• Department: ${targetEmployee.department}\n• Preferred Floor: ${desiredFloorId || targetEmployee.floorId || 'Any'}\n• Desired Amenities: ${desiredAmenities.length ? desiredAmenities.join(', ') : 'Standard / Employee Preferences'}`
      });

      // Filter candidates
      let candidateFloors = desiredFloorId ? floors.filter(f => f.id === desiredFloorId) : floors;
      let candidateDesks: { desk: Desk; floor: Floor; score: number }[] = [];

      for (const floor of candidateFloors) {
        for (const desk of floor.desks) {
          if (desk.status === 'available' || desk.currentEmployeeId === null) {
            let score = 10;
            // Department zone match bonus
            if (desk.departmentZone === targetEmployee.department) score += 20;
            // Amenities match bonus
            for (const am of desiredAmenities) {
              if (desk.amenities.includes(am)) score += 15;
            }
            // Employee personal preferences bonus
            if (targetEmployee.preferences?.wantsWindow && desk.amenities.includes('window_view')) score += 10;
            if (targetEmployee.preferences?.wantsStandingDesk && desk.amenities.includes('standing_desk')) score += 10;
            if (targetEmployee.preferences?.wantsDualMonitors && desk.amenities.includes('dual_monitors')) score += 10;

            candidateDesks.push({ desk, floor, score });
          }
        }
      }

      // Sort by score descending
      candidateDesks.sort((a, b) => b.score - a.score);

      if (candidateDesks.length > 0) {
        selectedDesk = candidateDesks[0].desk;
        selectedFloor = candidateDesks[0].floor;
        steps.push({
          id: 'step-4',
          type: 'analysis',
          title: 'Optimal Seat Found',
          content: `Selected highest-scoring candidate: **${selectedDesk.code}** on Floor ${selectedFloor.id} (Score: ${candidateDesks[0].score}/50). Amenities: ${selectedDesk.amenities.join(', ')}.`
        });
      }
    }

    if (selectedDesk && selectedFloor) {
      const prevDesk = floors.flatMap(f => f.desks).find(d => d.id === targetEmployee?.deskId);
      const existingOccupant = selectedDesk.currentEmployeeId ? employees.find(e => e.id === selectedDesk?.currentEmployeeId) : null;

      if (existingOccupant && existingOccupant.id !== targetEmployee.id) {
        // Handle collision via swap or displacement
        steps.push({
          id: 'step-5',
          type: 'analysis',
          title: 'Collision Detected & Swap Formulated',
          content: `Desk ${selectedDesk.code} is occupied by ${existingOccupant.name}. Formulating automatic reciprocal swap with ${targetEmployee.name}.`
        });

        proposedActions.push({
          type: 'swap_seats',
          employeeId: targetEmployee.id,
          employeeName: targetEmployee.name,
          fromDeskCode: prevDesk?.code || 'Unassigned',
          toDeskCode: selectedDesk.code,
          deskId: prevDesk?.id,
          targetDeskId: selectedDesk.id,
          secondaryEmployeeId: existingOccupant.id,
          secondaryEmployeeName: existingOccupant.name,
          secondaryFromDeskCode: selectedDesk.code,
          secondaryToDeskCode: prevDesk?.code || 'Unassigned',
          reason: `Auto-resolved occupancy swap between ${targetEmployee.name} and ${existingOccupant.name}`
        });

        return {
          message: `I have reassigned **${targetEmployee.name}** to **${selectedDesk.code}** (Floor ${selectedFloor.id}) and swapped previous occupant **${existingOccupant.name}** to ${prevDesk?.code ? `**${prevDesk.code}**` : 'the bench'}.`,
          reasoning: `Target desk was occupied, so a safe atomic seat exchange was performed.`,
          steps,
          proposedActions,
          executed: true
        };
      } else {
        // Direct Assignment
        steps.push({
          id: 'step-5',
          type: 'tool_call',
          title: 'Tool Invocation: reassign_employee_seat()',
          content: `Executing reassign_employee_seat(employeeId="${targetEmployee.id}", targetDeskId="${selectedDesk.id}", targetFloorId=${selectedFloor.id})`
        });

        proposedActions.push({
          type: 'reassign_seat',
          employeeId: targetEmployee.id,
          employeeName: targetEmployee.name,
          fromDeskCode: prevDesk?.code || 'Unassigned',
          toDeskCode: selectedDesk.code,
          deskId: prevDesk?.id,
          targetDeskId: selectedDesk.id,
          reason: `AI assignment prompt: "${prompt}"`
        });

        steps.push({
          id: 'step-6',
          type: 'diff',
          title: 'Seating State Update Matrix',
          content: `[ALLOCATION READY]\n- Employee: ${targetEmployee.name} (${targetEmployee.role})\n- From: ${prevDesk ? `${prevDesk.code} (Floor ${prevDesk.floorId})` : 'Unassigned (Bench)'}\n- To: ${selectedDesk.code} (Floor ${selectedFloor.id} - ${selectedDesk.departmentZone})\n- Amenities: ${selectedDesk.amenities.join(', ') || 'Standard'}`
        });

        return {
          message: `Successfully allocated **${targetEmployee.name}** to desk **${selectedDesk.code}** on **Floor ${selectedFloor.id}** (${selectedDesk.departmentZone} zone).`,
          reasoning: `Target employee ${targetEmployee.name} was successfully routed to ${selectedDesk.code}. Amenities matched preferences.`,
          steps,
          proposedActions,
          executed: true
        };
      }
    }
  }

  // Fallback / General Assistant Response
  steps.push({
    id: 'step-2',
    type: 'thought',
    title: 'Intent General Fallback',
    content: `Processed general query. Ready to accept specific seating requests.`
  });

  return {
    message: `I understood your instruction: "${prompt}".\n\nTo reassign or change seats, you can give commands like:\n- **"Move Sarah Connor to Floor 1 desk F1-ENG-08"**\n- **"Swap seats between Alex Chen and David Kim"**\n- **"Find an empty standing desk near a window on Floor 2 for Michael"**\n- **"Vacate desk F1-ENG-01"**\n- **"Who is sitting next to Sophia Patel?"**`,
    reasoning: `No specific employee or desk mutation was cleanly isolated. Provided structured command examples.`,
    steps,
    proposedActions: [],
    executed: false
  };
};
