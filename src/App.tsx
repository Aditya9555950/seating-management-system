import React, { useEffect } from 'react';
import { SeatingProvider, useSeating } from './context/SeatingContext';
import { Header } from './components/Header';
import { FloorPlanCanvas } from './components/FloorPlan/FloorPlanCanvas';
import { EmployeeBenchDrawer } from './components/EmployeeDirectory/EmployeeBenchDrawer';
import { AiCopilotDrawer } from './components/AiAssistant/AiCopilotDrawer';
import { AiSettingsModal } from './components/AiAssistant/AiSettingsModal';
import { EmployeeDirectoryModal } from './components/EmployeeDirectory/EmployeeDirectoryModal';
import { AddEmployeeModal } from './components/EmployeeDirectory/AddEmployeeModal';
import { AnalyticsModal } from './components/Analytics/AnalyticsModal';
import { AuditLogDrawer } from './components/AuditLog/AuditLogDrawer';
import { DeskDetailModal } from './components/Modals/DeskDetailModal';

const SeatingApp: React.FC = () => {
  const {
    setIsAiDrawerOpen,
    setIsEmployeeDirectoryOpen,
    setIsAnalyticsOpen,
    setIsAuditLogOpen,
    setSelectedDeskId,
  } = useSeating();

  // Keyboard Shortcuts (Ctrl+K for AI Copilot, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAiDrawerOpen(true);
      }
      if (e.key === 'Escape') {
        setSelectedDeskId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAiDrawerOpen, setSelectedDeskId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace: Interactive Floor Plan Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <FloorPlanCanvas />
        <EmployeeBenchDrawer />
      </main>

      {/* Slide-out Drawers & Modals */}
      <AiCopilotDrawer />
      <AiSettingsModal />
      <EmployeeDirectoryModal />
      <AddEmployeeModal />
      <AnalyticsModal />
      <AuditLogDrawer />
      <DeskDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <SeatingProvider>
      <SeatingApp />
    </SeatingProvider>
  );
}
