import { BrowserRouter, Routes, Route } from "react-router-dom";
import Website from "./pages/Website.jsx";
import Plan from "./pages/Plan.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </BrowserRouter>
  );
}
