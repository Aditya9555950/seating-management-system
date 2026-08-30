import { Employee, Floor, Desk, OfficeZone } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  // --- Floor 1: Engineering & Product ---
  {
    id: 'emp-1',
    name: 'Alex Chen',
    email: 'alex.chen@nexuscorp.internal',
    role: 'Lead Cloud Architect',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    joinedDate: '2022-03-15',
    deskId: 'desk-f1-01',
    floorId: 1,
    preferences: { wantsDualMonitors: true, wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-2',
    name: 'Sophia Patel',
    email: 'sophia.patel@nexuscorp.internal',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-8901',
    joinedDate: '2021-08-10',
    deskId: 'desk-f1-02',
    floorId: 1,
    preferences: { wantsDualMonitors: true, prefersQuietZone: true },
    status: 'active'
  },
  {
    id: 'emp-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexuscorp.internal',
    role: 'Staff DevOps Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    joinedDate: '2020-01-20',
    deskId: 'desk-f1-03',
    floorId: 1,
    preferences: { wantsDualMonitors: true },
    status: 'active'
  },
  {
    id: 'emp-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexuscorp.internal',
    role: 'Full Stack Developer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    joinedDate: '2023-04-12',
    deskId: 'desk-f1-04',
    floorId: 1,
    preferences: { wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-5',
    name: 'David Kim',
    email: 'david.kim@nexuscorp.internal',
    role: 'AI / ML Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    joinedDate: '2022-11-01',
    deskId: 'desk-f1-05',
    floorId: 1,
    preferences: { wantsDualMonitors: true, wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-6',
    name: 'Zoe Washington',
    email: 'zoe.washington@nexuscorp.internal',
    role: 'Principal Product Manager',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012',
    joinedDate: '2021-06-18',
    deskId: 'desk-f1-09',
    floorId: 1,
    preferences: { wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-7',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@nexuscorp.internal',
    role: 'Product Owner - Core Platform',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0123',
    joinedDate: '2023-01-09',
    deskId: 'desk-f1-10',
    floorId: 1,
    preferences: { wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-8',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@nexuscorp.internal',
    role: 'QA Automation Lead',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-1234',
    joinedDate: '2022-09-22',
    deskId: 'desk-f1-06',
    floorId: 1,
    preferences: { prefersQuietZone: true },
    status: 'active'
  },
  {
    id: 'emp-9',
    name: 'Lucas Wright',
    email: 'lucas.wright@nexuscorp.internal',
    role: 'Security Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 901-2345',
    joinedDate: '2022-02-14',
    deskId: 'desk-f1-07',
    floorId: 1,
    preferences: { wantsDualMonitors: true },
    status: 'active'
  },

  // --- Floor 2: Design, Marketing & Sales ---
  {
    id: 'emp-10',
    name: 'Maya Lin',
    email: 'maya.lin@nexuscorp.internal',
    role: 'Head of Brand Design',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 012-3456',
    joinedDate: '2020-05-30',
    deskId: 'desk-f2-01',
    floorId: 2,
    preferences: { wantsWindow: true, wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-11',
    name: 'Oliver Queen',
    email: 'oliver.queen@nexuscorp.internal',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 123-4567',
    joinedDate: '2022-07-11',
    deskId: 'desk-f2-02',
    floorId: 2,
    preferences: { wantsDualMonitors: true, wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-12',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@nexuscorp.internal',
    role: 'Motion & Visual Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    joinedDate: '2023-02-28',
    deskId: 'desk-f2-03',
    floorId: 2,
    preferences: { wantsDualMonitors: true },
    status: 'active'
  },
  {
    id: 'emp-13',
    name: 'Ethan Drake',
    email: 'ethan.drake@nexuscorp.internal',
    role: 'VP of Growth & Marketing',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    joinedDate: '2021-04-15',
    deskId: 'desk-f2-09',
    floorId: 2,
    preferences: { wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-14',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@nexuscorp.internal',
    role: 'Content Strategy Lead',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    joinedDate: '2022-10-05',
    deskId: 'desk-f2-10',
    floorId: 2,
    preferences: { wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-15',
    name: 'Ryan Gosling',
    email: 'ryan.gosling@nexuscorp.internal',
    role: 'Enterprise Account Executive',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    joinedDate: '2021-12-01',
    deskId: 'desk-f2-17',
    floorId: 2,
    preferences: { wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-16',
    name: 'Samantha Ray',
    email: 'samantha.ray@nexuscorp.internal',
    role: 'Regional Sales Manager',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012',
    joinedDate: '2023-03-20',
    deskId: 'desk-f2-18',
    floorId: 2,
    preferences: { wantsWindow: true },
    status: 'active'
  },

  // --- Floor 3: Executive, HR, Finance, Operations ---
  {
    id: 'emp-17',
    name: 'Arthur Pendelton',
    email: 'arthur.pendelton@nexuscorp.internal',
    role: 'Chief Executive Officer',
    department: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0001',
    joinedDate: '2019-01-01',
    deskId: 'desk-f3-01',
    floorId: 3,
    preferences: { wantsWindow: true, wantsStandingDesk: true, prefersQuietZone: true },
    status: 'active'
  },
  {
    id: 'emp-18',
    name: 'Victoria Hastings',
    email: 'victoria.hastings@nexuscorp.internal',
    role: 'Chief Technology Officer',
    department: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0002',
    joinedDate: '2019-03-15',
    deskId: 'desk-f3-02',
    floorId: 3,
    preferences: { wantsWindow: true, wantsDualMonitors: true },
    status: 'active'
  },
  {
    id: 'emp-19',
    name: 'Daniel Morgan',
    email: 'daniel.morgan@nexuscorp.internal',
    role: 'Head of People & Culture',
    department: 'HR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-1234',
    joinedDate: '2020-09-01',
    deskId: 'desk-f3-07',
    floorId: 3,
    preferences: { prefersQuietZone: true },
    status: 'active'
  },
  {
    id: 'emp-20',
    name: 'Rachel Zane',
    email: 'rachel.zane@nexuscorp.internal',
    role: 'Talent Acquisition Partner',
    department: 'HR',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-2345',
    joinedDate: '2022-04-18',
    deskId: 'desk-f3-08',
    floorId: 3,
    preferences: { wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-21',
    name: 'Harvey Specter',
    email: 'harvey.specter@nexuscorp.internal',
    role: 'Chief Financial Officer',
    department: 'Finance',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0003',
    joinedDate: '2020-02-10',
    deskId: 'desk-f3-13',
    floorId: 3,
    preferences: { wantsDualMonitors: true, prefersQuietZone: true },
    status: 'active'
  },
  {
    id: 'emp-22',
    name: 'Donna Paulsen',
    email: 'donna.paulsen@nexuscorp.internal',
    role: 'Director of Workplace Operations',
    department: 'Operations',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0004',
    joinedDate: '2020-02-10',
    deskId: 'desk-f3-15',
    floorId: 3,
    preferences: { wantsStandingDesk: true },
    status: 'active'
  },

  // --- Unassigned Employees (Bench / Pool for allocation) ---
  {
    id: 'emp-23',
    name: 'Sarah Connor',
    email: 'sarah.connor@nexuscorp.internal',
    role: 'Senior CyberSec Analyst',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 333-4455',
    joinedDate: '2024-01-10',
    deskId: null,
    floorId: null,
    preferences: { wantsDualMonitors: true, prefersQuietZone: true, wantsStandingDesk: true },
    status: 'active'
  },
  {
    id: 'emp-24',
    name: 'Michael Scott',
    email: 'michael.scott@nexuscorp.internal',
    role: 'Creative Marketing Lead',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 444-5566',
    joinedDate: '2024-02-01',
    deskId: null,
    floorId: null,
    preferences: { wantsWindow: true },
    status: 'active'
  },
  {
    id: 'emp-25',
    name: 'Pam Beesly',
    email: 'pam.beesly@nexuscorp.internal',
    role: 'UI Designer & Illustrator',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 555-6677',
    joinedDate: '2024-02-15',
    deskId: null,
    floorId: null,
    preferences: { wantsWindow: true, wantsDualMonitors: true },
    status: 'active'
  },
  {
    id: 'emp-26',
    name: 'Jim Halpert',
    email: 'jim.halpert@nexuscorp.internal',
    role: 'Strategic Partnerships Lead',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 666-7788',
    joinedDate: '2024-03-01',
    deskId: null,
    floorId: null,
    preferences: { wantsStandingDesk: true },
    status: 'active'
  }
];

// Helper to generate Floor 1 Desks
const generateFloor1Desks = (): Desk[] => {
  const desks: Desk[] = [];
  // Engineering Pod A (Desks 1 - 8)
  const podA = [
    { id: 'desk-f1-01', code: 'F1-ENG-01', x: 260, y: 140, currentEmployeeId: 'emp-1', amenities: ['window_view', 'standing_desk', 'dual_monitors'], type: 'standing' },
    { id: 'desk-f1-02', code: 'F1-ENG-02', x: 370, y: 140, currentEmployeeId: 'emp-2', amenities: ['dual_monitors', 'quiet_pod'], type: 'standard' },
    { id: 'desk-f1-03', code: 'F1-ENG-03', x: 260, y: 230, currentEmployeeId: 'emp-3', amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f1-04', code: 'F1-ENG-04', x: 370, y: 230, currentEmployeeId: 'emp-4', amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f1-05', code: 'F1-ENG-05', x: 500, y: 140, currentEmployeeId: 'emp-5', amenities: ['dual_monitors', 'standing_desk'], type: 'standing' },
    { id: 'desk-f1-06', code: 'F1-ENG-06', x: 610, y: 140, currentEmployeeId: 'emp-8', amenities: ['quiet_pod'], type: 'standard' },
    { id: 'desk-f1-07', code: 'F1-ENG-07', x: 500, y: 230, currentEmployeeId: 'emp-9', amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f1-08', code: 'F1-ENG-08', x: 610, y: 230, currentEmployeeId: null, amenities: ['dual_monitors', 'near_coffee'], type: 'standard' },
  ];

  // Product Pod (Desks 9 - 14)
  const podB = [
    { id: 'desk-f1-09', code: 'F1-PRD-01', x: 760, y: 140, currentEmployeeId: 'emp-6', amenities: ['window_view', 'near_coffee'], type: 'standard' },
    { id: 'desk-f1-10', code: 'F1-PRD-02', x: 870, y: 140, currentEmployeeId: 'emp-7', amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f1-11', code: 'F1-PRD-03', x: 760, y: 230, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f1-12', code: 'F1-PRD-04', x: 870, y: 230, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f1-13', code: 'F1-PRD-05', x: 1000, y: 140, currentEmployeeId: null, amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f1-14', code: 'F1-PRD-06', x: 1000, y: 230, currentEmployeeId: null, amenities: ['window_view', 'quiet_pod'], type: 'standard' },
  ];

  // Engineering Pod B (Desks 15 - 22)
  const podC = [
    { id: 'desk-f1-15', code: 'F1-ENG-09', x: 260, y: 400, currentEmployeeId: null, amenities: ['standing_desk', 'dual_monitors'], type: 'standing' },
    { id: 'desk-f1-16', code: 'F1-ENG-10', x: 370, y: 400, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f1-17', code: 'F1-ENG-11', x: 260, y: 490, currentEmployeeId: null, amenities: ['accessible'], type: 'standard' },
    { id: 'desk-f1-18', code: 'F1-ENG-12', x: 370, y: 490, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f1-19', code: 'F1-ENG-13', x: 500, y: 400, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f1-20', code: 'F1-ENG-14', x: 610, y: 400, currentEmployeeId: null, amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f1-21', code: 'F1-ENG-15', x: 500, y: 490, currentEmployeeId: null, amenities: ['quiet_pod'], type: 'standard' },
    { id: 'desk-f1-22', code: 'F1-ENG-16', x: 610, y: 490, currentEmployeeId: null, amenities: ['window_view', 'dual_monitors'], type: 'standard' },
  ];

  // Hot Desk & Quiet Pods (Desks 23 - 26)
  const podD = [
    { id: 'desk-f1-23', code: 'F1-HOT-01', x: 760, y: 400, currentEmployeeId: null, amenities: ['standing_desk', 'near_coffee'], type: 'hot_desk' },
    { id: 'desk-f1-24', code: 'F1-HOT-02', x: 870, y: 400, currentEmployeeId: null, amenities: ['near_coffee'], type: 'hot_desk' },
    { id: 'desk-f1-25', code: 'F1-HOT-03', x: 760, y: 490, currentEmployeeId: null, amenities: ['window_view'], type: 'hot_desk' },
    { id: 'desk-f1-26', code: 'F1-HOT-04', x: 870, y: 490, currentEmployeeId: null, amenities: ['window_view', 'standing_desk'], type: 'hot_desk' },
  ];

  [...podA, ...podB, ...podC, ...podD].forEach((item) => {
    desks.push({
      id: item.id,
      code: item.code,
      floorId: 1,
      x: item.x,
      y: item.y,
      width: 90,
      height: 65,
      status: item.currentEmployeeId ? 'occupied' : 'available',
      currentEmployeeId: item.currentEmployeeId,
      departmentZone: item.code.includes('ENG') ? 'Engineering' : item.code.includes('PRD') ? 'Product' : 'Engineering',
      amenities: item.amenities as any,
      type: item.type as any,
    });
  });

  return desks;
};

// Helper to generate Floor 2 Desks (Design, Marketing & Sales)
const generateFloor2Desks = (): Desk[] => {
  const desks: Desk[] = [];

  // Design Studio Pod (1 - 8)
  const designDesks = [
    { id: 'desk-f2-01', code: 'F2-DSG-01', x: 260, y: 140, currentEmployeeId: 'emp-10', amenities: ['window_view', 'standing_desk', 'dual_monitors'], type: 'standing' },
    { id: 'desk-f2-02', code: 'F2-DSG-02', x: 370, y: 140, currentEmployeeId: 'emp-11', amenities: ['dual_monitors', 'window_view'], type: 'standard' },
    { id: 'desk-f2-03', code: 'F2-DSG-03', x: 260, y: 230, currentEmployeeId: 'emp-12', amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f2-04', code: 'F2-DSG-04', x: 370, y: 230, currentEmployeeId: null, amenities: ['window_view', 'standing_desk'], type: 'standing' },
    { id: 'desk-f2-05', code: 'F2-DSG-05', x: 500, y: 140, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f2-06', code: 'F2-DSG-06', x: 610, y: 140, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f2-07', code: 'F2-DSG-07', x: 500, y: 230, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f2-08', code: 'F2-DSG-08', x: 610, y: 230, currentEmployeeId: null, amenities: ['near_coffee'], type: 'standard' },
  ];

  // Marketing Pod (9 - 16)
  const marketingDesks = [
    { id: 'desk-f2-09', code: 'F2-MKT-01', x: 760, y: 140, currentEmployeeId: 'emp-13', amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f2-10', code: 'F2-MKT-02', x: 870, y: 140, currentEmployeeId: 'emp-14', amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f2-11', code: 'F2-MKT-03', x: 760, y: 230, currentEmployeeId: null, amenities: ['near_coffee'], type: 'standard' },
    { id: 'desk-f2-12', code: 'F2-MKT-04', x: 870, y: 230, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f2-13', code: 'F2-MKT-05', x: 1000, y: 140, currentEmployeeId: null, amenities: ['standing_desk', 'dual_monitors'], type: 'standing' },
    { id: 'desk-f2-14', code: 'F2-MKT-06', x: 1000, y: 230, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
  ];

  // Sales Pod (17 - 24)
  const salesDesks = [
    { id: 'desk-f2-17', code: 'F2-SLS-01', x: 260, y: 410, currentEmployeeId: 'emp-15', amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f2-18', code: 'F2-SLS-02', x: 370, y: 410, currentEmployeeId: 'emp-16', amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f2-19', code: 'F2-SLS-03', x: 260, y: 500, currentEmployeeId: null, amenities: ['accessible'], type: 'standard' },
    { id: 'desk-f2-20', code: 'F2-SLS-04', x: 370, y: 500, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f2-21', code: 'F2-SLS-05', x: 500, y: 410, currentEmployeeId: null, amenities: ['standing_desk'], type: 'standing' },
    { id: 'desk-f2-22', code: 'F2-SLS-06', x: 610, y: 410, currentEmployeeId: null, amenities: ['dual_monitors'], type: 'standard' },
    { id: 'desk-f2-23', code: 'F2-SLS-07', x: 500, y: 500, currentEmployeeId: null, amenities: ['near_coffee'], type: 'standard' },
    { id: 'desk-f2-24', code: 'F2-SLS-08', x: 610, y: 500, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
  ];

  [...designDesks, ...marketingDesks, ...salesDesks].forEach((item) => {
    desks.push({
      id: item.id,
      code: item.code,
      floorId: 2,
      x: item.x,
      y: item.y,
      width: 90,
      height: 65,
      status: item.currentEmployeeId ? 'occupied' : 'available',
      currentEmployeeId: item.currentEmployeeId,
      departmentZone: item.code.includes('DSG') ? 'Design' : item.code.includes('MKT') ? 'Marketing' : 'Sales',
      amenities: item.amenities as any,
      type: item.type as any,
    });
  });

  return desks;
};

// Helper to generate Floor 3 Desks (Executive, HR, Finance, Operations)
const generateFloor3Desks = (): Desk[] => {
  const desks: Desk[] = [];

  // Executive Suites (Private)
  const execDesks = [
    { id: 'desk-f3-01', code: 'F3-EXEC-01', x: 260, y: 150, currentEmployeeId: 'emp-17', amenities: ['window_view', 'standing_desk', 'quiet_pod', 'dual_monitors'], type: 'executive' },
    { id: 'desk-f3-02', code: 'F3-EXEC-02', x: 390, y: 150, currentEmployeeId: 'emp-18', amenities: ['window_view', 'standing_desk', 'dual_monitors'], type: 'executive' },
    { id: 'desk-f3-03', code: 'F3-EXEC-03', x: 260, y: 250, currentEmployeeId: null, amenities: ['window_view', 'standing_desk'], type: 'executive' },
    { id: 'desk-f3-04', code: 'F3-EXEC-04', x: 390, y: 250, currentEmployeeId: null, amenities: ['window_view', 'quiet_pod'], type: 'executive' },
  ];

  // HR Wing
  const hrDesks = [
    { id: 'desk-f3-07', code: 'F3-HR-01', x: 550, y: 150, currentEmployeeId: 'emp-19', amenities: ['quiet_pod'], type: 'standard' },
    { id: 'desk-f3-08', code: 'F3-HR-02', x: 660, y: 150, currentEmployeeId: 'emp-20', amenities: ['window_view'], type: 'standard' },
    { id: 'desk-f3-09', code: 'F3-HR-03', x: 550, y: 250, currentEmployeeId: null, amenities: ['near_coffee'], type: 'standard' },
    { id: 'desk-f3-10', code: 'F3-HR-04', x: 660, y: 250, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
  ];

  // Finance Wing
  const financeDesks = [
    { id: 'desk-f3-13', code: 'F3-FIN-01', x: 800, y: 150, currentEmployeeId: 'emp-21', amenities: ['dual_monitors', 'quiet_pod'], type: 'standard' },
    { id: 'desk-f3-14', code: 'F3-FIN-02', x: 910, y: 150, currentEmployeeId: null, amenities: ['dual_monitors', 'window_view'], type: 'standard' },
    { id: 'desk-f3-15', code: 'F3-OPS-01', x: 800, y: 250, currentEmployeeId: 'emp-22', amenities: ['standing_desk'], type: 'standard' },
    { id: 'desk-f3-16', code: 'F3-OPS-02', x: 910, y: 250, currentEmployeeId: null, amenities: ['window_view'], type: 'standard' },
  ];

  [...execDesks, ...hrDesks, ...financeDesks].forEach((item) => {
    desks.push({
      id: item.id,
      code: item.code,
      floorId: 3,
      x: item.x,
      y: item.y,
      width: item.type === 'executive' ? 105 : 90,
      height: item.type === 'executive' ? 75 : 65,
      status: item.currentEmployeeId ? 'occupied' : 'available',
      currentEmployeeId: item.currentEmployeeId,
      departmentZone: item.code.includes('EXEC') ? 'Executive' : item.code.includes('HR') ? 'HR' : item.code.includes('FIN') ? 'Finance' : 'Operations',
      amenities: item.amenities as any,
      type: item.type as any,
    });
  });

  return desks;
};

// Floor Zones / Architectural Elements
const FLOOR_1_ZONES: OfficeZone[] = [
  { id: 'z1-1', name: 'Alan Turing Conference', type: 'meeting_room', x: 30, y: 100, width: 190, height: 210, capacity: 12, amenities: ['4K Screen', 'Zoom Room', 'Whiteboard'], color: 'rgba(59, 130, 246, 0.08)' },
  { id: 'z1-2', name: 'Grace Hopper Lab', type: 'meeting_room', x: 30, y: 340, width: 190, height: 210, capacity: 8, amenities: ['Whiteboard', 'AV Hub'], color: 'rgba(139, 92, 246, 0.08)' },
  { id: 'z1-3', name: 'Tech Bar & Barista Hub', type: 'kitchen', x: 740, y: 310, width: 230, height: 70, capacity: 15, amenities: ['Espresso Bar', 'Snack Bar'], color: 'rgba(245, 158, 11, 0.08)' },
  { id: 'z1-4', name: 'Elevators & Lobby', type: 'elevator', x: 1110, y: 100, width: 90, height: 160, color: 'rgba(100, 116, 139, 0.12)' },
  { id: 'z1-5', name: 'Restrooms & Wellness', type: 'restroom', x: 1110, y: 300, width: 90, height: 160, color: 'rgba(6, 182, 212, 0.08)' },
  { id: 'z1-6', name: 'Server & Rack Room', type: 'server_room', x: 1110, y: 490, width: 90, height: 100, color: 'rgba(239, 68, 68, 0.08)' },
];

const FLOOR_2_ZONES: OfficeZone[] = [
  { id: 'z2-1', name: 'Studio Alpha (Design Lab)', type: 'meeting_room', x: 30, y: 100, width: 190, height: 210, capacity: 10, amenities: ['Color Calibrated Displays', 'Drawing Displays'], color: 'rgba(236, 72, 153, 0.08)' },
  { id: 'z2-2', name: 'Studio Beta (Recording & Pod)', type: 'meeting_room', x: 30, y: 340, width: 190, height: 210, capacity: 6, amenities: ['Acoustic Foam', 'Podcast Mics'], color: 'rgba(16, 185, 129, 0.08)' },
  { id: 'z2-3', name: 'Creative Lounge & Cafe', type: 'kitchen', x: 740, y: 310, width: 230, height: 70, capacity: 20, amenities: ['Cold Brew Tap', 'Organic Snacks'], color: 'rgba(245, 158, 11, 0.08)' },
  { id: 'z2-4', name: 'Elevators & Lobby', type: 'elevator', x: 1110, y: 100, width: 90, height: 160, color: 'rgba(100, 116, 139, 0.12)' },
  { id: 'z2-5', name: 'Restrooms', type: 'restroom', x: 1110, y: 300, width: 90, height: 160, color: 'rgba(6, 182, 212, 0.08)' },
  { id: 'z2-6', name: 'Zen & Meditation Pod', type: 'wellness', x: 1110, y: 490, width: 90, height: 100, color: 'rgba(16, 185, 129, 0.08)' },
];

const FLOOR_3_ZONES: OfficeZone[] = [
  { id: 'z3-1', name: 'Apollo 11 Executive Boardroom', type: 'meeting_room', x: 30, y: 100, width: 200, height: 320, capacity: 22, amenities: ['Polycom 360', 'Private Balcony', 'Wine Cooler'], color: 'rgba(225, 29, 72, 0.08)' },
  { id: 'z3-2', name: 'Private HR Advisory Suite', type: 'meeting_room', x: 30, y: 450, width: 200, height: 150, capacity: 4, amenities: ['Confidential Soundproofing'], color: 'rgba(6, 182, 212, 0.08)' },
  { id: 'z3-3', name: 'Executive Cafe Lounge', type: 'kitchen', x: 740, y: 340, width: 230, height: 80, capacity: 12, amenities: ['Nespresso Bar', 'Artisan Teas'], color: 'rgba(245, 158, 11, 0.08)' },
  { id: 'z3-4', name: 'VIP Elevator', type: 'elevator', x: 1110, y: 100, width: 90, height: 180, color: 'rgba(100, 116, 139, 0.12)' },
  { id: 'z3-5', name: 'Executive Restrooms', type: 'restroom', x: 1110, y: 320, width: 90, height: 160, color: 'rgba(6, 182, 212, 0.08)' },
];

export const INITIAL_FLOORS: Floor[] = [
  {
    id: 1,
    name: 'Floor 1: Innovation Hub',
    subtitle: 'Engineering, Cloud Architecture & Product',
    level: 1,
    dimensions: { width: 1240, height: 680 },
    zones: FLOOR_1_ZONES,
    desks: generateFloor1Desks(),
  },
  {
    id: 2,
    name: 'Floor 2: Growth & Studio',
    subtitle: 'Design, Brand, Marketing & Enterprise Sales',
    level: 2,
    dimensions: { width: 1240, height: 680 },
    zones: FLOOR_2_ZONES,
    desks: generateFloor2Desks(),
  },
  {
    id: 3,
    name: 'Floor 3: Executive & Ops',
    subtitle: 'Leadership, HR, Finance & Legal',
    level: 3,
    dimensions: { width: 1240, height: 680 },
    zones: FLOOR_3_ZONES,
    desks: generateFloor3Desks(),
  },
];
