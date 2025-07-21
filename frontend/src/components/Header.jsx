// frontend/src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  useUser,
  useClerk,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Plus,
  User,
  Settings,
  LogOut,
  Shield,
  MessageSquare,
  Heart, // NEW
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/items", label: "Browse Items", icon: ShoppingBag },
    { href: "/add-item", label: "Add Item", icon: Plus, protected: true },
    { href: "/dashboard", label: "Dashboard", icon: User, protected: true },
    { href: "/swaps", label: "My Swaps", icon: MessageSquare, protected: true },
    { href: "/liked", label: "Liked Items", icon: Heart, protected: true }, // NEW
    {
      href: "/admin",
      label: "Admin Panel",
      icon: Shield,
      protected: true,
      adminOnly: true,
    },
  ];

  const visibleNavItems = navigationItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.protected && !isSignedIn) return false;
    return true;
  });

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">R</span>
            </motion.div>
            <span className="font-bold text-xl text-green-600">ReWear</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <motion.div whileHover={{ scale: 1.05 }} key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.adminOnly && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Admin
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || ""}
                      />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{user?.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                    {isAdmin && (
                      <Badge variant="outline" className="w-fit mt-1">
                        Admin
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/swaps")}>
                    <MessageSquare className="mr-2 h-4 w-4" /> My Swaps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/liked")}>
                    <Heart className="mr-2 h-4 w-4" /> Liked Items
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="mr-2 h-4 w-4" /> Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t py-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.adminOnly && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
