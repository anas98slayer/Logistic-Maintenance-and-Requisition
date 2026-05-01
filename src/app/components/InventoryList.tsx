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
import { Plus, Search, Filter, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  lastRestocked: string | null;
  supplier: string;
}

export function InventoryList() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    minStock: 0,
    location: "",
    supplier: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("FETCH [InventoryList]: User Role:", user?.role);
      const data = await api.get<InventoryItem[]>('/inventory', token!);
      setInventory(data);
    } catch (error) {
      console.error("FETCH ERROR [InventoryList]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreate = async () => {
    try {
      const autoId = `INV-${Date.now()}`;
      const payload = { ...formData, id: autoId };
      
      console.log("CREATE [InventoryList] PAYLOAD:", payload);
      await api.post('/inventory', payload, token!);
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        minStock: 0,
        location: "",
        supplier: ""
      });
    } catch (error) {
      console.error("CREATE ERROR [InventoryList]:", error);
      alert("Create failed. You may not have permission.");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("DEBUG: [handleDelete] CALLED with ID:", id);
    try {
      console.log("DEBUG: [handleDelete] Proceeding to API call for ID:", id);
      await api.delete(`/inventory/${id}`, token!);
      console.log("DEBUG: [handleDelete] API SUCCESS");
      fetchData();
    } catch (error) {
      console.error("DEBUG: [handleDelete] API FAILED:", error);
      alert("Delete failed. See console for details.");
    }
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity < minStock) {
      return { status: "Low Stock", color: "bg-red-100 text-red-800" };
    } else if (quantity < minStock * 1.5) {
      return { status: "Adequate", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "Good Stock", color: "bg-green-100 text-green-800" };
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterCategory === "all" || item.category === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = inventory.filter((item) => item.quantity < item.minStock);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Track supplies, parts, and equipment inventory</p>
          </div>
          
          {user?.role === 'ADMIN' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                  <DialogDescription>
                    Register a new item to the inventory system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input 
                      id="itemName" 
                      placeholder="Enter item name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger id="itemCategory">
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
                      <Label htmlFor="currentQuantity">Quantity</Label>
                      <Input 
                        id="currentQuantity" 
                        type="number" 
                        placeholder="0" 
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemUnit">Unit</Label>
                      <Select onValueChange={(val) => setFormData({...formData, unit: val})}>
                        <SelectTrigger id="itemUnit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Units">Units</SelectItem>
                          <SelectItem value="Boxes">Boxes</SelectItem>
                          <SelectItem value="Bottles">Bottles</SelectItem>
                          <SelectItem value="Rolls">Rolls</SelectItem>
                          <SelectItem value="Sets">Sets</SelectItem>
                          <SelectItem value="Kits">Kits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                    <Input 
                      id="minStockLevel" 
                      type="number" 
                      placeholder="0" 
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemLocation">Storage Location</Label>
                    <Input 
                      id="itemLocation" 
                      placeholder="e.g., Storage Room A" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemSupplier">Supplier</Label>
                    <Input 
                      id="itemSupplier" 
                      placeholder="Enter supplier name" 
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.name || !formData.category || formData.quantity <= 0}>
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Low Stock Alert */}
        {!isLoading && lowStockItems.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""} below minimum stock level
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, ID, or supplier..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Parts">Parts</SelectItem>
              <SelectItem value="Fluids">Fluids</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
              <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Table */}
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
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Restocked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item.quantity, item.minStock);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" className={stockStatus.color}>
                            {stockStatus.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user?.role === 'ADMIN' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
