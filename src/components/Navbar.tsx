import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Award,
  Sparkles,
  Flame,
  Calendar,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import MainLogo from "../assets/mainlogo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home, iconOnly: true },
    { to: "/users", label: "Users", icon: Users },
    { to: "/profile", label: "Profile", icon: Users },
    { to: "/chabiba", label: "Chabiba", icon: Award },
    { to: "/tala2e3", label: "Tala2e3", icon: Sparkles },
    { to: "/forsan", label: "Forsan", icon: Flame },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/shops", label: "Shops", icon: ShoppingBag },
    { to: "/contacts", label: "Contacts", icon: Phone },
    { to: "/meetings", label: "Meetings", icon: UserGroupIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden">
              <img
                src={MainLogo}
                alt="Main Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Text */}
            <span className="hidden sm:block text-lg font-bold text-white">
              Brotherhood
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  } ${item.iconOnly ? "justify-center w-10" : ""}`
                }
              >
                <item.icon className="w-4 h-4" />

                {!item.iconOnly && <span>{item.label}</span>}

                {item.iconOnly && (
                  <span className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-xs px-3 py-1 rounded-md shadow-lg">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Logout (Icon Only) */}
            <button
              onClick={handleLogout}
              className="group relative ml-2 flex items-center justify-center w-10 h-10 rounded-lg text-red-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-xs px-3 py-1 rounded-md shadow-lg">
                Logout
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 border-t border-slate-800 pt-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
