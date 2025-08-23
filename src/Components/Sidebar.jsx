import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaAngleDoubleLeft,
  FaTachometerAlt,
  FaTags,
  FaStore,
  FaWarehouse,
  FaReceipt,
  FaListAlt,
  FaFileInvoice,
  FaMoneyBill,
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ menu structure
  const menuItems = [
    {
      id: 1,
      name: "Masters",
      icon: <FaBox />,
      children: [
        { id: "1-1", name: "Product Master", path: "/newProduct", icon: <FaTags /> },
        { id: "1-2", name: "Retailer Master", path: "/retailer", icon: <FaStore /> },
        { id: "1-3", name: "Godown Master", path: "/godown", icon: <FaWarehouse /> },
        { id: "1-4", name: "Voucher Master", path: "/voucher", icon: <FaReceipt /> },
      ],
    },
    {
      id: 2,
      name: "Sale Order",
      icon: <FaClipboardList />,
      children: [
        { id: "2-1", name: "Sales List", path: "/sales-list", icon: <FaListAlt /> },
        { id: "2-2", name: "Sales Invoice", path: "/sales-invoice", icon: <FaFileInvoice /> },
      ],
    },
    {
      id: 3,
      name: "Purchase",
      icon: <FaShoppingCart />,
      children: [
        { id: "3-1", name: "Purchase List", path: "/purchase-list", icon: <FaListAlt /> },
        { id: "3-2", name: "Purchase Invoice", path: "/purchase-invoice", icon: <FaMoneyBill /> },
      ],
    },
  ];

  const [expandedMenus, setExpandedMenus] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Auto-expand parent menu when route matches a child
  useEffect(() => {
    const newExpandedMenus = {};
    menuItems.forEach((menu) => {
      if (menu.children) {
        const hasActiveChild = menu.children.some(
          (child) => child.path === location.pathname
        );
        if (hasActiveChild) {
          newExpandedMenus[menu.id] = true;
        }
      }
    });
    setExpandedMenus((prev) => ({ ...prev, ...newExpandedMenus }));
  }, [location.pathname]); 

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleLogout = () => {
    navigate("/");
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <div key={item.id} className={`menu-section level-${level}`}>
          {item.children ? (
            <>
              <button
                className={`sidebar-btn level-${level}`}
                onClick={() => toggleMenu(item.id)}
              >
                {item.icon && <span className="icon">{item.icon}</span>}
                {!collapsed && item.name}
              </button>
              {expandedMenus[item.id] && !collapsed && (
                <div className="sidebar-submenu">
                  {renderMenu(item.children, level + 1)}
                </div>
              )}
            </>
          ) : (
            <Link
              to={item.path}
              className={`sidebar-sub-btn level-${level} ${isActive ? "active" : ""}`}
            >
              {item.icon && <span className="icon">{item.icon}</span>}
              {!collapsed && item.name}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaBars /> : <FaAngleDoubleLeft />}
      </button>

      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <h2 className="logo-text">ERP BILLING</h2>
          </div>
        )}
      </div>

      <div className="sidebar-scroll">
        <Link
          to="/dashboard"
          className={`sidebar-btn dashboard-link ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <FaTachometerAlt className="icon dashboard-icon" />
          {!collapsed && <span className="dashboard-text">Dashboard</span>}
        </Link>

        {/* ✅ Render expandable menus */}
        <nav className="sidebar-menu">{renderMenu(menuItems)}</nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
