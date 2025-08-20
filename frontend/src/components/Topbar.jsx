import { motion } from "framer-motion"
import {
  Sprout,
  Bell,
  MapPin,
  User,
  Menu
} from "lucide-react"

const TopBar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    // <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-emerald-100">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-emerald-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 ml-2 lg:ml-0">
              <Sprout className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-800">KisanSaarthi</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </motion.button> */}
            <div className="flex items-center space-x-2 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">Ahmedabad, Gujarat</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-stone-700 hidden sm:block">User</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopBar