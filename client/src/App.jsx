import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from '@/components/common/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Layout><ProductsPage /></Layout></ProtectedRoute>} />
        <Route path="/products/new" element={<ProtectedRoute><Layout><ProductFormPage /></Layout></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><Layout><ProductFormPage /></Layout></ProtectedRoute>} />

        <Route path="/inquiries" element={<ProtectedRoute><Layout><div>Inquiries Page</div></Layout></ProtectedRoute>} />
        <Route path="/inquiries/new" element={<ProtectedRoute><Layout><div>Inquiry Form</div></Layout></ProtectedRoute>} />
        <Route path="/inquiries/:id/edit" element={<ProtectedRoute><Layout><div>Inquiry Form</div></Layout></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}
export default App