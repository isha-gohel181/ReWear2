// frontend/src/components/Navbar.jsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Browse Items", href: "/browse", signedIn: true },
    { name: "Add Item", href: "/add-item", signedIn: true },
    { name: "Dashboard", href: "/dashboard", signedIn: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Recycle className="h-8 w-8" />
            </motion.div>
            <span className="text-xl font-bold">ReWear</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      size="sm"
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                </Link>
              ))}
              {user?.publicMetadata?.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    size="sm"
                  >
                    Admin Panel
                  </Button>
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Get Started</Button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="md:hidden">
            <SignedIn>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 space-y-2 overflow-hidden"
            >
              <SignedIn>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user?.publicMetadata?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="px-4 py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
