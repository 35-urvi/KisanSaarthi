import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import API from '../api/axiosInstance.js'
import {
  Beaker,
  Thermometer,
  Droplets,
  Cloud,
  Activity,
  TestTube,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Wheat,
  Leaf,
  Flower,
  ChevronDown
} from "lucide-react"

const FertilizerGuide = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [formData, setFormData] = useState({
    crop: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    moisture: '',
    soil: ''
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

  // Crop options for dropdown
  const cropOptions = [
    { value: '', label: 'Select a crop' },
    { value: 'Paddy', label: 'Paddy' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Sugarcane', label: 'Sugarcane' },
    { value: 'Maize', label: 'Maize' },
    { value: 'Barley', label: 'Barley' },
    { value: 'Millets', label: 'Millets' },
    { value: 'Oil seeds', label: 'Oil seeds' },
    { value: 'Pulses', label: 'Pulses' },
    { value: 'Tobacco', label: 'Tobacco' },
    { value: 'Ground Nuts', label: 'Ground Nuts' }
  ]

  // Form fields configuration for NPK
  const formFields = [
    {
      name: 'nitrogen',
      label: 'Nitrogen (N)',
      unit: 'ppm',
      icon: <TestTube className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'phosphorus',
      label: 'Phosphorus (P)',
      unit: 'ppm',
      icon: <TestTube className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'potassium',
      label: 'Potassium (K)',
      unit: 'ppm',
      icon: <TestTube className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'temperature',
      label: 'Temperature (°C)',
      unit: '°C',
      icon: <Thermometer className="w-5 h-5" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      name: 'humidity',
      label: 'Humidity (%)',
      unit: '%',
      icon: <Droplets className="w-5 h-5" />,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      name: 'moisture',
      label: 'Moisture (%)',
      unit: '%',
      icon: <Cloud className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ]

  const soilOptions = [
    { value: '', label: 'Select soil type' },
    { value: 'Sandy', label: 'Sandy' },
    { value: 'Loamy', label: 'Loamy' },
    { value: 'Red', label: 'Red' },
    { value: 'Clayey', label: 'Clayey' },
    { value: 'Black', label: 'Black' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!isFormValid() || isLoading) return
    
    setIsLoading(true)
    setRecommendation(null)

    // Scroll to results section when loading starts
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)

    try {
      const payload = {
        crop: formData.crop,
        soil: formData.soil,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: formData.temperature !== '' ? Number(formData.temperature) : undefined,
        humidity: formData.humidity !== '' ? Number(formData.humidity) : undefined,
        moisture: formData.moisture !== '' ? Number(formData.moisture) : undefined,
      }
      const { data } = await API.post('/fertilizer/recommend/', payload)

      const selectedCrop = cropOptions.find(c => c.value === formData.crop)?.label
      setRecommendation({
        fertilizer: data.fertilizer,
        crop: selectedCrop,
        dosage: data.dosage_kg_per_acre,
        applicationMethod: data.application_method,
        confidence: Math.round(data.confidence),
        reason: `Based on ${selectedCrop} and your NPK and environment inputs, ${data.fertilizer} is recommended. Model accuracy: ${data.meta?.model_accuracy ?? '—'}%.`
      })
    } catch (err) {
      setRecommendation({
        fertilizer: 'Unable to recommend',
        crop: '',
        dosage: 0,
        applicationMethod: 'N/A',
        confidence: 0,
        reason: 'There was an error fetching recommendation. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.crop !== '' &&
           formData.soil !== '' &&
           formData.nitrogen !== '' && !isNaN(formData.nitrogen) &&
           formData.phosphorus !== '' && !isNaN(formData.phosphorus) &&
           formData.potassium !== '' && !isNaN(formData.potassium)
  }

  const getFertilizerIcon = (fertilizerName) => {
    if (fertilizerName?.includes('Organic') || fertilizerName?.includes('Vermi')) {
      return <Leaf className="w-8 h-8" />
    }
    return <Beaker className="w-8 h-8" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Fertilizer Guide" />

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
                  <Beaker className="w-8 h-8" />
                  Smart Fertilizer Guide
                </h1>
                <p className="text-emerald-100 text-lg">Get AI-powered fertilizer recommendations based on your crop and soil nutrient levels</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-emerald-100">Analysis Status</p>
                <p className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Ready to Analyze
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pro Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 rounded-xl p-6 shadow-lg border-2 border-amber-200"
          >
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Pro Tips
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-amber-700">
              <p>• Test your soil NPK levels before applying fertilizers</p>
              <p>• Follow recommended dosages to avoid over-fertilization</p>
              <p>• Consider organic alternatives for sustainable farming</p>
              <p>• Apply fertilizers at the right growth stage for maximum efficiency</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
              >
                <h2 className="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-emerald-600" />
                  Enter Your Crop And Soil Nutrient Data
                </h2>

                <div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {/* Crop Selection */}
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Crop Type
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">
                          <Wheat className="w-5 h-5" />
                        </div>
                        <select
                          name="crop"
                          value={formData.crop}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-10 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-stone-50 appearance-none"
                        >
                          {cropOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 pointer-events-none">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Soil Selection */}
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Soil Type
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">
                          <Beaker className="w-5 h-5" />
                        </div>
                        <select
                          name="soil"
                          value={formData.soil}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-10 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-stone-50 appearance-none"
                        >
                          {soilOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 pointer-events-none">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>

                    {/* NPK Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {formFields.map((field, index) => (
                        <motion.div key={field.name} variants={fadeInUp}>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            {field.label} {field.unit}
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">
                              {field.icon}
                            </div>
                            <input
                              type="number"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-stone-50"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              step="0.01"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
                        Analyzing Your Requirements...
                      </>
                    ) : (
                      <>
                        Get Fertilizer Recommendation
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Results Section - Right side with full height */}
            <div className="h-full">
              <div ref={resultsRef} className="h-full">
                {/* Default/Empty State */}
                {!isLoading && !recommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-8 shadow-lg border border-stone-200 h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-stone-300 to-stone-400 rounded-full flex items-center justify-center text-white">
                        <Beaker className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-stone-600 mb-4">
                        Enter Your Crop And Nutrient Data
                      </h3>
                      <p className="text-stone-500 leading-relaxed max-w-sm mx-auto">
                        Select your crop and enter current soil NPK levels to get personalized fertilizer recommendations
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
                      <h3 className="text-2xl font-semibold text-stone-800 mb-4">Analyzing Your Requirements...</h3>
                      <p className="text-stone-600">Processing your crop and nutrient data</p>
                      <div className="mt-6 w-full bg-stone-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Fertilizer Recommendation Result */}
                {recommendation && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-lg border-2 border-emerald-200 h-full flex items-center justify-center"
                  >
                    <div className="text-center w-full">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white">
                        {getFertilizerIcon(recommendation.fertilizer)}
                      </div>
                      <h3 className="text-3xl font-bold text-emerald-800 mb-4">
                        🧪 Recommended Fertilizer
                      </h3>
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-stone-800 mb-2">
                          {recommendation.fertilizer}
                        </h4>
                        <p className="text-lg text-stone-600 mb-4">
                          For {recommendation.crop}
                        </p>
                        <div className="bg-white rounded-lg p-4 mb-4 text-left">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-stone-600">Dosage:</span>
                            <span className="font-semibold text-stone-800">{recommendation.dosage} kg/acre</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-stone-600">Application:</span>
                            <span className="font-semibold text-stone-800">{recommendation.applicationMethod}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold text-lg">
                            {recommendation.confidence}% Confidence
                          </span>
                        </div>
                        <div className="w-full bg-emerald-200 rounded-full h-3 mb-6">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000" 
                            style={{width: `${recommendation.confidence}%`}}
                          ></div>
                        </div>
                      </div>
                      <p className="text-stone-600 leading-relaxed text-sm max-w-sm mx-auto">
                        {recommendation.reason}
                      </p>
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

export default FertilizerGuide