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
  Truck, 
  MapPin, 
  Calendar,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
}

export function EquipmentList() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    status: "Operational",
    nextMaintenance: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("FETCH [EquipmentList]: User Role:", user?.role);
      const data = await api.get<Equipment[]>('/equipment', token!);
      setEquipment(data);
    } catch (error) {
      console.error("FETCH ERROR [EquipmentList]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreate = async () => {
    try {
      const autoId = `EQ-${Date.now()}`;
      const payload = { 
        ...formData, 
        id: autoId,
        nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance).toISOString() : null
      };
      
      console.log("CREATE [EquipmentList] PAYLOAD:", payload);
      await api.post('/equipment', payload, token!);
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        name: "",
        type: "",
        location: "",
        status: "Operational",
        nextMaintenance: ""
      });
    } catch (error) {
      console.error("CREATE ERROR [EquipmentList]:", error);
      alert("Registration failed. Please check permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("DEBUG: [handleDelete] CALLED with ID:", id);
    try {
      await api.delete(`/equipment/${id}`, token!);
      fetchData();
    } catch (error) {
      console.error("DEBUG: [handleDelete] API FAILED:", error);
      alert("Deletion failed. Only administrators can remove assets.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10";
      case "Under Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10";
      case "Out of Service":
        return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/10";
    }
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || eq.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Truck className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
              <p className="text-slate-500 text-sm font-medium">Track and maintain your fleet inventory</p>
           </div>
        </div>
        
        {user?.role === 'ADMIN' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-xl px-5 h-11 gap-2 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                Register Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 border-none rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 p-6 text-white">
                <DialogTitle className="text-xl font-bold">New Equipment Registration</DialogTitle>
                <DialogDescription className="text-slate-400 mt-1">
                  Complete the profile to add a new asset to the tracking system.
                </DialogDescription>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Name</Label>
                    <Input 
                      placeholder="e.g., Heavy Forklift X2" 
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equipment Type</Label>
                    <Select onValueChange={(val) => setFormData({...formData, type: val})}>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Forklift">Forklift</SelectItem>
                        <SelectItem value="Conveyor">Conveyor</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Loader">Loader</SelectItem>
                        <SelectItem value="Crane">Crane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</Label>
                    <Input 
                      placeholder="e.g., Bay 4, Warehouse A" 
                      className="h-11 rounded-xl bg-slate-50 border-slate-200"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Status</Label>
                    <Select onValueChange={(val) => setFormData({...formData, status: val})}>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Under Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Out of Service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Maintenance Schedule</Label>
                  <Input 
                    type="date" 
                    className="h-11 rounded-xl bg-slate-50 border-slate-200"
                    value={formData.nextMaintenance}
                    onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="bg-slate-50 p-6 flex gap-3">
                <Button variant="ghost" className="rounded-xl px-6 h-11" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 font-bold transition-all shadow-lg shadow-blue-100" 
                   onClick={handleCreate} 
                   disabled={!formData.name || !formData.type}
                >
                  Confirm Registration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Control Bar */}
      <Card className="p-2 border-none shadow-sm bg-white rounded-2xl flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search by asset name, ID, or category..."
              className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-slate-700 font-medium placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 h-10 border-slate-100 bg-slate-50 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-wider px-4">
                <Filter className="w-3 h-3 mr-2 text-slate-400" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Under Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Service">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </Card>

      {/* Assets Table */}
      <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Inventory...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Schedules</th>
                  {user?.role === 'ADMIN' && <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-slate-300" />
                         </div>
                         <h3 className="text-slate-900 font-bold">No assets found</h3>
                         <p className="text-slate-500 text-sm">Refine your search or add a new equipment to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all">
                             <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-900">{eq.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{eq.id} • {eq.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <Badge variant="outline" className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(eq.status)}`}>
                            {eq.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 opacity-40" />
                          <span className="text-xs font-bold">{eq.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                               <Calendar className="w-3 h-3 text-emerald-500" />
                               <span className="text-slate-400">LAST:</span>
                               <span className="text-slate-600">{eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString() : "NEVER"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                               <Calendar className="w-3 h-3 text-amber-500" />
                               <span className="text-slate-400">NEXT:</span>
                               <span className="text-slate-600">{eq.nextMaintenance ? new Date(eq.nextMaintenance).toLocaleDateString() : "TBD"}</span>
                            </div>
                         </div>
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="px-8 py-6">
                          <div className="flex justify-end items-center gap-2">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                                onClick={() => handleDelete(eq.id)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                             >
                               <MoreVertical className="w-4 h-4" />
                             </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
