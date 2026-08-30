import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  Monitor,
  Coffee,
  Tv,
  DoorClosed,
  Layers,
  Info
} from 'lucide-react';
import { DeskNode } from './DeskNode';
import { useSeating } from '../../context/SeatingContext';
import { OfficeZone, DeskAmenity } from '../../types';

const AMENITY_FILTERS: { key: DeskAmenity | 'All'; label: string; icon: any }[] = [
  { key: 'All', label: 'All Desks', icon: Layers },
  { key: 'standing_desk', label: 'Standing', icon: Monitor },
  { key: 'window_view', label: 'Window View', icon: Sparkles },
  { key: 'dual_monitors', label: 'Dual Monitors', icon: Monitor },
  { key: 'quiet_pod', label: 'Quiet Zone', icon: Info },
  { key: 'near_coffee', label: 'Near Coffee', icon: Coffee },
];

export const FloorPlanCanvas: React.FC = () => {
  const {
    floors,
    employees,
    activeFloorId,
    searchQuery,
    selectedDepartmentFilter,
    selectedAmenityFilter,
    setSelectedAmenityFilter,
    highlightedDeskIds,
    setSelectedDeskId,
  } = useSeating();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentFloor = floors.find(f => f.id === activeFloorId) || floors[0];

  // Zoom handlers
  const handleZoomIn = () => setScale(s => Math.min(s + 0.15, 2.0));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.15, 0.6));
  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 40, y: 30 });
  };

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on canvas background, not on a desk
    if ((e.target as HTMLElement).closest('.group')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      setScale(s => Math.min(Math.max(s * zoomFactor, 0.6), 2.0));
    }
  };

  // Filter desks by search, department, and amenity
  const isDeskMatchingSearch = (deskCode: string, empName?: string, empRole?: string, empDept?: string): boolean => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return Boolean(
      deskCode.toLowerCase().includes(q) ||
      (empName && empName.toLowerCase().includes(q)) ||
      (empRole && empRole.toLowerCase().includes(q)) ||
      (empDept && empDept.toLowerCase().includes(q))
    );
  };

  const isDeskVisible = (desk: any) => {
    if (selectedDepartmentFilter !== 'All' && desk.departmentZone !== selectedDepartmentFilter) {
      return false;
    }
    if (selectedAmenityFilter !== 'All' && !desk.amenities.includes(selectedAmenityFilter)) {
      return false;
    }
    return true;
  };

  return (
    <div className="relative w-full h-[calc(100vh-135px)] bg-slate-950 overflow-hidden flex flex-col select-none">
      
      {/* Top Floor Metadata Bar & Quick Filters */}
      <div className="z-20 px-6 py-2 bg-slate-900/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
              <span>{currentFloor.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans">
                Level {currentFloor.level}
              </span>
            </h2>
            <p className="text-xs text-slate-400">{currentFloor.subtitle}</p>
          </div>
        </div>

        {/* Amenity Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {AMENITY_FILTERS.map(({ key, label, icon: Icon }) => {
            const active = selectedAmenityFilter === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedAmenityFilter(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative flex-1 w-full h-full floor-grid-pattern overflow-hidden ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Transformable Canvas Layer */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: `${currentFloor.dimensions.width}px`,
            height: `${currentFloor.dimensions.height}px`,
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          }}
          className="relative rounded-3xl bg-slate-900/50 border-2 border-slate-700/60 shadow-2xl p-6"
        >
          {/* Floor Exterior Architectural Bounds & Glass Walls */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border-4 border-blue-500/20 shadow-[inset_0_0_50px_rgba(59,130,246,0.05)]">
            {/* Window Glass Indicator Labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              ◈ North Glass Curtain Wall (Skyline View) ◈
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              ◈ South Atrium Windows ◈
            </div>
          </div>

          {/* Architectural Zones (Meeting Rooms, Coffee Cafe, Server Room, Restrooms) */}
          {currentFloor.zones.map((zone: OfficeZone) => (
            <div
              key={zone.id}
              style={{
                position: 'absolute',
                left: `${zone.x}px`,
                top: `${zone.y}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                backgroundColor: zone.color || 'rgba(255,255,255,0.04)',
              }}
              className="rounded-2xl border border-white/10 p-3 flex flex-col justify-between overflow-hidden shadow-inner backdrop-blur-sm pointer-events-auto"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    {zone.type === 'meeting_room' && <Tv className="w-3.5 h-3.5 text-blue-400" />}
                    {zone.type === 'kitchen' && <Coffee className="w-3.5 h-3.5 text-amber-400" />}
                    {zone.type === 'elevator' && <DoorClosed className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="text-xs font-bold text-slate-200 truncate">{zone.name}</span>
                  </div>
                  {zone.capacity && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {zone.capacity} seats
                    </span>
                  )}
                </div>

                {zone.amenities && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {zone.amenities.map(am => (
                      <span key={am} className="text-[8px] px-1.5 py-0.2 rounded bg-black/30 text-slate-400 border border-white/5">
                        {am}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Zone bottom icon badge */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono uppercase">
                <span>ZONE #{zone.id}</span>
                <span className="capitalize">{zone.type.replace('_', ' ')}</span>
              </div>
            </div>
          ))}

          {/* Desks Layer */}
          {currentFloor.desks.map((desk) => {
            const employee = employees.find(e => e.id === desk.currentEmployeeId);
            const isMatch = isDeskMatchingSearch(
              desk.code,
              employee?.name,
              employee?.role,
              employee?.department
            );
            const isHighlighted = highlightedDeskIds.includes(desk.id);
            const visible = isDeskVisible(desk);

            if (!visible && !isMatch) {
              // Render dimmed desk if filtered out
              return (
                <div
                  key={desk.id}
                  style={{
                    position: 'absolute',
                    left: `${desk.x}px`,
                    top: `${desk.y}px`,
                    width: `${desk.width || 90}px`,
                    height: `${desk.height || 65}px`,
                  }}
                  className="opacity-15 pointer-events-none rounded-xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center text-[10px] font-mono text-slate-500"
                >
                  {desk.code}
                </div>
              );
            }

            return (
              <DeskNode
                key={desk.id}
                desk={desk}
                employee={employee}
                isHighlighted={isHighlighted}
                isSearchMatch={isMatch}
                onSelect={() => setSelectedDeskId(desk.id)}
              />
            );
          })}
        </div>

        {/* Canvas Floating Controls (Zoom, Reset, Legend) */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-white/10 mx-1" />
          <span className="text-xs font-mono font-medium text-slate-400 px-1">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Floating Quick Stats Overlay */}
        <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300">
              <strong className="text-white font-bold">{currentFloor.desks.filter(d => d.status === 'available').length}</strong> Available
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-300">
              <strong className="text-white font-bold">{currentFloor.desks.filter(d => d.status === 'occupied').length}</strong> Seated
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-xs text-slate-300">
            Density: <strong className="text-blue-400 font-bold">{Math.round((currentFloor.desks.filter(d => d.status === 'occupied').length / currentFloor.desks.length) * 100)}%</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
