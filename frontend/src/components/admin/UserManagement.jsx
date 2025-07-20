//frontend/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, Award, Shield } from "lucide-react";
import Loader from "@/components/shared/Loader";
import { toast } from "sonner";


const UserManagement = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [updatingRole, setUpdatingRole] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setUpdatingRole((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/user-role`,
        { userId, role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("User role updated successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update user role");
    } finally {
      setUpdatingRole((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Badge variant="secondary">{pagination.total || 0} total users</Badge>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left section - Avatar + Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback>
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate w-48 sm:w-auto">
                      {user.email}
                    </p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground truncate w-48 sm:w-auto">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right section - Points + Role */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between">
                  <div className="text-left sm:text-right space-y-1 w-full sm:w-auto">
                    <div className="flex items-center gap-1 text-sm">
                      <Award className="h-4 w-4" />
                      <span>{user.points} points</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>

                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        updateUserRole(user._id, newRole)
                      }
                      disabled={updatingRole[user._id]}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <Button
              key={i + 1}
              size="sm"
              variant={pagination.page === i + 1 ? "default" : "outline"}
              onClick={() => fetchUsers(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
