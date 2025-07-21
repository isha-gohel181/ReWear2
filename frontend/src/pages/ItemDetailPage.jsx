import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Loader from "@/components/shared/Loader";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Coins,
  RefreshCw,
} from "lucide-react";
import { itemService, swapService } from "@/lib/apiServices";
import { toast } from "sonner";

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userItems, setUserItems] = useState([]);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [swapMessage, setSwapMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 👍 NEW: Like states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likePending, setLikePending] = useState(false);

  useEffect(() => {
    fetchItem();
    if (isSignedIn) {
      fetchUserItems();
    }
  }, [id, isSignedIn]);

  const fetchItem = async () => {
    try {
      const response = await itemService.getItemById(id);
      const itemData = response.data.item;
      setItem(itemData);

      // 👍 NEW: Set like state
      setLikeCount(itemData.likeCount || 0);
      if (isSignedIn && user && itemData.likes) {
        // Check if current user has liked this item
        const userLiked = itemData.likes.some((like) =>
          typeof like === "object" ? like.clerkId === user.id : false
        );
        setIsLiked(userLiked);
      }
    } catch (error) {
      toast.error("Failed to load item details");
      navigate("/items");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await itemService.getItems({ status: "approved" });
      const filteredItems = response.data.items.filter(
        (userItem) =>
          userItem._id !== id &&
          userItem.owner &&
          userItem.owner.clerkId === user?.id
      );
      setUserItems(filteredItems);
    } catch (error) {
      console.error("Error fetching user items:", error);
    }
  };

  // 👍 NEW: Handle like toggle
  const handleLikeToggle = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to like items");
      return;
    }

    if (likePending) return;

    setLikePending(true);
    try {
      const response = await itemService.toggleLike(id);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update like");
    } finally {
      setLikePending(false);
    }
  };

  // 📤 NEW: Handle share
  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: `Check out this ${item.category.toLowerCase()} on ReWear!`,
      url: window.location.href,
    };

    try {
      // Try using Web Share API first (mobile/modern browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        // Track share in backend
        await itemService.shareItem(id);
        toast.success("Item shared successfully!");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Track share in backend
        await itemService.shareItem(id);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      // Final fallback: Just copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        await itemService.shareItem(id);
        toast.success("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Share failed:", error);
        toast.error("Failed to share item");
      }
    }
  };

  const handleSwapRequest = async () => {
    if (!selectedItemId) {
      toast.error("Please select an item to offer in exchange");
      return;
    }

    setSubmitting(true);
    try {
      await swapService.requestSwap({
        requestedItemId: id,
        offeredItemId: selectedItemId,
        message: swapMessage,
        type: "direct_swap",
      });
      toast.success("Swap request sent successfully!");
      setSwapDialogOpen(false);
      setSelectedItemId("");
      setSwapMessage("");
    } catch (error) {
      toast.error("Failed to send swap request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeem = async () => {
    setSubmitting(true);
    try {
      await swapService.requestSwap({
        requestedItemId: id,
        type: "point_redemption",
      });
      toast.success("Item redeemed successfully!");
      setRedeemDialogOpen(false);
      fetchItem();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to redeem item";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isOwner = item && user && item.owner.clerkId === user.id;
  const canInteract = isSignedIn && !isOwner && item?.status === "approved";

  if (loading) {
    return <Loader />;
  }

  if (!item) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Button onClick={() => navigate("/items")}>Back to Items</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pb-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/items")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Items
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <img
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">{item.condition}</Badge>
            </div>
          </div>

          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Info Section */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>
              <div className="flex space-x-2">
                {/* 👍 NEW: Working Like Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLikeToggle}
                  disabled={likePending}
                  className={`${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-500 hover:text-red-500"
                  } transition-colors`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                </Button>

                {/* 📤 NEW: Working Share Button */}
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <Badge variant="outline">{item.status}</Badge>
              <span className="flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                {item.pointValue} points
              </span>
              {/* 👍 NEW: Like count display */}
              {likeCount > 0 && (
                <span className="flex items-center text-sm">
                  <Heart className="h-3 w-3 mr-1" />
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </span>
              )}
            </div>
          </div>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{item.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{item.condition}</p>
                </div>
              </div>

              {item.tags?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.owner.profileImageUrl} />
                  <AvatarFallback>
                    {item.owner.firstName?.[0]}
                    {item.owner.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {item.owner.firstName} {item.owner.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{item.owner.username}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactions */}
          {canInteract && (
            <div className="space-y-3">
              <Dialog open={swapDialogOpen} onOpenChange={setSwapDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Swap
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Item Swap</DialogTitle>
                    <DialogDescription>
                      Select one of your items to offer in exchange for "
                      {item.title}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Your Item to Offer</Label>
                      <Select
                        value={selectedItemId}
                        onValueChange={setSelectedItemId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item to offer" />
                        </SelectTrigger>
                        <SelectContent>
                          {userItems?.length > 0 ? (
                            userItems.map((item) => (
                              <SelectItem key={item._id} value={item._id}>
                                {item.title} - {item.category} ({item.size})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              No items available
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Message (Optional)</Label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={swapMessage}
                        onChange={(e) => setSwapMessage(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleSwapRequest}
                        disabled={submitting || !selectedItemId}
                        className="flex-1"
                      >
                        {submitting ? "Sending..." : "Send Request"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSwapDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={redeemDialogOpen}
                onOpenChange={setRedeemDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="lg">
                    <Coins className="h-4 w-4 mr-2" />
                    Redeem with Points
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Redeem Item with Points</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to redeem "{item.title}" for{" "}
                      {item.pointValue} points?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleRedeem}
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting
                        ? "Redeeming..."
                        : `Redeem for ${item.pointValue} Points`}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRedeemDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Owner
              </Button>
            </div>
          )}

          {isOwner && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/items/${id}/edit`)}
                className="w-full"
                variant="outline"
              >
                Edit Item
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                This is your item
              </p>
            </div>
          )}

          {!isSignedIn && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/sign-in")}
                className="w-full"
                size="lg"
              >
                Sign In to Interact
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
