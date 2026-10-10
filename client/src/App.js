import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1 mb-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
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
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
