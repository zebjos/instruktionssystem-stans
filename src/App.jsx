import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Camera, Home as HomeIcon, InfoIcon, ListIcon, Plus, ShieldUser } from "lucide-react";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import Instructions from "./pages/Instructions";
import Admin from "./pages/Admin";
import InfoPage from "./pages/InfoPage"
import UploadPage from "./pages/UploadPage";
import ArticlesList from "./pages/ArticlesList";

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <nav className={`navbar ${isAdmin ? "admin-navbar" : ""}`}>
        <div className="nav-container">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <HomeIcon size={20} />
            <span>Hem</span>
          </NavLink>

          <NavLink 
            to="/add" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Plus size={20} />
            <span>Lägg till</span>
          </NavLink>

          <NavLink 
            to="/upload" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Camera size={20} />
            <span>Ladda upp</span>
          </NavLink>

          <NavLink // FIX THIS TMRWE
            to="/articles" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <ListIcon size={20} />
            <span>Lista</span>
          </NavLink>

          <NavLink 
            to="/info" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <InfoIcon size={20} />
            <span>Info</span>
          </NavLink>

          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <ShieldUser size={20} />
            <span>Admin</span>
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddArticle />} />
        <Route path="/instructions/:articleNumber" element={<Instructions />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;