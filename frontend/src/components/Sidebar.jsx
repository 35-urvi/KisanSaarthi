import { motion } from "framer-motion"
import {
  Home,
  Sprout,
  Bug,
  CloudRain,
  Calendar,
  ShoppingCart,
  Warehouse,
  MessageCircle,
  User,
  LogOut,
  X,
  Layers,
  AreaChart
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
    { name: "Crop Planner", icon: <Sprout className="w-5 h-5" />, path: "/crop-recommendation" },
    { name: "Yield Prediction", icon: <AreaChart className="w-5 h-5" />, path: "/yield-prediction" },
    { name: "Disease Detection", icon: <Bug className="w-5 h-5" />, path: "/disease-detection" },
    { name: "Fertilizer Guide", icon: <Calendar className="w-5 h-5" />, path: "/fertilizer-guide" },
    { name: "Weather", icon: <CloudRain className="w-5 h-5" />, path: "/weather" },
    // { name: "Marketplace", icon: <ShoppingCart className="w-5 h-5" />, path: "/marketplace" },
    { name: "Gov. Schema", icon: <Layers className="w-5 h-5" />, path: "/gov-schema" },
    // { name: "Community Forum", icon: <MessageCircle className="w-5 h-5" />, path: "/community-forum" },
    { name: "Profile", icon: <User className="w-5 h-5" />, path: "/profile" }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setSidebarOpen(false) // Close mobile sidebar after navigation
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-emerald-100 lg:shadow-xl lg:pt-16 lg:z-40">
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-600"
                    : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-emerald-100">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-emerald-100 lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex justify-between items-center p-4 border-b border-emerald-100">
           <Sprout className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-800">KisanSaarthi</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-600"
                    : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-emerald-100">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
