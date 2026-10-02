import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/landing/LandingPage";
import RegisterPage from "./pages/register/RegisterPage";

const TeamPage = lazy(() => import("./pages/team/TeamPage"));

export default function App() {
  return (
    <div className="w-full min-h-screen">
      {/* Before Routes so its subscription effect runs before pages toast on mount. */}
      <Toaster position="bottom-center" />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0f1923" }} />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:slug" element={<TeamPage />} />
          <Route path="/thank-you" element={<Navigate to="/team" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
