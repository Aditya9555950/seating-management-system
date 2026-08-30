import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  Monitor,
  Sun,
  ArrowUpCircle,
  VolumeX,
  Coffee,
  Accessibility,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Trash2,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { DeskAmenity, DeskStatus } from '../../types';

const AMENITY_OPTIONS: { key: DeskAmenity; label: string; icon: any }[] = [
  { key: 'window_view', label: 'Window View', icon: Sun },
  { key: 'standing_desk', label: 'Standing Desk', icon: ArrowUpCircle },
  { key: 'dual_monitors', label: 'Dual Monitors', icon: Monitor },
  { key: 'quiet_pod', label: 'Quiet Zone', icon: VolumeX },
  { key: 'near_coffee', label: 'Near Coffee', icon: Coffee },
  { key: 'accessible', label: 'Accessible', icon: Accessibility },
];

export const DeskDetailModal: React.FC = () => {
  const {
    selectedDeskId,
    setSelectedDeskId,
    floors,
    employees,
    reassignSeat,
    vacateSeat,
    updateDeskStatus,
    updateDeskAmenities,
  } = useSeating();

  const [selectedUnassignedId, setSelectedUnassignedId] = useState<string>('');

  if (!selectedDeskId) return null;

  const allDesks = floors.flatMap(f => f.desks);
  const desk = allDesks.find(d => d.id === selectedDeskId);
  if (!desk) return null;

  const floor = floors.find(f => f.id === desk.floorId);
  const occupant = employees.find(e => e.id === desk.currentEmployeeId);
  const unassignedEmployees = employees.filter(e => !e.deskId);

  const toggleAmenity = (amenity: DeskAmenity) => {
    const exists = desk.amenities.includes(amenity);
    const updated = exists
      ? desk.amenities.filter(a => a !== amenity)
      : [...desk.amenities, amenity];
    updateDeskAmenities(desk.id, updated);
  };

  const handleAssignUnassigned = () => {
    if (selectedUnassignedId) {
      reassignSeat(selectedUnassignedId, desk.id, 'Admin Modal');
      setSelectedUnassignedId('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold">
              {desk.code.split('-')[1] || 'DSK'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{desk.code}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase">
                  {desk.departmentZone}
                </span>
              </div>
              <p className="text-xs text-slate-400">Floor {desk.floorId} • {desk.type.toUpperCase()} Station</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDeskId(null)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Occupant Card */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Current Occupant
            </label>
            {occupant ? (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex items-start justify-between gap-3 shadow-lg shadow-blue-500/5">
                <div className="flex items-start gap-3">
                  <img
                    src={occupant.avatar}
                    alt={occupant.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{occupant.name}</h4>
                    <p className="text-xs text-blue-400 font-medium">{occupant.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{occupant.email}</p>
                    {occupant.joinedDate && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Member since {occupant.joinedDate}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => vacateSeat(desk.id, 'Admin Modal')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vacate</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-center space-y-3">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Available for Assignment
                </div>
                
                {unassignedEmployees.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedUnassignedId}
                      onChange={(e) => setSelectedUnassignedId(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select unassigned employee...</option>
                      {unassignedEmployees.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} ({e.department} - {e.role})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAssignUnassigned}
                      disabled={!selectedUnassignedId}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Seat Here
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">All employees currently have an assigned seat.</p>
                )}
              </div>
            )}
          </div>

          {/* Desk Operational Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Desk Operational Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['available', 'reserved', 'maintenance'] as DeskStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateDeskStatus(desk.id, status)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-all ${
                    desk.status === status
                      ? status === 'available'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                        : status === 'reserved'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {status === 'available' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {status === 'reserved' && <Lock className="w-3.5 h-3.5" />}
                  {status === 'maintenance' && <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desk Amenities Management */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Desk Amenities & Ergonomics
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map(({ key, label, icon: Icon }) => {
                const active = desk.amenities.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAmenity(key)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                      active
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm'
                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-end">
          <button
            onClick={() => setSelectedDeskId(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
