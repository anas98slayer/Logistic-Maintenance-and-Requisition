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
import { Plus, Search, Filter, Loader2, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Requisition {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  requestedBy?: { name: string };
  requestDate: string;
  estimatedCost: string;
}

export function RequisitionList() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);

  const [formData, setFormData] = useState({
    item: "",
    category: "",
    quantity: 0,
    unit: "",
    estimatedCost: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("FETCH [RequisitionList]: User Role:", user?.role);
      const data = await api.get<Requisition[]>('/requisitions', token!);
      setRequisitions(data);
    } catch (error) {
      console.error("FETCH ERROR [RequisitionList]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreate = async () => {
    try {
      const autoId = `REQ-${Date.now()}`;
      const payload = { ...formData, id: autoId };
      
      console.log("CREATE [RequisitionList] PAYLOAD:", payload);
      await api.post('/requisitions', payload, token!);
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        item: "",
        category: "",
        quantity: 0,
        unit: "",
        estimatedCost: "",
      });
    } catch (error) {
      console.error("CREATE ERROR [RequisitionList]:", error);
      alert("Create failed.");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("DEBUG: [handleDelete] CALLED with ID:", id);
    try {
      console.log("DEBUG: [handleDelete] Proceeding to API call for ID:", id);
      await api.delete(`/requisitions/${id}`, token!);
      console.log("DEBUG: [handleDelete] API SUCCESS");
      fetchData();
    } catch (error) {
      console.error("DEBUG: [handleDelete] API FAILED:", error);
      alert("Delete failed. Only Admins can delete.");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      console.log("UPDATE [RequisitionList] ID:", id, "STATUS:", newStatus);
      await api.put(`/requisitions/${id}`, { status: newStatus }, token!);
      fetchData();
    } catch (error) {
      console.error("UPDATE ERROR [RequisitionList]:", error);
      alert("Status update failed. Only Admins can approve/reject.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Ordered":
        return "bg-blue-100 text-blue-800";
      case "Received":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequisitions = requisitions.filter((req) => {
    const requesterName = req.requestedBy?.name || "";
    const matchesSearch =
      req.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requesterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Requisitions</h1>
            <p className="text-gray-600 mt-1">Manage supply and equipment requisitions</p>
          </div>
          
          {user?.role === 'TECHNICIAN' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Requisition
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Requisition</DialogTitle>
                  <DialogDescription>
                    Submit a new requisition for supplies or equipment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="item">Item Name</Label>
                    <Input 
                      id="item" 
                      placeholder="Enter item name" 
                      value={formData.item}
                      onChange={(e) => setFormData({...formData, item: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parts">Parts</SelectItem>
                        <SelectItem value="Fluids">Fluids</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                        <SelectItem value="Packaging">Packaging</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        placeholder="0" 
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select onValueChange={(val) => setFormData({...formData, unit: val})}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Units">Units</SelectItem>
                          <SelectItem value="Boxes">Boxes</SelectItem>
                          <SelectItem value="Bottles">Bottles</SelectItem>
                          <SelectItem value="Rolls">Rolls</SelectItem>
                          <SelectItem value="Sets">Sets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                    <Input 
                      id="estimatedCost" 
                      type="text" 
                      placeholder="$0.00" 
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.item || !formData.category || formData.quantity <= 0}>
                    Submit Requisition
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by item, ID, or requester..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Ordered">Ordered</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requisitions Table */}
      <Card>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisition ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No requisitions found.
                    </td>
                  </tr>
                ) : (
                  filteredRequisitions.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {req.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.quantity} {req.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.role === 'ADMIN' ? (
                          <Select 
                            value={req.status} 
                            onValueChange={(val) => handleStatusUpdate(req.id, val)}
                          >
                            <SelectTrigger className={`h-8 w-32 text-xs ${getStatusColor(req.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Ordered">Ordered</SelectItem>
                              <SelectItem value="Received">Received</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary" className={getStatusColor(req.status)}>
                            {req.status}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.requestedBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(req.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.estimatedCost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user?.role === 'ADMIN' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDelete(req.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
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
