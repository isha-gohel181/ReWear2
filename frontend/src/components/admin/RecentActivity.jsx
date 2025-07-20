import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, ArrowUpDown } from "lucide-react";
import { adminService } from "@/lib/apiServices";
import Loader from "@/components/shared/Loader";

const RecentActivity = () => {
  const [activity, setActivity] = useState({ items: [], swaps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await adminService.getStats();
        setActivity(response.data.recentActivity);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Recent Items */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Package className="h-5 w-5" />
            Recent Items
          </CardTitle>
          <CardDescription>Latest items added to the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activity.items.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent items
            </p>
          ) : (
            activity.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    by {item.owner.firstName} {item.owner.lastName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge
                      variant={
                        item.status === "pending"
                          ? "default"
                          : item.status === "approved"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground self-start sm:self-center whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Swaps */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ArrowUpDown className="h-5 w-5" />
            Recent Swaps
          </CardTitle>
          <CardDescription>Latest swap activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activity.swaps.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent swaps
            </p>
          ) : (
            activity.swaps.map((swap) => (
              <div
                key={swap._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className="text-xs">
                      {swap.requester.firstName?.charAt(0)}
                      {swap.requester.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className="text-xs">
                      {swap.provider.firstName?.charAt(0)}
                      {swap.provider.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {swap.requester.firstName} ↔ {swap.provider.firstName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {swap.requestedItem?.title}
                    {swap.offeredItem && ` ↔ ${swap.offeredItem.title}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge
                      variant={
                        swap.status === "pending"
                          ? "default"
                          : swap.status === "completed"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs capitalize"
                    >
                      {swap.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {swap.type === "direct_swap"
                        ? "Direct Swap"
                        : "Point Redemption"}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground self-start sm:self-center whitespace-nowrap">
                  {new Date(swap.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
