import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  Package,
  Trash2,
  Download,
  Pencil,
  Check,
  X,
  Search,
  Copy,
  User,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { mockups } from "@/data/mockups";

interface Design {
  _id: string;
  name: string;
  settings: {
    fabric: string;
    mockup: string;
    scale: number;
    rotation: number;
  };
  thumbnail: string;
  createdAt: string;
}

// Get all products from mockups
const products = mockups.map((m) => ({ id: m.id, name: m.name }));

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchDesigns();
    }
  }, [user, token]);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/designs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesigns(response.data.designs);
    } catch (error) {
      console.error("Failed to fetch designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteDesign = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesigns(designs.filter((d) => d._id !== id));
      toast.success("Design deleted");
    } catch (error) {
      toast.error("Failed to delete design");
    }
  };

  const handleDuplicateDesign = async (design: Design) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/designs",
        {
          name: `${design.name} (Copy)`,
          settings: design.settings,
          thumbnail: design.thumbnail,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDesigns([response.data.design, ...designs]);
      toast.success("Design duplicated!");
    } catch (error) {
      toast.error("Failed to duplicate design");
    }
  };

  const handleDownloadDesign = (design: Design) => {
    if (design.thumbnail) {
      const link = document.createElement("a");
      link.download = `${design.name}-${Date.now()}.png`;
      link.href = design.thumbnail;
      link.click();
      toast.success("Design downloaded!");
    } else {
      toast.error("No thumbnail available");
    }
  };

  const handleStartEdit = (design: Design) => {
    setEditingId(design._id);
    setEditName(design.name);
  };

  const handleSaveName = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/designs/${id}`,
        { name: editName.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDesigns(
        designs.map((d) =>
          d._id === id ? { ...d, name: editName.trim() } : d,
        ),
      );
      setEditingId(null);
      toast.success("Design name updated!");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setPasswordLoading(true);
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Password updated successfully");
      setPasswordDialogOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message || "Failed to change password");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Filter designs based on search and product
  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const matchesSearch = design.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesProduct =
        productFilter === "all" || design.settings.mockup === productFilter;
      return matchesSearch && matchesProduct;
    });
  }, [designs, searchQuery, productFilter]);

  const getMockupName = (mockupId: string) => {
    const mockup = mockups.find((m) => m.id === mockupId);
    return mockup?.name || "Unknown";
  };

  const navigateToVisualizer = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("fabric-previewer");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const navigateToEditDesign = (designId: string) => {
    navigate(`/?design=${designId}`);
    setTimeout(() => {
      const element = document.getElementById("fabric-previewer");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1
                className="text-xl font-bold text-white cursor-pointer hover:text-orange-500"
                onClick={() => navigate("/")}
              >
                Fabric Studio
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-transparent hover:text-orange-500"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800">
                <DropdownMenuLabel className="text-white">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-gray-300 focus:bg-gray-800 focus:text-white"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-red-400 focus:bg-gray-800 focus:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome back!</h2>
          <p className="text-gray-400 mt-1">Here are your saved designs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Designs
              </CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {designs.length}
              </div>
              <p className="text-xs text-gray-500">Saved designs</p>
            </CardContent>
          </Card>

          <Button
            className="h-full min-h-[100px] flex flex-col items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700"
            onClick={navigateToVisualizer}
          >
            <Package className="h-8 w-8" />
            <span>Create New Design</span>
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Saved Designs
            {filteredDesigns.length !== designs.length && (
              <span className="text-gray-400 text-sm font-normal ml-2">
                ({filteredDesigns.length} of {designs.length})
              </span>
            )}
          </h3>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 max-h-[300px]">
                <SelectItem value="all" className="text-white">
                  All Products
                </SelectItem>
                {products.map((product) => (
                  <SelectItem
                    key={product.id}
                    value={product.id}
                    className="text-white"
                  >
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-4">
                  {designs.length === 0
                    ? "No saved designs yet"
                    : "No designs match your search"}
                </p>
                {designs.length === 0 ? (
                  <Button
                    onClick={navigateToVisualizer}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Create Your First Design
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setProductFilter("all");
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDesigns.map((design) => (
                <Card
                  key={design._id}
                  className="bg-gray-900 border-gray-800 overflow-hidden"
                >
                  <div className="aspect-square bg-gray-800 flex items-center justify-center">
                    {design.thumbnail ? (
                      <img
                        src={design.thumbnail}
                        alt={design.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-gray-600" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    {editingId === design._id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 bg-gray-800 text-white border-gray-700"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveName(design._id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent hover:bg-green-600"
                          onClick={() => handleSaveName(design._id)}
                        >
                          <Check className="h-4 w-4 text-green-400" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent hover:bg-red-600"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm text-white">
                            {design.name}
                          </CardTitle>
                          <p className="text-xs text-gray-500">
                            {getMockupName(design.settings.mockup)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700"
                          onClick={() => handleStartEdit(design)}
                        >
                          <Pencil className="h-3 w-3 text-gray-400" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                        onClick={() => navigateToEditDesign(design._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="p-0 h-8 w-8 bg-transparent hover:bg-gray-800"
                        onClick={() => handleDuplicateDesign(design)}
                      >
                        <Copy className="h-4 w-4 text-gray-300" />
                      </Button>
                      <Button
                        size="sm"
                        className="p-0 h-8 w-8 bg-transparent hover:bg-gray-800"
                        onClick={() => handleDownloadDesign(design)}
                      >
                        <Download className="h-4 w-4 text-gray-300" />
                      </Button>
                      <Button
                        size="sm"
                        className="p-0 h-8 w-8 bg-transparent hover:bg-gray-800"
                        onClick={() => handleDeleteDesign(design._id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="old-password" className="text-gray-300">
                Current Password
              </Label>
              <Input
                id="old-password"
                type="password"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-300">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-300">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={
                passwordLoading ||
                !oldPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="bg-orange-600 hover:bg-orange-700"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
