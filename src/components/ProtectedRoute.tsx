import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, loadingProfile, userProfile } = useAuth();
  const location = useLocation();

  if (loading || loadingProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't accepted terms, and they are not already on the accept-terms page, redirect them.
  if (userProfile && userProfile.termsAccepted === false && location.pathname !== '/accept-terms') {
    return <Navigate to="/accept-terms" replace />;
  }

  // If user has accepted terms but tries to access /accept-terms, redirect them to home.
  if (userProfile && userProfile.termsAccepted === true && location.pathname === '/accept-terms') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;