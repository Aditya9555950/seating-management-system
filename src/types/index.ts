export type Department =
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance'
  | 'Operations'
  | 'Executive';

export type DeskAmenity =
  | 'window_view'
  | 'standing_desk'
  | 'dual_monitors'
  | 'quiet_pod'
  | 'near_exit'
  | 'near_coffee'
  | 'accessible';

export type DeskType = 'standard' | 'standing' | 'executive' | 'hot_desk' | 'collab';

export type DeskStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface EmployeePreferences {
  wantsWindow?: boolean;
  wantsStandingDesk?: boolean;
  wantsDualMonitors?: boolean;
  prefersQuietZone?: boolean;
  preferredFloor?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  avatar: string;
  phone?: string;
  joinedDate?: string;
  deskId: string | null; // null if unassigned / bench
  floorId: number | null;
  preferences?: EmployeePreferences;
  status?: 'active' | 'remote' | 'on_leave';
}

export interface Desk {
  id: string;
  code: string; // e.g. "F1-E101"
  floorId: number;
  x: number; // grid or canvas coordinates
  y: number;
  width?: number;
  height?: number;
  status: DeskStatus;
  currentEmployeeId: string | null;
  departmentZone: Department;
  amenities: DeskAmenity[];
  type: DeskType;
  notes?: string;
}

export interface OfficeZone {
  id: string;
  name: string;
  type: 'meeting_room' | 'breakout' | 'kitchen' | 'restroom' | 'elevator' | 'terrace' | 'wellness' | 'server_room';
  x: number;
  y: number;
  width: number;
  height: number;
  capacity?: number;
  amenities?: string[];
  color?: string;
}

export interface Floor {
  id: number;
  name: string;
  subtitle: string;
  level: number;
  dimensions: {
    width: number;
    height: number;
  };
  zones: OfficeZone[];
  desks: Desk[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: 'assign' | 'swap' | 'vacate' | 'status_change' | 'batch_move' | 'create_employee';
  description: string;
  actor: 'Admin' | 'AI Assistant' | 'Drag & Drop' | 'Auto Optimizer';
  details?: {
    employeeId?: string;
    employeeName?: string;
    fromDeskId?: string | null;
    toDeskId?: string | null;
    fromFloor?: number | null;
    toFloor?: number | null;
    previousState?: any;
  };
  canUndo?: boolean;
  undone?: boolean;
}

export type AIStepType = 'thought' | 'analysis' | 'tool_call' | 'diff' | 'execution' | 'success' | 'error';

export interface AIStep {
  id: string;
  type: AIStepType;
  title: string;
  content: string;
  meta?: any;
}

export interface AIProposedAction {
  type: 'reassign_seat' | 'swap_seats' | 'vacate_seat' | 'batch_assign' | 'update_desk_status';
  employeeId?: string;
  employeeName?: string;
  fromDeskCode?: string;
  toDeskCode?: string;
  deskId?: string;
  targetDeskId?: string;
  secondaryEmployeeId?: string;
  secondaryEmployeeName?: string;
  secondaryFromDeskCode?: string;
  secondaryToDeskCode?: string;
  newStatus?: DeskStatus;
  reason?: string;
}

export interface AICommandResult {
  message: string;
  reasoning: string;
  steps: AIStep[];
  proposedActions: AIProposedAction[];
  executed: boolean;
  queryResults?: any;
}

export interface AISettings {
  provider: 'local' | 'gemini' | 'groq';
  geminiApiKey: string;
  geminiModel: string;
  groqApiKey: string;
  groqModel: string;
  autoExecute: boolean; // if true, execute without asking confirm
}
