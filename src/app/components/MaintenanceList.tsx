import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  Trash2, 
  UserPlus, 
  ClipboardCheck,
  User as UserIcon
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  equipment?: { name: string };
  type: string;
  priority: string;
  status: string;
  assignedToId?: number;
  assignedTo?: { name: string; email: string };
  createdBy?: { name: string; email: string };
  createdDate: string;
  dueDate: string;
  description: string;
}

interface Equipment {
  id: string;
  name: string;
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

export function MaintenanceList() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterView, setFilterView] = useState("all"); // 'all' or 'my-tasks'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [formData, setFormData] = useState({
    equipmentId: "",
    type: "",
    priority: "",
    dueDate: "",
    description: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<MaintenanceRequest[]>('/maintenance', token!);
      setMaintenanceRequests(data);
      
      const eqData = await api.get<Equipment[]>('/equipment', token!);
      setEquipmentList(eqData);

      if (user?.role === 'ADMIN') {
        const techData = await api.get<Technician[]>('/maintenance/technicians', token!);
        setTechnicians(techData);
      }
    } catch (error) {
      console.error("FETCH ERROR [MaintenanceList]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, user?.role]);

  const handleCreate = async () => {
    try {
      const autoId = `MR-${Date.now()}`;
      const payload = { ...formData, id: autoId };
      await api.post('/maintenance', payload, token!);
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        equipmentId: "",
        type: "",
        priority: "",
        dueDate: "",
        description: ""
      });
    } catch (error) {
      console.error("CREATE ERROR [MaintenanceList]:", error);
      alert("Registration failed. Please check your role.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/maintenance/${id}`, token!);
      fetchData();
    } catch (error) {
      alert("Only Admins can delete requests.");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/maintenance/${id}`, { status: newStatus }, token!);
      fetchData();
    } catch (error) {
      alert("Update denied. You must be assigned to this task.");
    }
  };

  const handleAssignment = async (id: string, techId: string) => {
    try {
      await api.put(`/maintenance/${id}`, { assignedToId: techId }, token!);
      fetchData();
    } catch (error) {
      alert("Assignment failed.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Cancelled": return "bg-slate-50 text-slate-700 border-slate-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const filteredRequests = maintenanceRequests.filter((request) => {
    const equipmentName = request.equipment?.name || "";
    const matchesSearch =
      equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    
    let matchesView = true;
    if (user?.role === 'TECHNICIAN' && filterView === 'my-tasks') {
      matchesView = request.assignedToId === user.id;
    }

    return matchesSearch && matchesStatus && matchesView;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <ClipboardCheck className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-900">Maintenance Queue</h1>
              <p className="text-slate-500 text-sm font-medium">Track and assign maintenance tasks</p>
           </div>
        </div>
        
        {user?.role === 'TECHNICIAN' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-11 gap-2 shadow-lg shadow-blue-100">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 border-none rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-slate-900 p-6 text-white">
                  <DialogTitle>Create Maintenance Request</DialogTitle>
                  <p className="text-slate-400 text-sm mt-1">Submit technical issues for admin review.</p>
               </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Target Equipment</Label>
                    <Select onValueChange={(val) => setFormData({...formData, equipmentId: val})}>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentList.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Type</Label>
                      <Select onValueChange={(val) => setFormData({...formData, type: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preventive">Preventive</SelectItem>
                          <SelectItem value="Corrective">Corrective</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Priority</Label>
                      <Select onValueChange={(val) => setFormData({...formData, priority: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Target Resolution Date</Label>
                    <Input 
                      type="date" 
                      className="h-11 rounded-xl bg-slate-50"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Issue Description</Label>
                    <Textarea 
                      placeholder="Detail the technical failure..." 
                      className="rounded-xl bg-slate-50"
                      rows={3} 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6">
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} className="bg-blue-600 text-white rounded-xl px-8" disabled={!formData.equipmentId || !formData.dueDate}>Submit</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card className="p-3 border-none shadow-sm bg-white rounded-2xl flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
            <Input
              placeholder="Search tasks..."
              className="pl-12 h-11 border-none bg-transparent focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {user?.role === 'TECHNICIAN' && (
              <Select value={filterView} onValueChange={setFilterView}>
                <SelectTrigger className="w-full md:w-40 h-10 border-slate-100 bg-slate-50 rounded-xl text-xs font-bold">
                  <UserIcon className="w-3.5 h-3.5 mr-2 opacity-50" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="my-tasks">My Assignments</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40 h-10 border-slate-100 bg-slate-50 rounded-xl text-xs font-bold">
                <Filter className="w-3.5 h-3.5 mr-2 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-24 text-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID / Equipment</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Technician</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requested By</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">{request.equipment?.name || "Unknown Asset"}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{request.id} • {request.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(request.status)}`}>
                          {request.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {user?.role === 'ADMIN' ? (
                        <div className="flex items-center gap-2">
                           <UserPlus className="w-4 h-4 text-slate-300" />
                           <Select 
                              value={request.assignedToId?.toString() || "unassigned"} 
                              onValueChange={(val) => handleAssignment(request.id, val === "unassigned" ? "" : val)}
                           >
                              <SelectTrigger className="h-9 border-none bg-slate-50 text-xs font-bold rounded-lg w-40">
                                 <SelectValue placeholder="Assign Tech" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="unassigned">Unassigned</SelectItem>
                                 {technicians.map(t => (
                                    <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-600">
                          <UserIcon className="w-3.5 h-3.5 opacity-40" />
                          <span className="text-xs font-bold">{request.assignedTo?.name || "Unassigned"}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6">
                        <span className="text-xs font-bold text-slate-600 italic">@{request.createdBy?.name || "System"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        {/* Status Update Dropdown (Admin or Assigned Tech) */}
                        {(user?.role === 'ADMIN' || request.assignedToId === user?.id || (request.createdBy?.email === user?.email && request.status === 'Pending')) && (
                           <Select value={request.status} onValueChange={(val) => handleStatusUpdate(request.id, val)}>
                              <SelectTrigger className="w-28 h-8 border-slate-200 text-[10px] font-bold rounded-lg">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Pending">Pending</SelectItem>
                                 <SelectItem value="In Progress">In Progress</SelectItem>
                                 <SelectItem value="Completed">Completed</SelectItem>
                                 <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                           </Select>
                        )}
                        
                        {user?.role === 'ADMIN' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => handleDelete(request.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
