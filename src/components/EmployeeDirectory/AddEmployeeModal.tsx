import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Sun, ArrowUpCircle, Monitor, VolumeX } from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { Department } from '../../types';

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Executive',
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
];

export const AddEmployeeModal: React.FC = () => {
  const { isAddEmployeeOpen, setIsAddEmployeeOpen, addEmployee } = useSeating();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [avatar, setAvatar] = useState<string>(SAMPLE_AVATARS[0]);
  const [wantsWindow, setWantsWindow] = useState<boolean>(false);
  const [wantsStandingDesk, setWantsStandingDesk] = useState<boolean>(false);
  const [wantsDualMonitors, setWantsDualMonitors] = useState<boolean>(false);
  const [prefersQuietZone, setPrefersQuietZone] = useState<boolean>(false);

  if (!isAddEmployeeOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addEmployee({
      name,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@nexuscorp.internal`,
      role: role.trim() || 'Software Specialist',
      department,
      avatar,
      deskId: null,
      floorId: null,
      preferences: {
        wantsWindow,
        wantsStandingDesk,
        wantsDualMonitors,
        prefersQuietZone,
      },
      status: 'active',
      joinedDate: new Date().toISOString().slice(0, 10),
    });

    setIsAddEmployeeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">Add New Employee</h3>
              <p className="text-xs text-slate-400">New team member will be placed in the unassigned bench</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddEmployeeOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Designer"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@nexuscorp.internal"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Select Profile Photo</label>
            <div className="flex items-center gap-2">
              {SAMPLE_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`relative rounded-xl overflow-hidden ring-2 transition-all ${
                    avatar === av ? 'ring-blue-500 scale-110 shadow-lg' : 'ring-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="avatar" className="w-9 h-9 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Desk & Workspace Preferences</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={wantsWindow}
                  onChange={(e) => setWantsWindow(e.target.checked)}
                  className="rounded text-blue-500 bg-slate-800"
                />
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Window View</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={wantsStandingDesk}
                  onChange={(e) => setWantsStandingDesk(e.target.checked)}
                  className="rounded text-blue-500 bg-slate-800"
                />
                <ArrowUpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Standing Desk</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={wantsDualMonitors}
                  onChange={(e) => setWantsDualMonitors(e.target.checked)}
                  className="rounded text-blue-500 bg-slate-800"
                />
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                <span>Dual Monitors</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={prefersQuietZone}
                  onChange={(e) => setPrefersQuietZone(e.target.checked)}
                  className="rounded text-blue-500 bg-slate-800"
                />
                <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quiet Focus Zone</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddEmployeeOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
            >
              Add to Bench
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
