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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <AuthProvider>
        <SkeletonTheme baseColor="#1E2832" highlightColor="#2C363F">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/purchase" element={<PurchasePage />} />
              <Route path="/bookmark" element={<BookmarkPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/" element={<BerandaPage />} />
            <Route path="/about" element={<BerandaPage />} />
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
        </SkeletonTheme>
      </AuthProvider>
    </Router>
  );
}

export default App;
