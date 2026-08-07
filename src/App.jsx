import { BrowserRouter, Routes, Route } from "react-router-dom";
import Website from "./pages/Website.jsx";
import Plan from "./pages/Plan.jsx";
import AuthGate from "./AuthGate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Website />} />
                        <Route path="/plan" element={<AuthGate><Plan /></AuthGate>} />
      </Routes>
    </BrowserRouter>
  );
}
