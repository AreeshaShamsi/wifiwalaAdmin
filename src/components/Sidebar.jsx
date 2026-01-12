import React, { useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";

function TwoColumnSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get current page from URL
  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path === '/plans') return 'Plans';
    if (path === '/offer') return 'Offers';
    if (path === '/settings') return 'Settings';
    if (path === '/logout') return 'Logout';
    return 'Home';
  };
  
  const [activeItem, setActiveItem] = useState(getCurrentPage());

  const handleNavClick = (path, href) => {
    setActiveItem(path);
    setMobileOpen(false);
    // Navigate to the page
    window.location.href = href;
  };

  const menuItems = [
    { icon: "fa-solid fa-house", label: "Home", path: "Home", href: "/" },
    { icon: "fa-solid fa-clipboard-list", label: "Plans", path: "Plans", href: "/plans" },
    { icon: "fa-solid fa-tag", label: "Offers", path: "Offers", href: "/offer" },
    { icon: "fa-solid fa-gear", label: "Settings", path: "Settings", href: "/settings" },
    { icon: "fa-solid fa-right-from-bracket", label: "Logout", path: "Logout", href: "/logout" },
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md text-indigo-600 shadow-xl border border-white/40"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-full p-4">
          {/* Main menu panel */}
          <aside className="w-56 bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-2xl text-gray-700 flex flex-col h-full rounded-3xl shadow-2xl border border-white/30">
            {/* Header */}
            <div className="px-5 py-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="text-base font-bold text-gray-800">PrimeDesk</span>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path, item.href)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl w-full text-left transition-all duration-200 ${
                        activeItem === item.path
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
                      }`}
                    >
                      <i className={`${item.icon} w-4 text-sm`}></i>
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer with separator and Admin Panel text */}
            <div className="px-3 pb-4">
              <div className="border-t border-gray-400/30 pt-3 mt-2">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <i className="fa-solid fa-circle-user text-lg"></i>
                  <span className="text-xs font-medium">Admin Panel</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Spacer for desktop - matches sidebar width (224px + 32px padding = 256px) */}
      <div className="hidden lg:block w-64"></div>
    </>
  );
}

export default TwoColumnSidebar;