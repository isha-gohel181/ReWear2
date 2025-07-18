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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const ItemModerationList = () => {
  const { getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0); // Reset to first image
  };

  const nextImage = () => {
    if (
      selectedItem?.images &&
      currentImageIndex < selectedItem.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
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
                {item.images && item.images.length > 1 && (
                  <Badge className="absolute top-2 left-2" variant="outline">
                    +{item.images.length - 1} more
                  </Badge>
                )}
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
                  onClick={() => openItemDetails(item)}
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

      {/* Item Details Dialog with Image Gallery */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Image Gallery */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="space-y-2">
                  {/* Main Image Display */}
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={selectedItem.images[currentImageIndex]}
                        alt={`${selectedItem.title} - Image ${
                          currentImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />

                      {/* Navigation Arrows */}
                      {selectedItem.images.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={nextImage}
                            disabled={
                              currentImageIndex ===
                              selectedItem.images.length - 1
                            }
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      {selectedItem.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {selectedItem.images.length}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  {selectedItem.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedItem.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Item Details */}
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p>
                  <strong>Type:</strong> {selectedItem.type}
                </p>
                <p>
                  <strong>Size:</strong> {selectedItem.size}
                </p>
                <p>
                  <strong>Condition:</strong> {selectedItem.condition}
                </p>
                <p>
                  <strong>Status:</strong> {selectedItem.status}
                </p>
                <p>
                  <strong>Tags:</strong> {selectedItem.tags?.join(", ")}
                </p>
                <p>
                  <strong>Point Value:</strong> {selectedItem.pointValue}
                </p>
                <p>
                  <strong>Owner:</strong> {selectedItem.owner?.firstName}{" "}
                  {selectedItem.owner?.lastName}
                </p>
                <p>
                  <strong>Uploaded on:</strong>{" "}
                  {new Date(selectedItem.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ItemModerationList;
