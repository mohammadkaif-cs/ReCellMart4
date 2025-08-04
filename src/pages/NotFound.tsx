import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center bg-card p-8 rounded-lg border border-primary/20">
        <h1 className="text-4xl font-bold mb-4 text-destructive">404</h1>
        <p className="text-xl text-foreground mb-4">Oops! Page not found</p>
        <Link to="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;