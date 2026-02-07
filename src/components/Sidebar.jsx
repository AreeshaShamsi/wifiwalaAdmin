import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function TwoColumnSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get current page from URL
  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path === "/plans") return "Plans";
    if (path === "/users") return "Users";
    if (path === "/subscribed") return "Subscribed";
    if (path === "/offer") return "Offers";
    if (path === "/complain") return "Complain";
    if (path === "/vipoffers") return "VIP Offers";
    if (path === "/settings") return "Settings";
    if (path === "/logout") return "Logout";
    return "Home";
  };

  const [activeItem, setActiveItem] = useState(getCurrentPage());

  const handleNavClick = (path, href) => {
    if (path === "Logout") {
      sessionStorage.clear();
      window.location.href = "/";
      return;
    }
    setActiveItem(path);
    setMobileOpen(false);
    // Navigate to the page
    window.location.href = href;
  };

  const menuItems = [
    { icon: "fa-solid fa-house", label: "Home", path: "Home", href: "/" },
    {
      icon: "fa-solid fa-clipboard-list",
      label: "Plans",
      path: "Plans",
      href: "/plans",
    },
    {
      icon: "fa-solid fa-users",
      label: "Users",
      path: "Users",
      href: "/users",
    },
    {
      icon: "fa-solid fa-check-circle",
      label: "Subscribed",
      path: "Subscribed",
      href: "/subscribed",
    },
    {
      icon: "fa-solid fa-tag",
      label: "Offers",
      path: "Offers",
      href: "/offer",
    },
    {
      icon: "fa-solid fa-exclamation-circle",
      label: "Complain",
      path: "Complain",
      href: "/complain",
    },
    {
      icon: "fa-solid fa-crown",
      label: "VIP Offers",
      path: "VIP Offers",
      href: "/vipoffers",
    },
    {
      icon: "fa-solid fa-gear",
      label: "Settings",
      path: "Settings",
      href: "/settings",
    },
    {
      icon: "fa-solid fa-right-from-bracket",
      label: "Logout",
      path: "Logout",
      href: "/logout",
    },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md text-indigo-600 shadow-xl border border-white/40"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-r border-white/40 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Main menu panel */}
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
              P
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PrimeDesk
            </h1>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={`${item.path}-${index}`}
                onClick={() => handleNavClick(item.path, item.href)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl w-full text-left transition-all duration-200 ${
                  activeItem === item.path
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer with separator and Admin Panel text */}
          <div className="pt-4 border-t border-gray-200/50">
            <div className="text-center text-xs text-gray-500 font-medium">
              Admin Panel
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop - matches sidebar width (224px + 32px padding = 256px) */}
      <div className="hidden lg:block w-64"></div>
    </>
  );
}

export default TwoColumnSidebar;