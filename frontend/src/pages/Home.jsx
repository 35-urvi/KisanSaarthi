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
  Clock
} from "lucide-react"

const Home = () => {
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
      description: "Get AI-powered crop recommendations based on your location and conditions",
      icon: <Sprout className="w-8 h-8" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      action: "Plan Crops"
    },
    {
      title: "Disease Detection",
      description: "Upload crop images for instant disease identification and treatment",
      icon: <Camera className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      action: "Scan Crop"
    },
    {
      title: "Weather Insights",
      description: "Get real-time weather updates and farming alerts",
      icon: <CloudRain className="w-8 h-8" />,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      action: "Check Weather"
    },
    {
      title: "Crop Calendar",
      description: "Track your farming activities with smart reminders",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      action: "View Calendar"
    },
    {
      title: "Marketplace",
      description: "Buy and sell crops, tools, and equipment",
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      action: "Browse Market"
    },
    {
      title: "Community Forum",
      description: "Connect with fellow farmers and agriculture experts",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      action: "Join Discussion"
    }
  ]

  // Recent activities
  const recentActivities = [
    { action: "Wheat crop health checked", time: "2 hours ago", status: "success" },
    { action: "Fertilizer applied to Field A", time: "1 day ago", status: "completed" },
    { action: "Weather alert: Rain expected", time: "2 days ago", status: "warning" },
    { action: "Equipment maintenance scheduled", time: "3 days ago", status: "pending" }
  ]

  // Upcoming tasks
  const upcomingTasks = [
    { task: "Watering scheduled for Field B", due: "Today", priority: "high" },
    { task: "Harvest wheat in Field A", due: "3 days", priority: "medium" },
    { task: "Apply pesticide treatment", due: "1 week", priority: "low" },
    { task: "Equipment inspection", due: "2 weeks", priority: "medium" }
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
                <h1 className="text-3xl font-bold mb-2">Welcome back, राम प्रसाद! 🌾</h1>
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
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className={`${stat.bgColor} rounded-xl p-6 border-2 ${stat.borderColor} shadow-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-stone-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-stone-800 mt-1">{stat.value}</p>
                    <p className="text-emerald-600 text-sm font-medium mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CloudRain className="w-6 h-6" />
              Today's Weather
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-amber-300" />
                <p className="text-2xl font-bold">{currentWeather.temp}°C</p>
                <p className="text-teal-100 text-sm">{currentWeather.condition}</p>
              </div>
              <div className="text-center">
                <Thermometer className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-teal-100 text-sm">Max Temp</p>
              </div>
              <div className="text-center">
                <Droplets className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                <p className="text-teal-100 text-sm">Humidity</p>
              </div>
              <div className="text-center">
                <Wind className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentWeather.windSpeed} km/h</p>
                <p className="text-teal-100 text-sm">Wind Speed</p>
              </div>
            </div>
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
                className={`${card.bgColor} rounded-xl p-6 border-2 ${card.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{card.title}</h3>
                <p className="text-stone-600 text-sm mb-4 leading-relaxed">{card.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${card.color} text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  {card.action}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activities & Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
            >
              <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Recent Activities
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'warning' ? 'bg-amber-500' :
                      activity.status === 'completed' ? 'bg-blue-500' : 'bg-stone-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-stone-700 text-sm font-medium">{activity.action}</p>
                      <p className="text-stone-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
            >
              <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Upcoming Tasks
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-stone-700 text-sm font-medium">{task.task}</p>
                      <p className="text-stone-500 text-xs">Due: {task.due}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home