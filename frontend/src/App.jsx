import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Properties from "./pages/Properties";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";


function AppContent() {

  const location = useLocation();

  // Pages which have their own layout
  const isDashboard =
    location.pathname === "/tenant-dashboard" ||
    location.pathname === "/owner-dashboard";

  // Login, Register, Role Selection should not show main Navbar
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/select-role";


  return (
    <>
      {!isDashboard && !isAuthPage && <Navbar />}

      <Routes>

        {/* =========================
            HOME
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================
            PROPERTIES
        ========================== */}

        <Route
          path="/properties"
          element={<Properties />}
        />
        {/* =========================
            wishlist
        ========================== */}

         <Route
                 path="/wishlist"
                element={<Wishlist />}
/>

        {/* =========================
            CHAT
        ========================== */}

        <Route
          path="/chat"
          element={<Chat />}
        />


        {/* =========================
            AUTH
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            ROLE SELECTION
        ========================== */}

        <Route
          path="/select-role"
          element={<RoleSelection />}
        />


        {/* =========================
            TENANT DASHBOARD
        ========================== */}

        <Route
          path="/tenant-dashboard"
          element={<TenantDashboard />}
        />


        {/* =========================
            OWNER DASHBOARD
        ========================== */}

        <Route
          path="/owner-dashboard"
          element={<OwnerDashboard />}
        />


        {/* =========================
            CONTACT
        ========================== */}

        <Route
          path="/Contact"
          element={<Contact />}
        />


        {/* =========================
            ABOUT
        ========================== */}

        <Route
          path="/About"
          element={<About />}
        />


        {/* =========================
            404
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}


function App() {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;