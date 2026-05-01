import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { 
  Wrench, 
  FileText, 
  AlertTriangle,
  Activity,
  Loader2,
  ChevronRight,
  Boxes,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CheckCircle2,
  PackageSearch
} from "lucide-react";
import { Link } from "react-router";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface DashboardStats {
  equipment: number;
  operational: number;
  inMaintenance: number;
  outOfService: number;
  maintenance: number;
  activeMaintenance: number;
  lowStock: number;
  requisitions: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
}

export function Dashboard() {
  const { token } = useAuth();
  const [apiStats, setApiStats] = useState<DashboardStats | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, equipmentData, inventoryData] = await Promise.all([
          api.get<DashboardStats>('/dashboard/stats', token!),
          api.get<Equipment[]>('/equipment', token!),
          api.get<InventoryItem[]>('/inventory', token!)
        ]);
        setApiStats(statsData);
        setEquipment(equipmentData);
        setInventory(inventoryData);
      } catch (error) {
        console.error("DEBUG: [fetchData] Failed to sync dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // FIX: Clean data for Pie Chart to avoid overlap and rendering issues
  const equipmentStatusData = useMemo(() => {
    if (!apiStats) return [];
    
    const data = [
      { name: "Operational", value: Number(apiStats.operational) || 0, color: "#10b981" },
      { name: "In Maintenance", value: Number(apiStats.inMaintenance) || 0, color: "#f59e0b" },
      { name: "Out of Service", value: Number(apiStats.outOfService) || 0, color: "#ef4444" },
    ].filter(item => item.value > 0); // Only show segments with values

    return data;
  }, [apiStats]);

  const totalEquipmentValue = equipmentStatusData.reduce((acc, curr) => acc + curr.value, 0);

  const stats = [
    {
      title: "Active Maintenance",
      value: apiStats?.activeMaintenance ?? 0,
      label: "Open Requests",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up",
      trendValue: "12%"
    },
    {
      title: "Pending Requisitions",
      value: apiStats?.requisitions ?? 0,
      label: "Awaiting Approval",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: "down",
      trendValue: "5%"
    },
    {
      title: "Total Assets",
      value: apiStats?.equipment ?? 0,
      label: "Managed Units",
      icon: Truck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: "up",
      trendValue: "2"
    },
    {
      title: "Low Stock Items",
      value: apiStats?.lowStock ?? 0,
      label: "Critical Inventory",
      icon: Boxes,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      trend: "up",
      trendValue: "3"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Syncing FleetPro dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1">Monitor fleet health and maintenance performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-slate-700">Live Status: Stable</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-5 border-none shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} inline-block`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trendValue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 border-none">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Overview</TabsTrigger>
          <TabsTrigger value="fleet" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Fleet Health</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart 1: Fleet Status */}
            <Card className="xl:col-span-1 p-6 border-none shadow-sm bg-white overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800">Fleet Status</h2>
                <Link to="/equipment" className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">Manage Assets</Link>
              </div>
              
              <div className="relative h-[280px]">
                {totalEquipmentValue > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={equipmentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {equipmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No fleet data available</p>
                  </div>
                )}
                
                {totalEquipmentValue > 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="block text-3xl font-bold text-slate-900">{totalEquipmentValue}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Units</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {equipmentStatusData.map((item, i) => (
                  <div key={i} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{item.name}</span>
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chart 2: Maintenance Trends */}
            <Card className="xl:col-span-2 p-6 border-none shadow-sm bg-white">
               <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800">Weekly Performance</h2>
                <div className="flex items-center gap-4 text-xs font-semibold">
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</div>
                </div>
              </div>
              
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: "Mon", completed: 8, pending: 5 },
                    { day: "Tue", completed: 12, pending: 7 },
                    { day: "Wed", completed: 10, pending: 6 },
                    { day: "Thu", completed: 15, pending: 8 },
                    { day: "Fri", completed: 11, pending: 4 },
                    { day: "Sat", completed: 6, pending: 2 },
                    { day: "Sun", completed: 4, pending: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions Card */}
            <Card className="p-6 border-none shadow-sm bg-white group overflow-hidden">
               <h2 className="font-bold text-slate-800 mb-6">Workflow Shortcuts</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <Link to="/maintenance" className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group/link">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Maintenance</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:text-blue-400" />
                  </Link>

                  <Link to="/inventory" className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group/link">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover/link:bg-emerald-600 group-hover/link:text-white transition-colors">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Stock Items</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:text-emerald-400" />
                  </Link>

                  <Link to="/requisitions" className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group/link">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover/link:bg-purple-600 group-hover/link:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Requisitions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:text-purple-400" />
                  </Link>

                  <Link to="/equipment" className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group/link">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover/link:bg-indigo-600 group-hover/link:text-white transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Asset Fleet</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:text-indigo-400" />
                  </Link>
               </div>
               {/* Background Glow */}
               <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-0 opacity-50 group-hover:bg-blue-50 transition-colors duration-500" />
            </Card>

            {/* Health Overview */}
            <Card className="p-6 border-none shadow-sm bg-white">
              <h2 className="font-bold text-slate-800 mb-6">System Health Matrix</h2>
              <div className="space-y-6">
                {equipmentStatusData.length > 0 ? equipmentStatusData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }} />
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{Math.round((item.value / totalEquipmentValue) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(item.value / totalEquipmentValue) * 100}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Pending fleet synchronization...</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="animate-in slide-in-from-right-4 duration-500">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800">Fleet Performance Detail</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time status of all registered assets</p>
              </div>
              <Link to="/equipment" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Manage Full Fleet</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {equipment.slice(0, 8).map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-800">{eq.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{eq.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          eq.status === 'Operational' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          eq.status === 'Under Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             eq.status === 'Operational' ? 'bg-emerald-500' :
                             eq.status === 'Under Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {eq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {eq.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        {eq.nextMaintenance ? new Date(eq.nextMaintenance).toLocaleDateString() : 'TBD'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="font-bold text-slate-800">Critical Stock Levels</h2>
                <p className="text-xs text-slate-500 mt-1">Items requiring immediate attention or reorder</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Part/Item</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Stock</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inventory.filter(item => item.quantity <= item.minStock).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.quantity} {item.unit}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-tighter border border-rose-100">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                    {inventory.filter(item => item.quantity <= item.minStock).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <p className="text-sm font-bold text-slate-500">All inventory levels are healthy</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-blue-600 text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="font-bold text-xl mb-2">Inventory Sync</h2>
                <p className="text-blue-100 text-sm">Managing {inventory.length} total SKU lines across 4 warehouses.</p>
                
                <div className="mt-8 space-y-4">
                  <div className="bg-blue-500/30 p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Reorder Volume</p>
                    <p className="text-2xl font-bold mt-1">{inventory.filter(i => i.quantity <= i.minStock).length}</p>
                    <p className="text-[10px] text-blue-100">Items below threshold</p>
                  </div>
                  
                  <Link to="/inventory" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 group">
                    <span className="font-bold text-sm">Inventory Dashboard</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              {/* Background Decoration */}
              <PackageSearch className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 rotate-12" />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}