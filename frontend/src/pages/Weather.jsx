import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  Zap,
  MapPin,
  Search,
  Loader2,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Navigation,
  RefreshCw
} from "lucide-react"

const Weather = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [forecast, setForecast] = useState([]);
  
  // Weather state
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    feelsLike: 32,
    uvIndex: 6,
    sunrise: "06:30",
    sunset: "18:45",
    icon: "sunny"
  })

  // Weather alerts
  const [alerts] = useState([
    { type: "warning", title: "Heavy Rain Alert", message: "Heavy rainfall expected in next 6 hours", time: "2 hours ago" },
    { type: "info", title: "High UV Index", message: "UV index is high, wear protective clothing", time: "4 hours ago" }
  ])

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

  // Get weather icon component
  const getWeatherIcon = (iconType, size = "w-8 h-8") => {
    switch (iconType) {
      case "sunny":
        return <Sun className={`${size} text-amber-500`} />
      case "partly-cloudy":
        return <Cloud className={`${size} text-stone-500`} />
      case "cloudy":
        return <Cloud className={`${size} text-stone-600`} />
      case "rainy":
        return <CloudRain className={`${size} text-teal-500`} />
      case "stormy":
        return <Zap className={`${size} text-purple-500`} />
      case "snowy":
        return <CloudSnow className={`${size} text-blue-500`} />
      default:
        return <Sun className={`${size} text-amber-500`} />
    }
  }

  const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:8000/api/weather/?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (res.ok) {
            setCurrentWeather(data.current);
            setForecast(data.forecast);
            setCurrentLocation(`Your Location`);
          } else {
            setError(data.error || "Location weather not found.");
          }
        } catch {
          setError("Failed to fetch location weather.");
        } finally {
          setLoading(false);
        }
      },
      () => setError("Location access denied.")
    );
  } else {
    setError("Geolocation not supported.");
  }
};

  const searchWeather = async () => {
  if (!searchQuery.trim()) return;
  setLoading(true);
  setError("");

  try {
    const res = await fetch(`http://localhost:8000/api/weather/?city=${searchQuery}`);
    const data = await res.json();

    if (res.ok) {
      setCurrentWeather(data.current);
      setForecast(data.forecast);
      setCurrentLocation(`${searchQuery}`);
    } else {
      setError(data.error || "City not found.");
    }
  } catch (err) {
    setError("Error fetching weather.");
  } finally {
    setLoading(false);
  }
};

  // Auto-fetch weather on component mount
  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Weather" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <CloudRain className="w-8 h-8" />
              Weather Forecast 🌤️
            </h1>
            <p className="text-blue-100 text-lg">Stay updated with real-time weather conditions</p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter city or village name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
                  className="w-full pl-10 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-green-500 focus:outline-none text-stone-700"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={searchWeather}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                  My Location
                </motion.button>
              </div>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-200 via-sky-250 to-cyan-300 rounded-2xl p-8 text-black shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <h2 className="text-xl font-semibold">{currentLocation || "Loading..."}</h2>
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                {/* <RefreshCw className="w-5 h-5" /> */}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Weather Info */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  {getWeatherIcon(currentWeather.icon, "w-16 h-16")}
                  <div>
                    <p className="text-6xl font-bold">{currentWeather.temp}°</p>
                    <p className="text-xl text-grey-100">{currentWeather.condition}</p>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                  <p className="text-grey-100 text-sm">Humidity</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentWeather.windSpeed}</p>
                  <p className="text-grey-100 text-sm">km/h</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
          >
            <h3 className="text-xl font-semibold text-stone-800 mb-4">5-Day Forecast</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2" style={{ minWidth: '700px' }}>
                {forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="flex-shrink-0 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 text-center border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                    style={{ width: '190px' }}
                  >
                    {/* <p className="font-semibold text-slate-700 mb-2">{day.day}</p>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.icon, "w-8 h-8")}
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-800">{day.high}°</p>
                      <p className="text-sm text-slate-500">{day.low}°</p>
                      <p className="text-xs text-blue-600">{day.precipitation}%</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{day.condition}</p> */}
                    <img
                      src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.condition}
                    />
                    <p className="font-semibold">
                      {/* {new Date(day.date * 1000).toDateString()} */}
                      {day.date}
                    </p>
                    <p>{day.condition}</p>
                    <p className="text-sm">
                      Min: {day.min}°C 
                      <p className="text-sm">
                        Max: {day.max}°C
                      </p>
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weather Alerts */}
          {/* {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
            >
              <h3 className="text-xl font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Weather Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' 
                        ? 'bg-amber-50 border-amber-400' 
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${
                          alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                        }`}>
                          {alert.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.type === 'warning' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">{alert.time}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )} */}
        </div>
      </main>
    </div>
  )
}

export default Weather