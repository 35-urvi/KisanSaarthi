import { useState, useRef } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  TrendingUp,
  Calendar,
  Leaf,
  Ruler,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  BarChart3,
  Target,
  Activity
} from "lucide-react"

const YieldPrediction = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [formData, setFormData] = useState({
    cropName: '',
    season: '',
    year: new Date().getFullYear(),
    area: ''
  })

  // Ref for the results section
  const resultsRef = useRef(null)

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

  // Crop options
  const cropOptions = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 
    'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 
    'grapes', 'watermelon', 'apple', 'orange', 'papaya', 'coconut', 
    'cotton', 'jute', 'coffee'
  ]

  // Season options
  const seasonOptions = ['Kharif', 'Rabi', 'Zaid']

  // Form fields configuration
  const formFields = [
    {
      name: 'cropName',
      label: 'Crop Name',
      type: 'select',
      options: cropOptions,
      icon: <Leaf className="w-5 h-5" />,
      placeholder: 'Select crop'
    },
    {
      name: 'season',
      label: 'Season',
      type: 'select',
      options: seasonOptions,
      icon: <Calendar className="w-5 h-5" />,
      placeholder: 'Select season'
    },
    {
      name: 'year',
      label: 'Year',
      type: 'number',
      icon: <Calendar className="w-5 h-5" />,
      placeholder: 'Enter year',
      min: 2020,
      max: 2030
    },
    {
      name: 'area',
      label: 'Area (Hectares)',
      type: 'number',
      icon: <Ruler className="w-5 h-5" />,
      placeholder: 'Enter area in hectares',
      step: '0.1'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!isFormValid() || isLoading) return
    
    setIsLoading(true)
    setPrediction(null)

    // Scroll to results section when loading starts
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)

    // Call backend API
    fetch('http://localhost:8000/api/yield/predict/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropName: formData.cropName,
        season: formData.season,
        year: Number(formData.year),
        area: Number(formData.area)
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Prediction failed')
        // Map backend fields to UI state
        setPrediction({
          yieldPerHa: data.yieldPerHa,
          quintalsPerHa: data.quintalsPerHa,
          totalYield: data.totalYield,
          confidence: data.confidence || 90,
          cropName: formData.cropName,
          season: formData.season,
          year: formData.year,
          area: formData.area
        })
      })
      .catch((err) => {
        console.error(err)
        alert(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  const isFormValid = () => {
    return formData.cropName && formData.season && formData.year && formData.area && 
           !isNaN(formData.year) && !isNaN(formData.area) && 
           formData.year >= 2020 && formData.year <= 2030 && formData.area > 0
  }

  const getCropIcon = () => {
    return <TrendingUp className="w-8 h-8" />
  }

  const formatCropName = (cropName) => {
    return cropName.charAt(0).toUpperCase() + cropName.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Yield Prediction" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8" />
                  Yield Prediction
                </h1>
                <p className="text-emerald-100 text-lg">Predict your crop yield based on historical data and current conditions</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-emerald-100">Prediction Model</p>
                <p className="text-xl font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI-Powered
                </p>
              </div>
            </div>
          </motion.div>

          {/* Important Notes and Season Info Section - Now at the top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-amber-50 rounded-xl p-6 shadow-lg border-2 border-amber-200"
            >
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Important Notes
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm text-amber-700">
                <p>• Predictions are based on historical yield data</p>
                <p>• Consider current weather conditions for accuracy</p>
                <p>• Results may vary based on farming practices</p>
                <p>• Use predictions as guidance, not absolute values</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-xl p-6 shadow-lg border-2 border-blue-200"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Season Info
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>Kharif:</strong> Monsoon season (Jun-Oct)</p>
                <p><strong>Rabi:</strong> Winter season (Nov-Apr)</p>
                <p><strong>Zaid:</strong> Summer season (Mar-Jun)</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section - Now takes 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
              >
                <h2 className="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-600" />
                  Enter Crop & Field Details
                </h2>

                <div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6"
                  >
                    {formFields.map((field, index) => (
                      <motion.div key={field.name} variants={fadeInUp}>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">
                            {field.icon}
                          </div>
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-stone-50"
                            >
                              <option value="">{field.placeholder}</option>
                              {field.options.map((option) => (
                                <option key={option} value={option}>
                                  {field.name === 'cropName' ? formatCropName(option) : option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-stone-50"
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    whileHover={{ scale: isFormValid() && !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid() && !isLoading ? 0.98 : 1 }}
                    className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isFormValid() && !isLoading
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Predicting Yield...
                      </>
                    ) : (
                      <>
                        Predict Yield
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Results Section - Now on the right side with full height */}
            <div className="h-full">
              <div ref={resultsRef} className="h-full">
                {/* Default/Empty State - When no loading or result */}
                {!isLoading && !prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-8 shadow-lg border border-stone-200 h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-stone-300 to-stone-400 rounded-full flex items-center justify-center text-white">
                        <BarChart3 className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-stone-600 mb-4">
                        Result
                      </h3>
                      <p className="text-stone-500 leading-relaxed max-w-sm mx-auto">
                        Fill in all the crop and field details in the form to get your yield prediction
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-lg border-2 border-emerald-200 h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                      <h3 className="text-2xl font-semibold text-stone-800 mb-4">Analyzing Yield Data...</h3>
                      <p className="text-stone-600">Processing historical data and current parameters</p>
                      <div className="mt-6 w-full bg-stone-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Prediction Result */}
                {prediction && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 shadow-lg border-2 border-emerald-200 h-full"
                  >
                    <div className="h-full flex flex-col">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white">
                          {getCropIcon()}
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                          📊 Result
                        </h3>
                        <h4 className="text-lg font-bold text-stone-800 mb-2">
                          {formatCropName(prediction.cropName)} - {prediction.season} {prediction.year}
                        </h4>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">
                            {prediction.confidence}% Confidence
                          </span>
                        </div>
                        <div className="w-full bg-emerald-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${prediction.confidence}%`}}
                          ></div>
                        </div>
                      </div>

                      {/* Prediction Details - Compact for sidebar */}
                      <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-lg p-4 text-center shadow-md">
                          <div className="text-2xl font-bold text-emerald-600 mb-1">
                            {prediction.yieldPerHa} kg/ha
                          </div>
                          <div className="text-stone-600 font-medium text-sm">Yield per Hectare</div>
                          <div className="text-xs text-stone-500">
                            ({prediction.quintalsPerHa} quintals/ha)
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 text-center shadow-md">
                          <div className="text-2xl font-bold text-teal-600 mb-1">
                            {prediction.totalYield} kg
                          </div>
                          <div className="text-stone-600 font-medium text-sm">Total Expected Yield</div>
                          <div className="text-xs text-stone-500">
                            For {prediction.area} hectares
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 text-center shadow-md">
                          <div className="text-2xl font-bold text-amber-600 mb-1">
                            {(prediction.totalYield / 100).toFixed(1)} Q
                          </div>
                          <div className="text-stone-600 font-medium text-sm">Total Quintals</div>
                          <div className="text-xs text-stone-500">
                            Market ready quantity
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default YieldPrediction