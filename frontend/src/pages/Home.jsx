import { useState } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  Sprout,
  CloudRain,
  Bug,
  MessageCircle,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Activity,
  DollarSign,
  Wrench,
  Camera,
  Clock,
  Layers,
  AreaChart
} from "lucide-react"
import { useNavigate} from "react-router-dom"


const Home = () => {
    const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentWeather] = useState({
    temp: 28,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 12
  })

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  // Quick stats data
  const quickStats = [
    {
      title: "Total Yield",
      value: "2,450 kg",
      change: "+15%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Active Crops",
      value: "3 Fields",
      change: "+1",
      icon: <Sprout className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      title: "Revenue",
      value: "₹1,25,000",
      change: "+22%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Equipment Health",
      value: "95%",
      change: "Excellent",
      icon: <Wrench className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ]

  // Feature cards data
  const featureCards = [
    {
      title: "Smart Crop Planner",
      description: "Get crop recommendations based on your location conditions and soil data",
      icon: <Sprout className="w-8 h-8" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      action: "Plan Crops",
      path: "/crop-recommendation"
    },
    {
      title: "Disease Detection",
      description: "Upload crop images for instant disease identification and treatment",
      icon: <Camera className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      action: "Scan Crop",
      path: "/disease-detection"
    },
    {
      title: "Weather Insights",
      description: "Get real-time weather updates and farming alerts",
      icon: <CloudRain className="w-8 h-8" />,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      action: "Check Weather",
      path: "/weather"
    },
    {
      title: "Fertilizer Guide",
      description: "Get Fertilizer recommendations based on your crop and soil data",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      action: "Predict Fertilizer",
      path: "/fertilizer-guide"
    },
    {
      title: "Goverment Schemes",
      description: "view all schemes at one place and veiw its details",
      icon: <Layers className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      action: "Schemes",
      path: "/gov-schema"
    },
    {
      title: "Yield Prediction",
      description: "Predict yield for your crops based on your data",
      icon: <AreaChart className="w-8 h-8" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      action: "Predict Yield",
      path: "/yield-prediction"
    }
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Dashboard" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {localStorage.getItem('userName') || 'User'}! 🌾</h1>
                <p className="text-emerald-100 text-lg">Ready to make your farming more productive today?</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-emerald-100">Today's Date</p>
                <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${card.bgColor} rounded-xl p-6 border-2 ${card.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer justify-center text-center`}
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-4 shadow-lg mx-auto`}>
                  <p>{card.icon}</p>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{card.title}</h3>
                <p className="text-stone-600 text-sm mb-4 leading-relaxed">{card.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(card.path)}
                  className={`w-full bg-gradient-to-r ${card.color} text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  {card.action}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Home