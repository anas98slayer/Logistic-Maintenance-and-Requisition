import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Search,
  MoreVertical,
  UserMinus,
  Activity
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  _count: {
    assignedTasks: number;
  };
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser, token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>("/users", token!);
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`, token!);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole }, token!);
      setUsers(
        users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
        console.error("Error updating role:", error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10 text-indigo-600" />
            User Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage administrative access and technician accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users size={120} />
          </div>
          <p className="text-indigo-100 font-semibold mb-1 uppercase tracking-widest text-xs">Total Registered</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black leading-none">{users.length}</h3>
            <span className="text-indigo-200 text-sm font-medium pb-1">active users</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={120} />
          </div>
          <p className="text-slate-400 font-semibold mb-1 uppercase tracking-widest text-xs">Admins</p>
          <h3 className="text-4xl font-black text-slate-900 leading-none">
            {users.filter(u => u.role === 'ADMIN').length}
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
            <Activity size={120} />
          </div>
          <p className="text-slate-400 font-semibold mb-1 uppercase tracking-widest text-xs">Technicians</p>
          <h3 className="text-4xl font-black text-slate-900 leading-none">
            {users.filter(u => u.role === 'TECHNICIAN').length}
            <span className="text-slate-300 text-lg font-medium ml-1">/ 5 limit</span>
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
              <th className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{u.name}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === currentUser?.id}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer disabled:cursor-not-allowed ${
                        u.role === "ADMIN"
                          ? "bg-amber-50 text-amber-600 border border-amber-100 ring-amber-500/20"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100 ring-emerald-500/20"
                      }`}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="TECHNICIAN">Technician</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-bold text-xs">
                      <Shield className="w-3 h-3" />
                      {u._count.assignedTasks} Active Tasks
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {u.id !== currentUser?.id ? (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all inline-flex items-center justify-center shadow-none hover:shadow-lg hover:shadow-rose-100 group/btn"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                      </button>
                    ) : (
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-widest inline-block">
                        Current Account
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
