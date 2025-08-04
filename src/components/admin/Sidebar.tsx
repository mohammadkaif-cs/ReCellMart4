import React from 'react';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-4 border-b border-border">
        <Link to="/admin">
          <h1 className="text-2xl font-bold text-primary text-center">Admin Panel</h1>
        </Link>
      </div>
      <AdminNav />
    </aside>
  );
};

export default Sidebar;