import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  CloudRain,
  Bug,
  MessageCircle,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Menu,
  X,
} from "lucide-react"

const Landing = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200])
  const cloudsY = useTransform(scrollY, [0, 1000], [0, -100])
  const sunY = useTransform(scrollY, [0, 1000], [0, -50])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const scaleOnHover = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  // Navigation items
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Journey", href: "#journey" },
    { name: "Weather", href: "#weather" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "राम प्रसाद शर्मा",
      location: "उत्तर प्रदेश",
      text: "KisanSaarthi ने मेरी फसल की पैदावार 30% बढ़ा दी है। मौसम की जानकारी और बीमारी की पहचान बहुत सटीक है।",
      rating: 5,
    },
    {
      name: "सुनीता देवी",
      location: "पंजाब",
      text: "इस ऐप से मुझे सही समय पर बुवाई और कटाई की जानकारी मिलती है। बहुत उपयोगी है।",
      rating: 5,
    },
    {
      name: "मोहन सिंह",
      location: "हरियाणा",
      text: "AI की मदद से अब मैं अपनी फसल की बेहतर देखभाल कर पा रहा हूं। धन्यवाद KisanSaarthi!",
      rating: 5,
    },
  ]

  // Features data with harmonious colors
  const features = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Smart Crop Planner",
      description: "AI-powered crop planning based on soil, weather, and market conditions",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      icon: <Bug className="w-8 h-8" />,
      title: "Disease Detection",
      description: "Early detection of crop diseases using image recognition technology",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: <CloudRain className="w-8 h-8" />,
      title: "Weather Integration",
      description: "Real-time weather updates and alerts for better farming decisions",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Q&A Forum",
      description: "Connect with experts and fellow farmers for knowledge sharing",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  // Growth stages data
  const growthStages = [
    { stage: "Planning", icon: "🌱", description: "Smart crop selection and planning" },
    { stage: "Monitoring", icon: "🌿", description: "Real-time crop health monitoring" },
    { stage: "Alerts", icon: "⚠️", description: "Weather and disease alerts" },
    { stage: "Harvest", icon: "🌾", description: "Optimal harvest timing" },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace("#", ""))
    element?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50 overflow-x-hidden">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-800">KisanSaarthi</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-stone-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-emerald-100"
            >
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 text-stone-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200">
                Download App
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background with Gradient and Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-500 opacity-90"></div>
          {/* Replaced video background with animated pattern */}
          <motion.div style={{ y: backgroundY }} className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
              }}
            />
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          style={{ y: sunY }}
          className="absolute top-20 right-20 w-20 h-20 bg-amber-400 rounded-full opacity-80 shadow-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.div
          style={{ y: cloudsY }}
          className="absolute top-32 left-20 w-32 h-16 bg-stone-100 rounded-full opacity-60"
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-stone-50 mb-6 drop-shadow-2xl"
          >
            Empowering Farmers Through AI 🌿
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-stone-100 mb-8 drop-shadow-lg"
          >
            From Seed to Success
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("#features")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto border-2 border-emerald-500"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-stone-100"
        >
          <div className="w-6 h-10 border-2 border-stone-100 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-stone-100 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Seed Growing Animation Section */}
      <section id="journey" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-stone-50 to-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              Your Farming Journey
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-stone-600 max-w-2xl mx-auto">
              Watch your success grow with every stage of farming
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {growthStages.map((stage, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {stage.icon}
                  </motion.div>
                  {index < growthStages.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-emerald-300"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">{stage.stage}</h3>
                <p className="text-stone-600">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Widget Section */}
      <section
        id="weather"
        className="min-h-screen flex items-center py-20 bg-gradient-to-r from-teal-50 to-emerald-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-teal-800 mb-12">
              Real-Time Weather Updates
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Sun className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">28°C</p>
                  <p className="text-stone-600">Sunny</p>
                </div>
                <div className="text-center">
                  <Thermometer className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">32°C</p>
                  <p className="text-stone-600">Max Temp</p>
                </div>
                <div className="text-center">
                  <Droplets className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">65%</p>
                  <p className="text-stone-600">Humidity</p>
                </div>
                <div className="text-center">
                  <Wind className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">12 km/h</p>
                  <p className="text-stone-600">Wind Speed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen flex items-center py-20 bg-gradient-to-b from-amber-50 to-stone-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              Powerful Features for Modern Farming
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-stone-600 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to transform your farming experience
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleOnHover}
                whileHover="hover"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.bgColor} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 ${feature.borderColor}`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3 text-center">{feature.title}</h3>
                <p className="text-stone-600 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="min-h-screen flex items-center py-20 bg-gradient-to-r from-emerald-600 to-teal-600"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-stone-50 text-center mb-16"
          >
            What Farmers Say About Us
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-stone-50 rounded-2xl shadow-xl p-8 text-center border border-emerald-200"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-stone-700 mb-6 italic">"{testimonials[currentTestimonial].text}"</p>
              <div>
                <h4 className="text-xl font-semibold text-emerald-800">{testimonials[currentTestimonial].name}</h4>
                <p className="text-teal-600">{testimonials[currentTestimonial].location}</p>
              </div>
            </motion.div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-stone-100" : "bg-stone-100/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-stone-800 text-stone-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-400">KisanSaarthi</h3>
              <p className="text-stone-300 mb-4">
                Empowering farmers with AI-powered solutions for sustainable agriculture.
              </p>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors"
                >
                  <span className="text-sm font-bold">f</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-500 transition-colors"
                >
                  <span className="text-sm font-bold">t</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors"
                >
                  <span className="text-sm font-bold">in</span>
                </motion.div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Features</h4>
              <ul className="space-y-2 text-stone-300">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Crop Planning</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Disease Detection</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Weather Alerts</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Expert Forum</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Support</h4>
              <ul className="space-y-2 text-stone-300">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">User Guide</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Community</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Contact</h4>
              <div className="space-y-3 text-stone-300">
                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@kisansaarthi.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-700 mt-12 pt-8 text-center text-stone-400">
            <p>&copy; 2024 KisanSaarthi. All rights reserved. Made with ❤️ for farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
