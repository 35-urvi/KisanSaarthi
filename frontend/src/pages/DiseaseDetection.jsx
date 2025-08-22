import { useState } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  Bug,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  FileImage,
  Shield,
  Leaf,
  Zap,
  Info,
  TrendingUp
} from "lucide-react"

const DiseaseDetection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

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

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      setAnalysisResult(null)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Simulate disease detection API call
  // const analyzeImage = async () => {
  //   setIsAnalyzing(true)
    
  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 3000))
    
  //   // Mock response - in real implementation, this would come from your API
  //   const mockResults = [
  //     {
  //       disease: "Healthy",
  //       confidence: 95,
  //       description: "Your crop appears to be healthy with no signs of disease detected.",
  //       treatment: "Continue with regular care and monitoring. Maintain proper watering and nutrition.",
  //       severity: "none",
  //       color: "emerald"
  //     },
  //     {
  //       disease: "Late Blight",
  //       confidence: 87,
  //       description: "Late blight is a serious disease that affects potatoes and tomatoes, causing dark lesions on leaves and stems.",
  //       treatment: "Apply copper-based fungicides immediately. Remove affected plant parts and improve air circulation.",
  //       severity: "high",
  //       color: "red"
  //     },
  //     {
  //       disease: "Leaf Spot",
  //       confidence: 92,
  //       description: "Leaf spot diseases cause circular or angular spots on leaves, often with a brown or black center.",
  //       treatment: "Remove infected leaves, apply fungicide spray, and avoid overhead watering to prevent spread.",
  //       severity: "medium",
  //       color: "amber"
  //     }
  //   ]
    
  //   // Randomly select a result for demo
  //   const result = mockResults[Math.floor(Math.random() * mockResults.length)]
    
  //   setAnalysisResult(result)
  //   setIsAnalyzing(false)
  // }
  const analyzeImage = async () => {
  if (!selectedImage) return;

  setIsAnalyzing(true);

  try {
    const API_BASE =
      import.meta?.env?.VITE_API_BASE ||
      "http://127.0.0.1:8000"; // change if your backend runs elsewhere

    const formData = new FormData();
    formData.append("image", selectedImage);

    const res = await fetch(`${API_BASE}/api/disease-detect/`, {
      method: "POST",
      body: formData,
      // No custom headers. No 'withcredentials' header!
      // If you need cookies later, use { credentials: "include" } (no header).
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Server error");
    }

    const data = await res.json();
    const r = data.result;

    // map server severity -> UI color
    const severityColorMap = { none: "emerald", low: "sky", medium: "amber", high: "red" };

    setAnalysisResult({
      disease: r.label,
      confidence: r.confidence,      // already in %
      description: r.description,
      treatment: r.treatment,
      severity: r.severity,
      color: severityColorMap[r.severity] || "amber",
    });
  } catch (err) {
    console.error(err);
    setAnalysisResult({
      disease: "Analysis failed",
      confidence: 0,
      description: "We couldn't analyze this image. Please try again with a clear leaf photo.",
      treatment: "Ensure good lighting, single leaf in focus, no blur.",
      severity: "low",
      color: "amber",
    });
  } finally {
    setIsAnalyzing(false);
  }
};


  // Clear all data
  const clearAll = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
  }

  // Stats data
  // const stats = [
  //   {
  //     title: "Images Analyzed",
  //     value: "1,247",
  //     change: "+25%",
  //     icon: <Camera className="w-5 h-5" />,
  //     color: "from-blue-500 to-blue-600",
  //     bgColor: "bg-blue-50",
  //     borderColor: "border-blue-200"
  //   },
  //   {
  //     title: "Diseases Detected",
  //     value: "342",
  //     change: "+18%",
  //     icon: <Bug className="w-5 h-5" />,
  //     color: "from-red-500 to-red-600",
  //     bgColor: "bg-red-50",
  //     borderColor: "border-red-200"
  //   },
  //   {
  //     title: "Healthy Crops",
  //     value: "905",
  //     change: "+12%",
  //     icon: <Shield className="w-5 h-5" />,
  //     color: "from-emerald-500 to-emerald-600",
  //     bgColor: "bg-emerald-50",
  //     borderColor: "border-emerald-200"
  //   },
  //   {
  //     title: "Accuracy Rate",
  //     value: "94.2%",
  //     change: "+2.1%",
  //     icon: <TrendingUp className="w-5 h-5" />,
  //     color: "from-purple-500 to-purple-600",
  //     bgColor: "bg-purple-50",
  //     borderColor: "border-purple-200"
  //   }
  // ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Disease Detection" />

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
                  <Bug className="w-8 h-8" />
                  Disease Detection
                </h1>
                <p className="text-red-100 text-lg">Upload crop images for instant AI-powered disease identification</p>
              </div>
              {/* <div className="mt-4 md:mt-0 text-right">
                <p className="text-red-100">Powered by AI</p>
                <p className="text-xl font-semibold">94.2% Accuracy</p>
              </div> */}
            </div>
          </motion.div>

          {/* Tips Section - Moved to top and styled like other components */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 rounded-xl p-6 shadow-lg border-2 border-amber-200"
          >
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tips for Better Detection
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-amber-700">
              <p>• Take high-resolution photos in good lighting conditions</p>
              <p>• Capture affected leaves showing symptoms clearly</p>
              <p>• Upload different views for more accurate diagnosis</p>
            </div>
          </motion.div>

          {/* Stats Section */}
          {/* <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
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
          </motion.div> */}

          {/* Main Detection Interface - Updated layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section - Now takes 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200"
              >
                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-emerald-600" />
                  Upload Crop Image
                </h2>

                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-stone-300 hover:border-emerald-400 hover:bg-emerald-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileImage className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-stone-700 mb-2">
                      Drag & drop your crop image here
                    </p>
                    <p className="text-stone-500 mb-4">or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Choose Image
                      </motion.span>
                    </label>
                    <p className="text-xs text-stone-500 mt-4">
                      Supports JPG, PNG, WebP (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Crop preview"
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        onClick={clearAll}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {!isAnalyzing && !analysisResult && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={analyzeImage}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Analyze for Diseases
                      </motion.button>
                    )}

                    {isAnalyzing && (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium text-stone-700">Analyzing image...</p>
                        <p className="text-stone-500">This may take a few seconds</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Results Section - Now on the right side with full height */}
            <div className="h-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-stone-200"
              >
                <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                  Analysis Results
                </h2>

                {!analysisResult ? (
                  <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Bug className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-lg text-stone-500 mb-2">Upload an image to see analysis results</p>
                    <p className="text-stone-400 text-sm">AI will detect diseases and provide treatment recommendations</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 h-full flex flex-col"
                  >
                    {/* Disease Status */}
                    <div className={`p-4 rounded-xl border-2 ${
                      analysisResult.severity === 'none' ? 'bg-emerald-50 border-emerald-200' :
                      analysisResult.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {analysisResult.severity === 'none' ? (
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          )}
                          <h3 className="text-lg font-bold text-stone-800">{analysisResult.disease}</h3>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysisResult.severity === 'none' ? 'bg-emerald-100 text-emerald-700' :
                          analysisResult.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {analysisResult.confidence}%
                        </div>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">{analysisResult.description}</p>
                    </div>

                    {/* Treatment Recommendation */}
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex-1">
                      <h4 className="text-md font-semibold text-stone-800 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Recommended Treatment
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed">{analysisResult.treatment}</p>
                    </div> 

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearAll}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      >
                        Analyze Another Image
                      </motion.button>
                      {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full border-2 border-stone-300 text-stone-700 py-2 px-4 rounded-lg font-medium hover:bg-stone-50 transition-all duration-300 text-sm"
                      >
                        Save Results
                      </motion.button> */}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DiseaseDetection