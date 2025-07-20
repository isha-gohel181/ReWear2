import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";
import { userService } from "@/lib/apiServices";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Shield,
  ArrowLeft,
  Save,
  Loader2,
  Edit3,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profileImageUrl: "",
    points: 0,
    role: "user",
    createdAt: "",
    emailVerified: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getProfile();
        const userData = response.data.user;
        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          email: userData.email || "",
          profileImageUrl: userData.profileImageUrl || "",
          points: userData.points || 0,
          role: userData.role || "user",
          createdAt: userData.createdAt || "",
          emailVerified: userData.emailVerified || false,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profile.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (profile.username && profile.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      setIsSaving(true);

      // Only send updatable fields
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username || undefined,
      };

      await userService.updateProfile(updateData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form to original values
    loadProfile();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Crown className="w-4 h-4" />
    ) : (
      <Shield className="w-4 h-4" />
    );
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-blue-100 text-blue-800";
  };

  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={profile.profileImageUrl || user?.imageUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profile.firstName} {profile.lastName}
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className={getRoleColor(profile.role)}>
                {getRoleIcon(profile.role)}
                {profile.role}
              </Badge>
              {profile.emailVerified && (
                <Badge variant="outline" className="text-green-600">
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile.points}
                </div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  disabled={!isEditing}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  disabled={!isEditing}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter a unique username"
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed here. Please update it in your Clerk
                account.
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
