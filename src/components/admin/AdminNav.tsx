import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Package, Users, FileText, LogOut, ArrowLeft, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Manage Products', href: '/admin/products', icon: Package },
  { name: 'User Overview', href: '/admin/users', icon: Users },
  { name: 'Order Logs', href: '/admin/orders', icon: FileText },
  { name: 'Support Tickets', href: '/admin/tickets', icon: LifeBuoy },
];

interface AdminNavProps {
  onLinkClick?: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLinkClick }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (onLinkClick) onLinkClick();
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/admin'}
            onClick={onLinkClick}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground',
                isActive ? 'bg-primary text-primary-foreground font-semibold shadow-soft' : ''
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Go to Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNav;