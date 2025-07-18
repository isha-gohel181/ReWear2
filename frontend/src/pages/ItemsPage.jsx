import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Search, Filter, Plus } from "lucide-react";
import { itemService } from "@/lib/apiServices";
import { toast } from "sonner";

const ItemsPage = () => {
  const navigate = useNavigate();
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
    }, 500), // 500ms delay
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
      const response = await itemService.getItems(params);

      if (response.status === 200 && response.data) {
        setItems(response.data.items || []);
        setPagination(response.data.pagination || {});
      } else {
        toast.error("No items found or not modified.");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Browse Items</h1>
          <p className="text-muted-foreground">
            Discover amazing clothing items from our community
          </p>
        </div>
        <Button onClick={() => navigate("/add-item")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search items..."
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
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card
            key={item._id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div onClick={() => navigate(`/items/${item._id}`)}>
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{item.condition}</Badge>
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
                  <Badge variant="outline">{item.status}</Badge>
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

export default ItemsPage;
