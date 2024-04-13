import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BerandaPage from "./pages/beranda";
import BranchPage from "./pages/branch";
import ProductPage from "./pages/product";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PurchasePage from "./pages/purchase/purchase";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import VerificationPage from "./pages/verification";
import VerificationEmailPage from "./pages/verificationEmail";
import BookmarkPage from "./pages/bookmark";
import ProfilePage from "./pages/profile";
import ForgotPasswordPage from "./pages/forgotPassword";
import { ScrollToTop } from "./lib/ScrollToTop";
import ResetPasswordPage from "./pages/resetPassword";
import ContactPage from "./pages/contact";
import ChangePasswordPage from "./pages/changePassword";
import DashboardPage from "./pages/admin/dashboard";
import { AppProvider } from "./context/AppContext";
import DataSewaPage from "./pages/admin/dataSewa";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import LoginAdminPage from "./pages/admin/loginAdmin";
import UsersPage from "./pages/admin/users";
import ProductAdminPage from "./pages/admin/productAdmin";
import AboutPage from "./pages/about";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <SkeletonTheme baseColor="#1E2832" highlightColor="#2C363F">
        <AppProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<UserRoutes />} />
          </Routes>
        </AppProvider>
      </SkeletonTheme>
    </Router>
  );
}

function UserRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/bookmark" element={<BookmarkPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
        </Route>

        <Route path="/" element={<BerandaPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/catalog/:branchSlug" element={<BranchPage />} />
        <Route path="/catalog/:branchSlug/:categorySlug" element={<BranchPage />} />
        <Route path="/catalog/:branchSlug/:categorySlug/:subCategorySlug" element={<BranchPage />} />
        <Route path="/product/:productSlug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/email-verification" element={<VerificationEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </AuthProvider>
  );
}

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/data-sewa/:branchSlug" element={<DataSewaPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductAdminPage />} />
        </Route>

        <Route path="/login" element={<LoginAdminPage />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
