// frontend/src/pages/AdminDashboard.jsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminStats from "../components/admin/AdminStats";
import ItemModerationList from "../components/admin/ItemModerationList";
import UserManagement from "../components/admin/UserManagement";
import RecentActivity from "../components/admin/RecentActivity";

const AdminDashboard = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading user data...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Access denied: Admin privileges required
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Manage items, users, and monitor platform activity
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex sm:grid sm:grid-cols-4 gap-2 w-max sm:w-full">
            <TabsTrigger value="overview" className="min-w-[120px]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="moderation" className="min-w-[120px]">
              Item Moderation
            </TabsTrigger>
            <TabsTrigger value="users" className="min-w-[120px]">
              User Management
            </TabsTrigger>
            <TabsTrigger value="activity" className="min-w-[120px]">
              Recent Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <AdminStats />
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <ItemModerationList />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
