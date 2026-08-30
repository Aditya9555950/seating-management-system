import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Employee,
  Floor,
  Desk,
  Department,
  DeskAmenity,
  DeskStatus,
  AuditLog,
  AISettings,
  AIProposedAction
} from '../types';
import { INITIAL_EMPLOYEES, INITIAL_FLOORS } from '../data/initialData';

interface SeatingContextType {
  floors: Floor[];
  employees: Employee[];
  activeFloorId: number;
  selectedDeskId: string | null;
  selectedEmployeeId: string | null;
  searchQuery: string;
  selectedDepartmentFilter: Department | 'All';
  selectedAmenityFilter: DeskAmenity | 'All';
  auditLogs: AuditLog[];
  aiSettings: AISettings;
  highlightedDeskIds: string[];

  // UI Drawer/Modal state
  isAiDrawerOpen: boolean;
  isEmployeeDirectoryOpen: boolean;
  isAddEmployeeOpen: boolean;
  isSettingsOpen: boolean;
  isAnalyticsOpen: boolean;
  isAuditLogOpen: boolean;

  // Setters
  setActiveFloorId: (id: number) => void;
  setSelectedDeskId: (id: string | null) => void;
  setSelectedEmployeeId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedDepartmentFilter: (dept: Department | 'All') => void;
  setSelectedAmenityFilter: (amenity: DeskAmenity | 'All') => void;
  setHighlightedDeskIds: (ids: string[]) => void;
  setIsAiDrawerOpen: (open: boolean) => void;
  setIsEmployeeDirectoryOpen: (open: boolean) => void;
  setIsAddEmployeeOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsAnalyticsOpen: (open: boolean) => void;
  setIsAuditLogOpen: (open: boolean) => void;

  // Core Business Operations
  reassignSeat: (employeeId: string, targetDeskId: string, actor?: string, triggerConfetti?: boolean) => boolean;
  swapSeats: (emp1Id: string, emp2Id: string, actor?: string) => boolean;
  vacateSeat: (deskIdOrEmpId: string, actor?: string) => boolean;
  addEmployee: (newEmp: Omit<Employee, 'id'>) => Employee;
  updateDeskStatus: (deskId: string, status: DeskStatus) => void;
  updateDeskAmenities: (deskId: string, amenities: DeskAmenity[]) => void;
  undoAction: (logId: string) => void;
  executeAiProposedActions: (actions: AIProposedAction[], promptDescription?: string) => void;
  updateAiSettings: (settings: Partial<AISettings>) => void;
  resetToDefaults: () => void;
  exportLayoutToJson: () => string;
  importLayoutFromJson: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  FLOORS: 'nexus_seating_floors_v2',
  EMPLOYEES: 'nexus_seating_employees_v2',
  AUDIT_LOGS: 'nexus_seating_audit_logs_v2',
  AI_SETTINGS: 'nexus_seating_ai_settings_v2',
};

const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'local',
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  groqApiKey: '',
  groqModel: 'llama-3.3-70b-versatile',
  autoExecute: true,
};

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to initial data
  const [floors, setFloors] = useState<Floor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLOORS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FLOORS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EMPLOYEES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'log-init',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actionType: 'create_employee',
        description: 'Nexus Seating Management System initialized with 3 floor layouts & 26 team members.',
        actor: 'Admin',
        canUndo: false,
      }
    ];
  });

  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
    if (saved) {
      try { return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
    }
    return DEFAULT_AI_SETTINGS;
  });

  // UI Selection States
  const [activeFloorId, setActiveFloorId] = useState<number>(1);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<Department | 'All'>('All');
  const [selectedAmenityFilter, setSelectedAmenityFilter] = useState<DeskAmenity | 'All'>('All');
  const [highlightedDeskIds, setHighlightedDeskIds] = useState<string[]>([]);

  // Modals & Panels
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isEmployeeDirectoryOpen, setIsEmployeeDirectoryOpen] = useState<boolean>(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLOORS, JSON.stringify(floors));
  }, [floors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(aiSettings));
  }, [aiSettings]);

  // Helper for triggering fun celebratory confetti
  const triggerSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      // ignore in tests
    }
  };

  // Helper to add audit log
  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...log,
      canUndo: log.canUndo !== false,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. REASSIGN SEAT
  const reassignSeat = (
    employeeId: string,
    targetDeskId: string,
    actor: string = 'Admin',
    triggerConfetti: boolean = true
  ): boolean => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return false;

    // Locate target desk across floors
    let targetDesk: Desk | undefined;
    let targetFloor: Floor | undefined;

    for (const f of floors) {
      const d = f.desks.find(dk => dk.id === targetDeskId);
      if (d) {
        targetDesk = d;
        targetFloor = f;
        break;
      }
    }

    if (!targetDesk || !targetFloor) return false;

    const oldDeskId = emp.deskId;
    const oldFloorId = emp.floorId;
    const previousOccupantId = targetDesk.currentEmployeeId;

    // Update Floormap and Desks
    setFloors(prevFloors => {
      return prevFloors.map(floor => {
        const updatedDesks = floor.desks.map(desk => {
          // If this was the employee's old desk, make it available
          if (oldDeskId && desk.id === oldDeskId && desk.id !== targetDeskId) {
            return {
              ...desk,
              status: 'available' as DeskStatus,
              currentEmployeeId: null
            };
          }

          // If this is the new target desk
          if (desk.id === targetDeskId) {
            return {
              ...desk,
              status: 'occupied' as DeskStatus,
              currentEmployeeId: employeeId
            };
          }

          return desk;
        });

        return { ...floor, desks: updatedDesks };
      });
    });

    // Update Employees
    setEmployees(prevEmps => {
      return prevEmps.map(e => {
        // If target desk had previous occupant, move them to old desk or bench
        if (previousOccupantId && e.id === previousOccupantId && e.id !== employeeId) {
          return {
            ...e,
            deskId: oldDeskId || null,
            floorId: oldFloorId || null,
          };
        }

        // Target employee gets new desk and floor
        if (e.id === employeeId) {
          return {
            ...e,
            deskId: targetDeskId,
            floorId: targetFloor!.id,
          };
        }

        return e;
      });
    });

    // Highlight target desk
    setHighlightedDeskIds([targetDeskId]);
    setTimeout(() => setHighlightedDeskIds([]), 3500);

    // Add Audit Log
    addLog({
      actionType: 'assign',
      description: `Assigned ${emp.name} (${emp.department}) to desk ${targetDesk.code} on Floor ${targetFloor.id}`,
      actor: actor as any,
      details: {
        employeeId: emp.id,
        employeeName: emp.name,
        fromDeskId: oldDeskId,
        toDeskId: targetDeskId,
        fromFloor: oldFloorId,
        toFloor: targetFloor.id,
        previousState: {
          empId: emp.id,
          oldDeskId,
          oldFloorId,
          displacedOccupantId: previousOccupantId,
        }
      }
    });

    if (triggerConfetti) triggerSuccessConfetti();
    return true;
  };

  // 2. SWAP SEATS
  const swapSeats = (emp1Id: string, emp2Id: string, actor: string = 'Admin'): boolean => {
    const emp1 = employees.find(e => e.id === emp1Id);
    const emp2 = employees.find(e => e.id === emp2Id);
    if (!emp1 || !emp2) return false;

    const desk1Id = emp1.deskId;
    const floor1Id = emp1.floorId;
    const desk2Id = emp2.deskId;
    const floor2Id = emp2.floorId;

    const allDesks = floors.flatMap(f => f.desks);
    const desk1 = allDesks.find(d => d.id === desk1Id);
    const desk2 = allDesks.find(d => d.id === desk2Id);

    // Update Floors
    setFloors(prevFloors => {
      return prevFloors.map(floor => {
        const updatedDesks = floor.desks.map(desk => {
          if (desk1Id && desk.id === desk1Id) {
            return {
              ...desk,
              status: (desk2Id ? 'occupied' : 'available') as DeskStatus,
              currentEmployeeId: desk2Id ? emp2Id : null,
            };
          }
          if (desk2Id && desk.id === desk2Id) {
            return {
              ...desk,
              status: (desk1Id ? 'occupied' : 'available') as DeskStatus,
              currentEmployeeId: desk1Id ? emp1Id : null,
            };
          }
          return desk;
        });
        return { ...floor, desks: updatedDesks };
      });
    });

    // Update Employees
    setEmployees(prevEmps => {
      return prevEmps.map(e => {
        if (e.id === emp1Id) {
          return { ...e, deskId: desk2Id, floorId: floor2Id };
        }
        if (e.id === emp2Id) {
          return { ...e, deskId: desk1Id, floorId: floor1Id };
        }
        return e;
      });
    });

    const highlightList = [desk1Id, desk2Id].filter(Boolean) as string[];
    setHighlightedDeskIds(highlightList);
    setTimeout(() => setHighlightedDeskIds([]), 3500);

    addLog({
      actionType: 'swap',
      description: `Swapped seats between ${emp1.name} (${desk1?.code || 'Bench'}) and ${emp2.name} (${desk2?.code || 'Bench'})`,
      actor: actor as any,
      details: {
        employeeId: emp1.id,
        employeeName: emp1.name,
        fromDeskId: desk1Id,
        toDeskId: desk2Id,
        previousState: { emp1Id, desk1Id, floor1Id, emp2Id, desk2Id, floor2Id }
      }
    });

    triggerSuccessConfetti();
    return true;
  };

  // 3. VACATE SEAT
  const vacateSeat = (deskIdOrEmpId: string, actor: string = 'Admin'): boolean => {
    const allDesks = floors.flatMap(f => f.desks);
    const desk = allDesks.find(d => d.id === deskIdOrEmpId);
    const emp = employees.find(e => e.id === deskIdOrEmpId || (desk && e.id === desk.currentEmployeeId));

    if (!desk && !emp) return false;

    const targetDeskId = desk?.id || emp?.deskId;
    const targetDesk = allDesks.find(d => d.id === targetDeskId);

    if (targetDeskId) {
      setFloors(prevFloors => {
        return prevFloors.map(floor => ({
          ...floor,
          desks: floor.desks.map(d => {
            if (d.id === targetDeskId) {
              return { ...d, status: 'available', currentEmployeeId: null };
            }
            return d;
          })
        }));
      });
    }

    if (emp) {
      setEmployees(prevEmps => {
        return prevEmps.map(e => {
          if (e.id === emp.id) {
            return { ...e, deskId: null, floorId: null };
          }
          return e;
        });
      });
    }

    addLog({
      actionType: 'vacate',
      description: `Vacated desk ${targetDesk?.code || 'assigned seat'} (Employee: ${emp?.name || 'Unassigned'})`,
      actor: actor as any,
      details: {
        employeeId: emp?.id,
        employeeName: emp?.name,
        fromDeskId: targetDeskId,
        previousState: { empId: emp?.id, deskId: targetDeskId, floorId: emp?.floorId }
      }
    });

    return true;
  };

  // 4. ADD NEW EMPLOYEE
  const addEmployee = (newEmp: Omit<Employee, 'id'>): Employee => {
    const created: Employee = {
      ...newEmp,
      id: `emp-${Date.now()}`,
    };

    setEmployees(prev => [created, ...prev]);

    addLog({
      actionType: 'create_employee',
      description: `Added new employee ${created.name} (${created.role}, ${created.department}) to Directory`,
      actor: 'Admin',
      canUndo: false,
    });

    return created;
  };

  // 5. UPDATE DESK STATUS (Maintenance / Reserved / Available)
  const updateDeskStatus = (deskId: string, status: DeskStatus) => {
    setFloors(prevFloors => {
      return prevFloors.map(floor => ({
        ...floor,
        desks: floor.desks.map(d => {
          if (d.id === deskId) {
            return {
              ...d,
              status,
              // If set to maintenance, remove employee
              currentEmployeeId: status === 'maintenance' ? null : d.currentEmployeeId
            };
          }
          return d;
        })
      }));
    });

    addLog({
      actionType: 'status_change',
      description: `Updated desk status to ${status.toUpperCase()}`,
      actor: 'Admin',
      canUndo: false
    });
  };

  // 6. UPDATE DESK AMENITIES
  const updateDeskAmenities = (deskId: string, amenities: DeskAmenity[]) => {
    setFloors(prevFloors => {
      return prevFloors.map(floor => ({
        ...floor,
        desks: floor.desks.map(d => (d.id === deskId ? { ...d, amenities } : d))
      }));
    });
  };

  // 7. UNDO ACTION
  const undoAction = (logId: string) => {
    const log = auditLogs.find(l => l.id === logId);
    if (!log || !log.details?.previousState || log.undone) return;

    const { previousState } = log.details;

    if (log.actionType === 'assign') {
      const { empId, oldDeskId, oldFloorId } = previousState;
      // Revert employee back to old desk
      setEmployees(prev => prev.map(e => e.id === empId ? { ...e, deskId: oldDeskId || null, floorId: oldFloorId || null } : e));
      // Revert desks
      setFloors(prevFloors => prevFloors.map(f => ({
        ...f,
        desks: f.desks.map(d => {
          if (d.id === log.details?.toDeskId) return { ...d, status: 'available', currentEmployeeId: null };
          if (oldDeskId && d.id === oldDeskId) return { ...d, status: 'occupied', currentEmployeeId: empId };
          return d;
        })
      })));
    } else if (log.actionType === 'swap') {
      const { emp1Id, desk1Id, floor1Id, emp2Id, desk2Id, floor2Id } = previousState;
      setEmployees(prev => prev.map(e => {
        if (e.id === emp1Id) return { ...e, deskId: desk1Id, floorId: floor1Id };
        if (e.id === emp2Id) return { ...e, deskId: desk2Id, floorId: floor2Id };
        return e;
      }));
      setFloors(prevFloors => prevFloors.map(f => ({
        ...f,
        desks: f.desks.map(d => {
          if (desk1Id && d.id === desk1Id) return { ...d, currentEmployeeId: emp1Id, status: 'occupied' };
          if (desk2Id && d.id === desk2Id) return { ...d, currentEmployeeId: emp2Id, status: 'occupied' };
          return d;
        })
      })));
    }

    // Mark log as undone
    setAuditLogs(prev => prev.map(l => l.id === logId ? { ...l, undone: true } : l));
  };

  // 8. EXECUTE AI PROPOSED ACTIONS
  const executeAiProposedActions = (actions: AIProposedAction[], promptDescription?: string) => {
    actions.forEach(act => {
      if (act.type === 'reassign_seat' && act.employeeId && act.targetDeskId) {
        reassignSeat(act.employeeId, act.targetDeskId, 'AI Assistant');
      } else if (act.type === 'swap_seats' && act.employeeId && act.secondaryEmployeeId) {
        swapSeats(act.employeeId, act.secondaryEmployeeId, 'AI Assistant');
      } else if (act.type === 'vacate_seat' && (act.deskId || act.employeeId)) {
        vacateSeat(act.deskId || act.employeeId!, 'AI Assistant');
      }
    });

    // If active floor doesn't contain the modified desk, switch active floor to it
    const allDesks = floors.flatMap(f => f.desks);
    const firstActionDeskId = actions[0]?.targetDeskId || actions[0]?.deskId;
    if (firstActionDeskId) {
      const targetDesk = allDesks.find(d => d.id === firstActionDeskId);
      if (targetDesk && targetDesk.floorId !== activeFloorId) {
        setActiveFloorId(targetDesk.floorId);
      }
    }
  };

  // 9. AI SETTINGS
  const updateAiSettings = (settings: Partial<AISettings>) => {
    setAiSettings(prev => ({ ...prev, ...settings }));
  };

  // 10. RESET TO DEFAULTS
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.FLOORS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    setFloors(INITIAL_FLOORS);
    setEmployees(INITIAL_EMPLOYEES);
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actionType: 'create_employee',
        description: 'Reset office layout and employee seating to default initial configuration.',
        actor: 'Admin',
        canUndo: false,
      }
    ]);
  };

  // 11. EXPORT / IMPORT
  const exportLayoutToJson = (): string => {
    return JSON.stringify({ floors, employees, auditLogs, exportDate: new Date().toISOString() }, null, 2);
  };

  const importLayoutFromJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.floors && parsed.employees) {
        setFloors(parsed.floors);
        setEmployees(parsed.employees);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <SeatingContext.Provider
      value={{
        floors,
        employees,
        activeFloorId,
        selectedDeskId,
        selectedEmployeeId,
        searchQuery,
        selectedDepartmentFilter,
        selectedAmenityFilter,
        auditLogs,
        aiSettings,
        highlightedDeskIds,
        isAiDrawerOpen,
        isEmployeeDirectoryOpen,
        isAddEmployeeOpen,
        isSettingsOpen,
        isAnalyticsOpen,
        isAuditLogOpen,

        setActiveFloorId,
        setSelectedDeskId,
        setSelectedEmployeeId,
        setSearchQuery,
        setSelectedDepartmentFilter,
        setSelectedAmenityFilter,
        setHighlightedDeskIds,
        setIsAiDrawerOpen,
        setIsEmployeeDirectoryOpen,
        setIsAddEmployeeOpen,
        setIsSettingsOpen,
        setIsAnalyticsOpen,
        setIsAuditLogOpen,

        reassignSeat,
        swapSeats,
        vacateSeat,
        addEmployee,
        updateDeskStatus,
        updateDeskAmenities,
        undoAction,
        executeAiProposedActions,
        updateAiSettings,
        resetToDefaults,
        exportLayoutToJson,
        importLayoutFromJson,
      }}
    >
      {children}
    </SeatingContext.Provider>
  );
};

export const useSeating = () => {
  const context = useContext(SeatingContext);
  if (!context) {
    throw new Error('useSeating must be used within a SeatingProvider');
  }
  return context;
};
