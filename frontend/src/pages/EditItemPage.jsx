// frontend/src/pages/EditItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Camera,
  ArrowLeft,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Save,
  Trash2,
} from "lucide-react";
import { itemService } from "@/lib/apiServices";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";

// Form validation schema
const itemSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Please select a category"),
  type: z.string().min(1, "Please specify the type"),
  size: z.string().min(1, "Please select a size"),
  condition: z.string().min(1, "Please select the condition"),
  tags: z.string().optional(),
  pointValue: z
    .number()
    .min(1, "Point value must be at least 1")
    .max(100, "Point value cannot exceed 100"),
});

const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(itemSchema),
  });

  const categories = [
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Accessories",
    "Bags",
    "Jewelry",
    "Activewear",
    "Formal",
  ];

  // Category-specific size options
  const sizesByCategory = {
    outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
    tops: ["XS", "S", "M", "L", "XL", "XXL"],
    bottoms: ["XS", "S", "M", "L", "XL", "XXL"],
    dresses: ["XS", "S", "M", "L", "XL", "XXL"],
    activewear: ["XS", "S", "M", "L", "XL", "XXL"],
    formal: ["XS", "S", "M", "L", "XL", "XXL"],
    shoes: ["5", "6", "7", "8", "9", "10", "11"],
    bags: ["Small", "Medium", "Large"],
    accessories: ["One Size", "Small", "Medium", "Large"],
    jewelry: ["One Size", "Small", "Medium", "Large"],
  };

  const selectedCategory = watch("category");

  // Get size options based on selected category
  const getSizeOptions = () => {
    if (!selectedCategory) return [];
    const categoryKey = selectedCategory.toLowerCase();
    return sizesByCategory[categoryKey] || ["XS", "S", "M", "L", "XL", "XXL"];
  };

  const sizeOptions = getSizeOptions();

  const conditions = [
    "New with tags",
    "New without tags",
    "Like new",
    "Very good",
    "Good",
    "Fair",
  ];

  const conditionDescriptions = {
    "New with tags": "Brand new item with original tags attached",
    "New without tags": "Brand new item without tags, never worn",
    "Like new": "Worn once or twice, excellent condition",
    "Very good": "Minor signs of wear, great condition",
    Good: "Some signs of wear but still in good shape",
    Fair: "Noticeable wear but still functional and wearable",
  };

  // Fetch item data on component mount
  useEffect(() => {
    if (isSignedIn && user && id) {
      fetchItemData();
    }
  }, [id, isSignedIn, user]);

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(id);
      const itemData = response.data.item;

      // 🐛 DEBUG: Add comprehensive logging
      console.log("=== EDIT ITEM DEBUG ===");
      console.log("Item data:", itemData);
      console.log("Item owner:", itemData.owner);
      console.log("Item owner clerkId:", itemData.owner?.clerkId);
      console.log("Current user:", user);
      console.log("Current user id:", user?.id);
      console.log("User signed in:", isSignedIn);
      console.log("Comparison result:", itemData.owner?.clerkId === user?.id);
      console.log("========================");

      // 🔧 ENHANCED OWNER CHECK: Multiple fallback comparisons
      const isOwner = checkIfUserIsOwner(itemData, user);

      if (!isOwner) {
        console.error("❌ Owner check failed");
        console.error("Expected:", user?.id);
        console.error("Got:", itemData.owner?.clerkId);
        toast.error("You don't have permission to edit this item");
        navigate("/dashboard");
        return;
      }

      console.log("✅ Owner check passed");

      setItem(itemData);
      setExistingImages(itemData.images || []);
      setSelectedTags(itemData.tags || []);

      // Populate form with existing data
      reset({
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        type: itemData.type,
        size: itemData.size,
        condition: itemData.condition,
        pointValue: itemData.pointValue,
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item data");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // 🔧 ENHANCED OWNER CHECK FUNCTION
  const checkIfUserIsOwner = (itemData, currentUser) => {
    if (!currentUser || !itemData?.owner) {
      console.log("❌ Missing user or owner data");
      return false;
    }

    const ownerClerkId = itemData.owner.clerkId;
    const userClerkId = currentUser.id;

    // Multiple comparison methods
    const comparisons = [
      // Direct comparison
      ownerClerkId === userClerkId,
      // String comparison (in case of type differences)
      String(ownerClerkId) === String(userClerkId),
      // Case-insensitive comparison
      String(ownerClerkId).toLowerCase() === String(userClerkId).toLowerCase(),
      // Trim whitespace
      String(ownerClerkId).trim() === String(userClerkId).trim(),
    ];

    console.log("Owner check comparisons:", {
      ownerClerkId,
      userClerkId,
      directMatch: comparisons[0],
      stringMatch: comparisons[1],
      caseInsensitive: comparisons[2],
      trimmed: comparisons[3],
    });

    // Return true if any comparison passes
    return comparisons.some((result) => result === true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 6,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const totalImages =
        existingImages.length -
        removedImages.length +
        newImages.length +
        acceptedFiles.length;
      if (totalImages > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }

      const newImageFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));
      setNewImages((prev) => [...prev, ...newImageFiles]);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error("File too large. Maximum size is 5MB");
          } else if (error.code === "file-invalid-type") {
            toast.error("Invalid file type. Please use JPEG, PNG, or WebP");
          }
        });
      });
    },
  });

  const removeExistingImage = (imageUrl) => {
    setRemovedImages((prev) => [...prev, imageUrl]);
  };

  const restoreExistingImage = (imageUrl) => {
    setRemovedImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const removeNewImage = (imageId) => {
    setNewImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      const removedImage = prev.find((img) => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return filtered;
    });
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !selectedTags.includes(tagInput.trim()) &&
      selectedTags.length < 10
    ) {
      setSelectedTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];

    if (step === 1) {
      const totalImages =
        existingImages.length - removedImages.length + newImages.length;
      if (totalImages === 0) {
        toast.error("Please keep at least one image");
        return;
      }
      setStep(2);
      return;
    } else if (step === 2) {
      fieldsToValidate = ["title", "description"];
    } else if (step === 3) {
      fieldsToValidate = [
        "category",
        "type",
        "size",
        "condition",
        "pointValue",
      ];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    const totalImages =
      existingImages.length - removedImages.length + newImages.length;
    if (totalImages === 0) {
      toast.error("Please keep at least one image");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Append form fields
      Object.keys(data).forEach((key) => {
        if (key === "tags") {
          const tagsString = selectedTags.join(",");
          formData.append(key, tagsString);
        } else {
          formData.append(key, data[key]);
        }
      });

      // Append new images
      newImages.forEach((image) => {
        formData.append("images", image.file);
      });

      // Add removed images info (for backend to handle)
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      const response = await itemService.updateItem(id, formData);
      toast.success("Item updated successfully!");
      navigate(`/items/${id}`);
    } catch (error) {
      console.error("Error updating item:", error);
      if (error.response) {
        toast.error(
          `Server error: ${error.response.data.error || "Unknown error"}`
        );
      } else if (error.request) {
        toast.error("Network error: Could not connect to server");
      } else {
        toast.error("Failed to update item");
      }
    } finally {
      setUploading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Manage Photos";
      case 2:
        return "Edit Details";
      case 3:
        return "Update Specifications";
      case 4:
        return "Review Changes";
      default:
        return "Edit Item";
    }
  };

  const getTotalImages = () => {
    return existingImages.length - removedImages.length + newImages.length;
  };

  const getVisibleExistingImages = () => {
    return existingImages.filter((url) => !removedImages.includes(url));
  };

  // Wait for user to be loaded before checking permissions
  if (!isSignedIn || !user) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!item) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Item</h1>
            <p className="text-muted-foreground">
              Update your item listing details
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Step {step} of 4: {getStepTitle()}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Manage Photos */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Manage Photos
              </CardTitle>
              <CardDescription>
                Keep, remove, or add photos. Maximum 6 photos allowed. At least
                one photo is required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Current Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((imageUrl, index) => {
                      const isRemoved = removedImages.includes(imageUrl);
                      return (
                        <div
                          key={imageUrl}
                          className={`relative group ${
                            isRemoved ? "opacity-50" : ""
                          }`}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden border">
                            <img
                              src={imageUrl}
                              alt={`Current ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {index === 0 && !isRemoved && (
                            <Badge className="absolute top-2 left-2">
                              Main Photo
                            </Badge>
                          )}
                          {isRemoved ? (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => restoreExistingImage(imageUrl)}
                              >
                                Restore
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeExistingImage(imageUrl)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">New Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newImages.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={image.preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className="absolute top-2 left-2"
                        >
                          New
                        </Badge>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Photos */}
              {getTotalImages() < 6 && (
                <div>
                  <h3 className="font-medium mb-3">Add More Photos</h3>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive
                            ? "Drop photos here"
                            : "Add more photos"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {6 - getTotalImages()} more photos allowed • Up to 5MB
                          each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Total Photos: {getTotalImages()}/6
                  </span>
                  {getTotalImages() === 0 && (
                    <span className="text-sm text-red-600">
                      ⚠️ At least one photo required
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Edit Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Item Details</CardTitle>
              <CardDescription>
                Update the title, description, and tags for your item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Vintage Denim Jacket"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition, style, brand, and any other relevant details..."
                  className="min-h-[120px]"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Tags (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Add relevant tags like brand, style, color, etc. (max 10 tags)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Update Specifications */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Update Specifications</CardTitle>
              <CardDescription>
                Modify your item's category, size, condition, and other details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(value) => {
                      setValue("category", value);
                      setValue("size", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Type/Subtype *</Label>
                  <Input
                    id="type"
                    placeholder="e.g., T-shirt, Jeans, Sneakers"
                    {...register("type")}
                  />
                  {errors.type && (
                    <p className="text-sm text-destructive mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Select
                    value={watch("size")}
                    onValueChange={(value) => setValue("size", value)}
                    key={selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedCategory
                            ? `Select size for ${selectedCategory.toLowerCase()}`
                            : "Select category first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.size && (
                    <p className="text-sm text-destructive mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.size.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pointValue">Point Value *</Label>
                  <Input
                    id="pointValue"
                    type="number"
                    min="1"
                    max="100"
                    {...register("pointValue", { valueAsNumber: true })}
                  />
                  {errors.pointValue && (
                    <p className="text-sm text-destructive mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.pointValue.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={watch("condition")}
                  onValueChange={(value) => setValue("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.condition.message}
                  </p>
                )}
                {watch("condition") && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {conditionDescriptions[watch("condition")]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review Changes */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Changes</CardTitle>
              <CardDescription>
                Please review all changes before updating your item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images Preview */}
              <div>
                <h3 className="font-medium mb-2">
                  Photos ({getTotalImages()})
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {/* Existing images */}
                  {getVisibleExistingImages().map((imageUrl, index) => (
                    <div key={imageUrl} className="aspect-square relative">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      {index === 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute bottom-1 left-1 text-xs"
                        >
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                  {/* New images */}
                  {newImages.map((image, index) => (
                    <div key={image.id} className="aspect-square relative">
                      <img
                        src={image.preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      <Badge
                        variant="outline"
                        className="absolute bottom-1 left-1 text-xs"
                      >
                        New
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Item Details Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Item Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Title:</span>{" "}
                      {watch("title")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>{" "}
                      {watch("category")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {watch("type")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>{" "}
                      {watch("size")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Condition:</span>{" "}
                      {watch("condition")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Point Value:
                      </span>{" "}
                      {watch("pointValue")}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {watch("description")}
                  </p>

                  {selectedTags.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.map((tag, index) => (
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
                </div>
              </div>

              {/* Changes Summary */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900">Important Note</p>
                    <p className="text-amber-700 mt-1">
                      Your updated item may need to be re-reviewed by our
                      moderation team if significant changes are made. This
                      could temporarily change your item's status.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/items/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                <Save className="h-4 w-4 mr-2" />
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditItemPage;
