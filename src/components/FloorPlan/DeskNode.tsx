import React, { useState } from 'react';
import {
  Monitor,
  ArrowUpCircle,
  Sun,
  VolumeX,
  Coffee,
  Accessibility,
  UserCheck,
  AlertTriangle,
  Lock,
  GripVertical
} from 'lucide-react';
import { Desk, Employee, Department } from '../../types';
import { useSeating } from '../../context/SeatingContext';

interface DeskNodeProps {
  desk: Desk;
  employee?: Employee;
  isHighlighted?: boolean;
  isSearchMatch?: boolean;
  onSelect: () => void;
}

const DEPT_COLORS: Record<Department, { bg: string; text: string; border: string; glow: string; accent: string }> = {
  Engineering: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/20', accent: '#3b82f6' },
  Design: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/40', glow: 'shadow-pink-500/20', accent: '#ec4899' },
  Product: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'shadow-purple-500/20', accent: '#8b5cf6' },
  Marketing: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/20', accent: '#f59e0b' },
  Sales: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20', accent: '#10b981' },
  HR: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20', accent: '#06b6d4' },
  Finance: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/40', glow: 'shadow-indigo-500/20', accent: '#6366f1' },
  Operations: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/40', glow: 'shadow-slate-500/20', accent: '#64748b' },
  Executive: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/40', glow: 'shadow-rose-500/20', accent: '#e11d48' },
};

export const DeskNode: React.FC<DeskNodeProps> = ({
  desk,
  employee,
  isHighlighted = false,
  isSearchMatch = false,
  onSelect,
}) => {
  const { reassignSeat, swapSeats } = useSeating();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const deptStyle = DEPT_COLORS[desk.departmentZone] || DEPT_COLORS.Engineering;
  const isOccupied = desk.status === 'occupied' && !!employee;
  const isAvailable = desk.status === 'available' && !employee;
  const isMaintenance = desk.status === 'maintenance';
  const isReserved = desk.status === 'reserved';

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (employee) {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'EMPLOYEE_MOVE',
        employeeId: employee.id,
        fromDeskId: desk.id,
        employeeName: employee.name,
      }));
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.employeeId) {
        // If dropping onto an occupied desk with a different person -> SWAP
        if (employee && employee.id !== data.employeeId) {
          swapSeats(data.employeeId, employee.id, 'Drag & Drop');
        } else {
          // Direct Reassign
          reassignSeat(data.employeeId, desk.id, 'Drag & Drop');
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${desk.x}px`,
        top: `${desk.y}px`,
        width: `${desk.width || 90}px`,
        height: `${desk.height || 65}px`,
      }}
      draggable={isOccupied}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer rounded-xl transition-all duration-200 select-none ${
        isDragOver ? 'desk-drop-hover ring-2 ring-blue-500 scale-105' : ''
      } ${
        isHighlighted
          ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/50 animate-bounce'
          : isSearchMatch
          ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30'
          : ''
      }`}
    >
      {/* Desk Base Structure */}
      <div
        className={`w-full h-full rounded-xl p-1.5 flex flex-col justify-between relative overflow-hidden transition-all border ${
          isOccupied
            ? `bg-slate-900/90 ${deptStyle.border} shadow-md ${deptStyle.glow} hover:border-white/40`
            : isAvailable
            ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/20'
            : isMaintenance
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-amber-950/30 border-amber-500/40'
        }`}
      >
        {/* Subtle top indicator bar representing desk partition */}
        <div
          className="h-1 w-full rounded-full opacity-80"
          style={{ backgroundColor: deptStyle.accent }}
        />

        {/* Top row: Desk Code & Status Dot */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-[10px] font-mono font-bold tracking-tight text-slate-300 truncate">
            {desk.code.replace(/F\d+-/, '')}
          </span>

          <div className="flex items-center gap-1">
            {isOccupied && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: deptStyle.accent }}
              />
            )}
            {isAvailable && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            )}
            {isMaintenance && <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />}
            {isReserved && <Lock className="w-2.5 h-2.5 text-amber-400" />}
          </div>
        </div>

        {/* Middle / Center: Occupant Avatar or Status Text */}
        <div className="flex items-center gap-1.5 my-auto">
          {isOccupied && employee ? (
            <>
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-slate-100 truncate leading-tight">
                  {employee.name.split(' ')[0]}
                </span>
                <span className="text-[8px] text-slate-400 truncate leading-none">
                  {employee.role.split(' ')[0]}
                </span>
              </div>
            </>
          ) : isAvailable ? (
            <div className="w-full text-center">
              <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">
                Available
              </span>
            </div>
          ) : isMaintenance ? (
            <div className="w-full text-center">
              <span className="text-[8px] font-semibold text-rose-400 uppercase">
                Under Repair
              </span>
            </div>
          ) : (
            <div className="w-full text-center">
              <span className="text-[8px] font-semibold text-amber-400 uppercase">
                Reserved
              </span>
            </div>
          )}
        </div>

        {/* Bottom row: Amenities Icons */}
        <div className="flex items-center justify-between text-slate-400 text-[9px] pt-0.5 border-t border-white/5">
          <div className="flex items-center gap-0.5">
            {desk.amenities.includes('window_view') && (
              <span title="Window View"><Sun className="w-2.5 h-2.5 text-amber-300" /></span>
            )}
            {desk.amenities.includes('standing_desk') && (
              <span title="Standing Desk"><ArrowUpCircle className="w-2.5 h-2.5 text-blue-300" /></span>
            )}
            {desk.amenities.includes('dual_monitors') && (
              <span title="Dual Monitors"><Monitor className="w-2.5 h-2.5 text-purple-300" /></span>
            )}
            {desk.amenities.includes('quiet_pod') && (
              <span title="Quiet Focus Zone"><VolumeX className="w-2.5 h-2.5 text-emerald-300" /></span>
            )}
            {desk.amenities.includes('near_coffee') && (
              <span title="Near Coffee Hub"><Coffee className="w-2.5 h-2.5 text-amber-500" /></span>
            )}
            {desk.amenities.includes('accessible') && (
              <span title="Accessible"><Accessibility className="w-2.5 h-2.5 text-cyan-300" /></span>
            )}
          </div>

          <span className="text-[8px] text-slate-500 uppercase font-mono">
            {desk.type === 'standing' ? 'UP' : desk.type === 'executive' ? 'VIP' : desk.type === 'hot_desk' ? 'HOT' : 'STD'}
          </span>
        </div>
      </div>

      {/* Rich Interactive Hover Preview Card */}
      {isHovered && (
        <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full z-50 w-64 p-3 rounded-2xl glass-panel-elevated pointer-events-none transition-all shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <span>{desk.code}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${deptStyle.bg} ${deptStyle.text}`}>
                  {desk.departmentZone}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Floor {desk.floorId} • {desk.type.toUpperCase()}</span>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
              isOccupied ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {desk.status.toUpperCase()}
            </span>
          </div>

          {employee ? (
            <div className="flex items-start gap-2.5">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{employee.name}</div>
                <div className="text-[10px] text-blue-300 truncate">{employee.role}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{employee.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs font-semibold text-emerald-400">Ready for Assignment</p>
              <p className="text-[10px] text-slate-400">Drag an employee here or use AI Copilot</p>
            </div>
          )}

          {/* Amenity tags in hover */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1">
            {desk.amenities.map((am) => (
              <span key={am} className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 capitalize">
                {am.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
