import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import NotAvailable from "./pages/NotAvailable";
import ProtectedRoute from "./components/ProtectedRoute";
import BrowseProducts from "./pages/BrowseProducts";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import UserOverview from "./pages/admin/UserOverview";
import OrderLogs from "./pages/admin/OrderLogs";
import Forbidden from "./pages/Forbidden";
import OrderDetail from "./pages/OrderDetail";
import MyOrdersPage from "./pages/MyOrdersPage";
import AuthRoute from "./components/AuthRoute";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ManageTickets from "./pages/admin/ManageTickets";

const AdminRoutes = () => (
  <AdminRoute>
    <AdminLayout />
  </AdminRoute>
);

function App() {
  return (
    <Routes>
      {/* Public Routes that are restricted for logged-in users */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
      
      {/* Other Public Routes */}
      <Route path="/not-available" element={<NotAvailable />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse/:category"
        element={
          <ProtectedRoute>
            <BrowseProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success/:orderId"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:productId" element={<EditProduct />} />
        <Route path="users" element={<UserOverview />} />
        <Route path="orders" element={<OrderLogs />} />
        <Route path="tickets" element={<ManageTickets />} />
      </Route>
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;