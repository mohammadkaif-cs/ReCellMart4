import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Home, User, ShieldCheck, LayoutDashboard, ShoppingCart, Package, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { usePWAInstall } from '@/hooks/use-pwa-install';

// Base navigation items visible to everyone
const baseNavItems = [
  { name: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
  { name: 'Products', href: '/browse/mobiles', icon: <Package className="h-4 w-4" /> },
];

// Navigation items for logged-out users
const publicNavItems = [
  { name: 'Login', href: '/login', icon: null },
  { name: 'Signup', href: '/signup', icon: null },
];

// Additional navigation items for logged-in users
const userNavItems = [
  { name: 'My Orders', href: '/my-orders', icon: <ShoppingCart className="h-4 w-4" /> },
];

// Navigation item for admin users
const adminNavItem = { name: 'Admin', href: '/admin', icon: <ShieldCheck className="h-4 w-4" /> };

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userRole, logout, userProfile, cart } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { deferredPrompt, installPWA, isAppInstalled } = usePWAInstall();

  // Dynamically build navigation items based on auth state
  const navItems = [...baseNavItems];
  if (currentUser) {
    navItems.push(...userNavItems);
    if (userRole === 'admin') {
      navItems.push(adminNavItem);
    }
  } else {
    navItems.push(...publicNavItems);
  }

  const userInitial = currentUser?.email?.charAt(0).toUpperCase() || '?';

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">ReCellMart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button key={item.name} asChild variant="ghost" className="p-0 h-auto">
              <Link
                to={item.href!}
                className={cn(
                  "transition-colors flex items-center text-sm font-medium px-4 py-2 rounded-md",
                  location.pathname === item.href
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-primary/80 hover:bg-secondary"
                )}
              >
                {item.icon}
                <span className={cn("whitespace-nowrap", item.icon ? 'ml-2' : '')}>{item.name}</span>
              </Link>
            </Button>
          ))}
          {currentUser && (
            <div className="flex items-center ml-4 space-x-2">
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                      {cart.length}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
                      <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name} />
                      <AvatarFallback className="bg-secondary text-primary font-bold">{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-border shadow-soft-lg" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/terms-and-conditions')} className="cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Terms & Conditions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          {currentUser && (
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 text-primary" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {cart.length}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-l">
              <nav className="flex flex-col gap-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                {deferredPrompt && !isAppInstalled && (
                  <button
                    onClick={() => {
                      installPWA();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left w-full"
                  >
                    <Download className="h-4 w-4" />
                    Install App
                  </button>
                )}
                {currentUser && (
                  <>
                    <div className="border-t my-2"></div>
                     <Link
                      to="/dashboard?tab=profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile & Dashboard
                    </Link>
                    <Link
                      to="/terms-and-conditions"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Terms & Conditions
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;