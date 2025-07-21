import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Heart,
  HeartOff,
  Share2,
  ShoppingBag,
  Trash2,
  Eye,
} from "lucide-react";
import { itemService } from "@/lib/apiServices";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";

const LikedItemsPage = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate search input state from filters
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    size: searchParams.get("size") || "",
    condition: searchParams.get("condition") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });
  const [pagination, setPagination] = useState({});

  const categories = [
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Accessories",
    "Shoes",
    "Bags",
    "Jewelry",
    "Activewear",
    "Formal",
    "Other",
  ];
  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
  ];
  const conditions = [
    "New",
    "Like new",
    "Good",
    "Very good",
    "Fair",
    "Worn",
    "New Without Tags",
    "New With Tags",
  ];

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }));
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
      return;
    }
    fetchLikedItems();
  }, [filters, isSignedIn]);

  const fetchLikedItems = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
      const response = await itemService.getLikedItems(params);

      if (response.status === 200 && response.data) {
        setItems(response.data.items || []);
        setPagination(response.data.pagination || {});
      } else {
        toast.error("No liked items found.");
      }
    } catch (error) {
      console.error("Error fetching liked items:", error);
      toast.error("Failed to load liked items");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: newValue, page: 1 };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "",
      size: "",
      condition: "",
      page: 1,
    });
    setSearchParams(new URLSearchParams());
  };

  // Unlike item directly from this page
  const handleUnlike = async (itemId, e) => {
    e.stopPropagation(); // Prevent navigation to item detail
    try {
      const response = await itemService.toggleLike(itemId);
      toast.success("Item removed from likes");
      // Remove item from the list
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      toast.error("Failed to remove like");
    }
  };

  // Share item
  const handleShare = async (item, e) => {
    e.stopPropagation(); // Prevent navigation to item detail
    const shareData = {
      title: item.title,
      text: `Check out this ${item.category.toLowerCase()} on ReWear!`,
      url: `${window.location.origin}/items/${item._id}`,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        await itemService.shareItem(item._id);
        toast.success("Item shared successfully!");
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/items/${item._id}`
        );
        await itemService.shareItem(item._id);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/items/${item._id}`
        );
        await itemService.shareItem(item._id);
        toast.success("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Share failed:", error);
        toast.error("Failed to share item");
      }
    }
  };

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500 fill-current" />
            My Liked Items
          </h1>
          <p className="text-muted-foreground">
            Your favorite items from the ReWear community
          </p>
        </div>
        <Button onClick={() => navigate("/items")}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Browse More Items
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 fill-current mr-2" />
                <span className="font-medium">
                  {pagination.total || 0} liked items
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter Your Liked Items</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search liked items..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.size || "all"}
              onValueChange={(value) => handleFilterChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.condition || "all"}
              onValueChange={(value) => handleFilterChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* No items message */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-2">No liked items yet</h3>
          <p className="text-muted-foreground mb-4">
            Start browsing items and like the ones you love!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={() => navigate("/items")}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Items
            </Button>
            {(filters.search ||
              filters.category ||
              filters.size ||
              filters.condition) && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card
            key={item._id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div onClick={() => navigate(`/items/${item._id}`)}>
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{item.condition}</Badge>
                </div>
                {/* Liked indicator */}
                <div className="absolute top-2 left-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.category} • {item.size}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">
                    {item.pointValue} points
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {item.likeCount > 0 && (
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {item.likeCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/items/${item._id}`);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleShare(item, e)}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleUnlike(item._id, e)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <HeartOff className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default LikedItemsPage;
