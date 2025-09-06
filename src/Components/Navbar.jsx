import { useLocation, Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaFileInvoice,
  FaMoneyBill,
  FaBars,
} from "react-icons/fa";
import { IoIosJournal } from "react-icons/io";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { id: "sales-invoice", name: "Sales Invoice", path: "/sales-invoice", icon: <FaFileInvoice /> },
    { id: "purchase-invoice", name: "Purchase Invoice", path: "/purchase-invoice", icon: <FaMoneyBill /> },
    // { id: "stock-journal", name: "Stock Journal", path: "/stock-journal", icon: <IoIosJournal /> },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">ERP-BILLING</h2>
      </div>

      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        <FaBars />
      </button>

      <nav className={`navbar-menu ${mobileOpen ? "open" : ""}`}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.icon} {item.name}
          </Link>
        ))}

        <button className="nav-link logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </header>
  );
}
