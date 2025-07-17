//frontend/src/components/admin/ItemModerationList.jsx
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
import { CheckCircle, XCircle, Eye, User, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";

const ItemModerationList = () => {
  const { getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [pagination, setPagination] = useState({});

   useEffect(() => {
      fetchPendingItems();
    }, []);

  const fetchPendingItems = async (page = 1) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/admin/pending-items?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch pending items");
    } finally {
      setLoading(false);
    }
  };

  const moderateItem = async (itemId, action) => {
    setModerating((prev) => ({ ...prev, [itemId]: true }));

    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/items/moderate`,
        { itemId, action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Item ${action}d successfully`);
      fetchPendingItems(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to ${action} item`);
    } finally {
      setModerating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pending items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Item Moderation</h2>
        <Badge variant="secondary">{pagination.total || 0} pending items</Badge>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No pending items for moderation
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {item.condition}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Size: {item.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>
                      {item.owner.firstName} {item.owner.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => moderateItem(item._id, "approve")}
                    disabled={moderating[item._id]}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => moderateItem(item._id, "reject")}
                    disabled={moderating[item._id]}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedItem(item)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <Button
              key={i + 1}
              size="sm"
              variant={pagination.page === i + 1 ? "default" : "outline"}
              onClick={() => fetchPendingItems(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemModerationList;
