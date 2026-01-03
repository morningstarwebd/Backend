import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import PublicContact from './pages/PublicContact';
import Fund from './pages/Fund';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import BlogManager from './pages/BlogManager';
import CategoryManager from './pages/CategoryManager';
import FAQManager from './pages/FAQManager';
import MessageManager from './pages/MessageManager';
import UserManager from './pages/UserManager';
import SettingsManager from './pages/SettingsManager';

// Styles
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <AdminLayout>
      {children}
    </AdminLayout>
  ) : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/contact" element={
            <PublicLayout>
              <PublicContact />
            </PublicLayout>
          } />
          <Route path="/funds" element={
            <PublicLayout>
              <Fund />
            </PublicLayout>
          } />

          <Route path="/admin/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><CategoryManager /></ProtectedRoute>} />
          <Route path="/admin/faqs" element={<ProtectedRoute><FAQManager /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessageManager /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManager /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
