import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EntrepreneurList from "./pages/EntrepreneurList";
import EntrepreneurProfile from "./pages/EntrepreneurProfile";
import ProductList from "./pages/ProductList";
import CustomerDashboard from "./pages/CustomerDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/entrepreneurs" element={<EntrepreneurList />} />
          <Route path="/entrepreneurs/:id" element={<EntrepreneurProfile />} />
          <Route path="/products" element={<ProductList />} />

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entrepreneur/dashboard"
            element={
              <ProtectedRoute role="ENTREPRENEUR">
                <EntrepreneurDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
