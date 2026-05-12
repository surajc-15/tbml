'use client';

import { BarChart3, LogOut, Menu, X, ShieldAlert, AlertTriangle, Zap, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DashboardSidebarProps {
  userRole?: string;
  userEmail?: string;
  activeSection?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof BarChart3;
  adminOnly?: boolean;
}

const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Fraud Cases', icon: ShieldAlert },
  { id: 'analytics', label: 'Insights', icon: BarChart3 },
  { id: 'bank-users', label: 'Bank Users', icon: UserPlus, adminOnly: true },
];

const bankUserNavItems: NavItem[] = [
  { id: 'fraud', label: 'Fraud Transactions', icon: ShieldAlert },
  { id: 'suspicious', label: 'Suspicious Transactions', icon: AlertTriangle },
  { id: 'analytics', label: 'Insights', icon: BarChart3 },
  { id: 'simulate', label: 'Simulate Transaction', icon: Zap },
];

export function DashboardSidebar({ userRole, activeSection = 'dashboard' }: DashboardSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsSidebarOpen(false);
    // Navigate with query param to track active section
    router.push(`/dashboard?section=${sectionId}`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/sign-in');
  };

  const visibleItems = userRole === 'ADMIN' ? adminNavItems : bankUserNavItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed md:hidden bottom-6 right-6 z-40 p-3 rounded-full bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-sky-700 hover:to-blue-800 transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen w-64 text-white transition-transform duration-300 transform md:translate-x-0 z-40 md:z-0 flex flex-col flex-shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #0c1529 50%, #082f49 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-sky-700/30 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-sky-700/30 bg-gradient-to-r from-sky-900/50 to-blue-900/50">
          <div className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">
              TB
            </span>
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              ML
            </span>
          </div>
          <p className="text-xs text-sky-300/80 mt-2 font-medium">
            Compliance Dashboard
          </p>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
                    : 'text-sky-100 hover:bg-sky-700/40 hover:text-white'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform flex-shrink-0 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-sky-200 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sky-700/30 bg-gradient-to-r from-sky-900/30 to-blue-900/30 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-100 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 font-semibold text-sm"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed md:hidden inset-0 bg-black/60 backdrop-blur-sm z-20"
        />
      )}
    </>
  );
}
