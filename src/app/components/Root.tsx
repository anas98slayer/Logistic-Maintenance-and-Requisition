import { Outlet, Link, useLocation } from "react-router";
import { Package, Wrench, FileText, Box, BarChart3, LogOut, User as UserIcon, Users, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useState } from "react";

export function Root() {
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest animate-pulse gap-3">
        <Package className="w-8 h-8 animate-bounce transition-all duration-1000" />
        Syncing FleetPro...
      </div>
    );
  }

  if (!user) {
    return authView === 'login' 
      ? <LoginPage onSwitchToSignup={() => setAuthView('signup')} /> 
      : <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/maintenance", label: "Maintenance", icon: Wrench },
    { path: "/requisitions", label: "Requisitions", icon: FileText },
    { path: "/equipment", label: "Equipment", icon: Package },
    { path: "/inventory", label: "Inventory", icon: Box },
  ];

  // Add Admin specific routes
  if (user.role === 'ADMIN') {
    navItems.push({ path: "/users", label: "User Management", icon: Users });
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col relative z-10 shadow-2xl shadow-slate-100/50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Package size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">FLEET<br/><span className="text-indigo-600">PRO</span></h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Logistics & Maintenance</p>
        </div>
        
        <nav className="px-4 py-2 space-y-1.5 flex-1">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 relative group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 mt-auto">
          <div className="bg-slate-50/80 rounded-[2rem] p-4 border border-slate-100/50 overflow-hidden relative group transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 ring-4 ring-slate-100/50">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
