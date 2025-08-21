import { useState } from "react"
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  MapPin,
  Star,
  Eye,
  Phone,
  MessageCircle,
  X,
  Upload,
  Wheat,
  Zap,
  Wrench,
  Package,
  DollarSign,
  User,
  Camera,
  RotateCcw
} from "lucide-react"

const MarketPlace = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showSellForm, setShowSellForm] = useState(false)

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

  // Categories data
  const categories = [
    { name: "All", icon: <Package className="w-5 h-5" />, count: 156, color: "from-stone-500 to-stone-600" },
    { name: "Seeds", icon: <Wheat className="w-5 h-5" />, count: 45, color: "from-emerald-500 to-emerald-600" },
    { name: "Fertilizers", icon: <Zap className="w-5 h-5" />, count: 38, color: "from-amber-500 to-amber-600" },
    { name: "Equipment", icon: <Wrench className="w-5 h-5" />, count: 42, color: "from-blue-500 to-blue-600" },
    { name: "Others", icon: <Package className="w-5 h-5" />, count: 31, color: "from-purple-500 to-purple-600" }
  ]

  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: "Premium Wheat Seeds",
      category: "Seeds",
      price: 2500,
      unit: "50kg bag",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      seller: "राज कुमार",
      location: "अहमदाबाद, गुजरात",
      rating: 4.8,
      description: "High quality wheat seeds with 95% germination rate. Suitable for all soil types.",
      phone: "+91 98765 43210",
      inStock: true
    },
    {
      id: 2,
      name: "Organic NPK Fertilizer",
      category: "Fertilizers",
      price: 1200,
      unit: "25kg bag",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      seller: "सुरेश पटेल",
      location: "राजकोट, गुजरात",
      rating: 4.6,
      description: "100% organic NPK fertilizer. Improves soil health and crop yield naturally.",
      phone: "+91 87654 32109",
      inStock: true
    },
    {
      id: 3,
      name: "Tractor Cultivator",
      category: "Equipment",
      price: 45000,
      unit: "piece",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
      seller: "मनोज शर्मा",
      location: "वडोदरा, गुजरात",
      rating: 4.9,
      description: "Heavy duty cultivator for tractors. Excellent for soil preparation.",
      phone: "+91 76543 21098",
      inStock: true
    },
    {
      id: 4,
      name: "Tomato Seeds Hybrid",
      category: "Seeds",
      price: 850,
      unit: "100g pack",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
      seller: "प्रीति देसाई",
      location: "सूरत, गुजरात",
      rating: 4.7,
      description: "High yielding hybrid tomato seeds. Disease resistant variety.",
      phone: "+91 65432 10987",
      inStock: false
    },
    {
      id: 5,
      name: "Water Pump 1HP",
      category: "Equipment",
      price: 8500,
      unit: "piece",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
      seller: "अमित गुप्ता",
      location: "अहमदाबाद, गुजरात",
      rating: 4.5,
      description: "Submersible water pump for irrigation. Energy efficient and durable.",
      phone: "+91 54321 09876",
      inStock: true
    },
    {
      id: 6,
      name: "Drip Irrigation Kit",
      category: "Others",
      price: 3200,
      unit: "complete set",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      seller: "विकास जोशी",
      location: "गांधीनगर, गुजरात",
      rating: 4.4,
      description: "Complete drip irrigation system for 1 acre. Water saving technology.",
      phone: "+91 43210 98765",
      inStock: true
    }
  ]

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesLocation = locationFilter === "" || 
                           product.location.toLowerCase().includes(locationFilter.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesPrice && matchesLocation
  })

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("All")
    setPriceRange([0, 50000])
    setSearchQuery("")
    setLocationFilter("")
    setShowFilters(false) // Optionally collapse filters after clearing
  }

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== "All" || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== 50000 || 
                          searchQuery !== "" || 
                          locationFilter !== ""

  // Product Detail Modal
  const ProductDetailModal = ({ product, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-stone-800">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="mt-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-stone-600">{product.rating} rating</span>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-3xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</p>
                <p className="text-stone-600">per {product.unit}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-stone-700 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-stone-800 mb-2">Seller Information</h3>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-700">{product.seller}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-600">{product.location}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300">
                  <Phone className="w-4 h-4" />
                  Call Seller
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  // Sell Product Form Modal
  const SellProductModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'Seeds',
      price: '',
      unit: '',
      location: '',
      description: '',
      phone: '',
      images: []
    })
    
    const [errors, setErrors] = useState({})
    const [imagePreview, setImagePreview] = useState([])

    const validateForm = () => {
      const newErrors = {}

      // Product name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Product name is required'
      } else if (formData.name.length < 3) {
        newErrors.name = 'Product name must be at least 3 characters'
      }

      // Price validation
      if (!formData.price) {
        newErrors.price = 'Price is required'
      } else if (formData.price <= 0) {
        newErrors.price = 'Price must be greater than 0'
      } else if (formData.price > 10000000) {
        newErrors.price = 'Price seems too high'
      }

      // Unit validation
      if (!formData.unit.trim()) {
        newErrors.unit = 'Unit is required'
      }

      // Location validation
      if (!formData.location.trim()) {
        newErrors.location = 'Location is required'
      } else if (formData.location.length < 3) {
        newErrors.location = 'Location must be at least 3 characters'
      }

      // Phone validation
      const phoneRegex = /^[+]?[0-9]{10,15}$/
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      // Description validation
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required'
      } else if (formData.description.length < 10) {
        newErrors.description = 'Description must be at least 10 characters'
      } else if (formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return

      // Validate file types and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      const validFiles = files.filter(file => {
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid image format. Please use JPEG, PNG, or WebP.`)
          return false
        }
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Please use images smaller than 5MB.`)
          return false
        }
        return true
      })

      if (validFiles.length === 0) return

      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }))
      
      setImagePreview(prev => [...prev, ...newPreviews])
    }

    const removeImage = (index) => {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(imagePreview[index])
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
      
      setImagePreview(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      if (validateForm()) {
        console.log('Product listed:', formData)
        // Here you would typically send the data to your backend
        
        // Clean up image URLs
        imagePreview.forEach(url => URL.revokeObjectURL(url))
        
        onClose()
        // Reset form
        setFormData({
          name: '',
          category: 'Seeds',
          price: '',
          unit: '',
          location: '',
          description: '',
          phone: '',
          images: []
        })
        setImagePreview([])
        setErrors({})
      }
    }

    const handleInputChange = (field, value) => {
      setFormData({...formData, [field]: value})
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({...errors, [field]: ''})
      }
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Sell Your Product</h2>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.name ? 'border-red-500' : 'border-stone-300'
                    }`}
                    placeholder="Enter product name"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.price ? 'border-red-500' : 'border-stone-300'
                    }`}
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.unit ? 'border-red-500' : 'border-stone-300'
                    }`}
                    placeholder="e.g., kg, piece, bag"
                    required
                  />
                  {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.location ? 'border-red-500' : 'border-stone-300'
                    }`}
                    placeholder="City, State"
                    required
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
                
                <div>
                  <label className="block text-stone-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.phone ? 'border-red-500' : 'border-stone-300'
                    }`}
                    placeholder="+91 xxxxx xxxxx"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Description 
                  <span className="text-stone-500 text-sm">({formData.description.length}/500)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.description ? 'border-red-500' : 'border-stone-300'
                  }`}
                  rows="4"
                  placeholder="Describe your product in detail..."
                  maxLength="500"
                  required
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-stone-700 font-medium mb-2">Product Images</label>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <p className="text-stone-600 mb-2">Click to upload product images</p>
                      <p className="text-stone-500 text-sm mb-4">Support: JPEG, PNG, WebP (Max 5MB each)</p>
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium inline-block hover:shadow-lg transition-all duration-300">
                        Choose Files
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-stone-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.images.length > 0 && (
                    <p className="text-stone-600 text-sm">
                      {formData.images.length} image{formData.images.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-stone-300 text-stone-700 py-3 px-4 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  List Product
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Marketplace" />

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
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <ShoppingCart className="w-8 h-8" />
                  KisanSaarthi Marketplace 🛒
                </h1>
                <p className="text-emerald-100 text-lg">Buy and sell agricultural products with fellow farmers</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSellForm(true)}
                className="mt-4 md:mt-0 bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Sell Product
              </motion.button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products, sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              
              {/* Clear Button - Only show when filters are active */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Clear All
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {selectedCategory !== "All" && (
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="ml-1 hover:bg-emerald-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 50000])}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {searchQuery && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {locationFilter && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    Location: {locationFilter}
                    <button
                      onClick={() => setLocationFilter("")}
                      className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-stone-200"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">Price Range (₹)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="flex-1 border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-stone-500">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                          className="flex-1 border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Enter location..."
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Summary */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-stone-100 rounded-lg p-4"
            >
              <p className="text-stone-700">
                <span className="font-medium">{filteredProducts.length}</span> products found
                {filteredProducts.length !== allProducts.length && (
                  <span className="text-stone-500"> (out of {allProducts.length} total)</span>
                )}
              </p>
            </motion.div>
          )}

          {/* Categories */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-emerald-50 border-emerald-200 shadow-lg'
                    : 'bg-white border-stone-200 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-3 mx-auto shadow-md`}>
                  {category.icon}
                </div>
                <h3 className="font-medium text-stone-800 text-sm">{category.name}</h3>
                <p className="text-xs text-stone-600 mt-1">{category.count} items</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl p-6 border-2 border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="inline-block bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-semibold text-stone-800 mb-1">{product.name}</h3>
                  <p className="text-2xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</p>
                  <p className="text-stone-600 text-sm">per {product.unit}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-700 text-sm">{product.seller}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-600 text-sm">{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-stone-600 text-sm">{product.rating}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600 mb-2">No products found</h3>
              <p className="text-stone-500 mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto hover:shadow-lg transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Sell Product Modal */}
      {showSellForm && (
        <SellProductModal onClose={() => setShowSellForm(false)} />
      )}
    </div>
  )
}

export default MarketPlace