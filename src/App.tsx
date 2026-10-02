import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/landing/LandingPage";
import RegisterPage from "./pages/register/RegisterPage";
import ThankYouPage from "./pages/ThankYouPage";

export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
      <Toaster position="bottom-center" />
    </div>
  );
}
