import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import Home from "./pages/Home";
import Vision from "./pages/Vision";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
