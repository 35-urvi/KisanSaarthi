import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  FileText,
  X,
  Loader,
  AlertCircle,
  Eye,
  Building,
  Tag,
  Clock,
  ChevronRight
} from "lucide-react"

const GovSchemes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [schemes, setSchemes] = useState([])
  const [filteredSchemes, setFilteredSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [displayedSchemes, setDisplayedSchemes] = useState(10)
  const observerRef = useRef()

  useEffect(() => {
  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/scrape-schemes/");
      const data = await response.json();
      setSchemes(data);
      setFilteredSchemes(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch government schemes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchSchemes();
}, []);

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

  // Mock data for demonstration
  // const mockSchemes = [
  //   {
  //     id: 1,
  //     title: "PM-KISAN Samman Nidhi Yojana",
  //     shortDescription: "Direct income support of ₹6000 per year to small and marginal farmer families having combined land holding up to 2 hectares.",
  //     fullDescription: "The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme launched on 24th February 2019, which provides income support to all landholding farmers' families across the country with cultivable land, subject to certain exclusion criteria. Under the scheme, an amount of Rs.6000/- per year is transferred in three equal installments of Rs.2000/- each every four months into the bank accounts of the beneficiary farmers' families.",
  //     department: "Ministry of Agriculture and Farmers Welfare",
  //     category: "Income Support",
  //     state: "All India",
  //     eligibility: "Small and marginal farmers with land holding up to 2 hectares",
  //     benefits: ["₹6000 per year direct cash transfer", "Financial support for farming inputs", "Three equal installments of ₹2000"],
  //     howToApply: "Apply online through PM-KISAN portal or visit nearest Common Service Center (CSC)",
  //     officialLink: "https://pmkisan.gov.in",
  //     helpline: "155261",
  //     email: "pmkisan-ict@gov.in",
  //     lastUpdated: "2024-01-15"
  //   },
  //   {
  //     id: 2,
  //     title: "Pradhan Mantri Fasal Bima Yojana",
  //     shortDescription: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
  //     fullDescription: "Pradhan Mantri Fasal Bima Yojana (PMFBY) aims to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases. The scheme covers all food & oilseed crops and annual commercial/horticultural crops for which past yield data is available.",
  //     department: "Ministry of Agriculture and Farmers Welfare",
  //     category: "Crop Insurance",
  //     state: "All India",
  //     eligibility: "All farmers growing notified crops in a notified area during the season",
  //     benefits: ["Insurance coverage for crop losses", "Low premium rates", "Use of technology for quick settlement"],
  //     howToApply: "Apply through banks, insurance companies, or online portal",
  //     officialLink: "https://pmfby.gov.in",
  //     helpline: "14447",
  //     email: "support.pmfby@gov.in",
  //     lastUpdated: "2024-01-10"
  //   },
  //   {
  //     id: 3,
  //     title: "Kisan Credit Card Scheme",
  //     shortDescription: "Provides adequate and timely credit support from the banking system to farmers for their cultivation and other needs.",
  //     fullDescription: "The Kisan Credit Card (KCC) scheme was introduced in August 1998 to provide adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs including investment credit requirements.",
  //     department: "Department of Financial Services",
  //     category: "Credit Support",
  //     state: "All India",
  //     eligibility: "All farmers including tenant farmers, oral lessees, and sharecroppers",
  //     benefits: ["Easy access to credit", "Flexible repayment", "Insurance coverage", "Reasonable interest rates"],
  //     howToApply: "Visit nearest bank branch with required documents",
  //     officialLink: "https://www.india.gov.in/kisan-credit-card-kcc-scheme",
  //     helpline: "1800-180-1551",
  //     email: "kcc@dfs.gov.in",
  //     lastUpdated: "2024-01-12"
  //   },
  //   {
  //     id: 4,
  //     title: "Soil Health Card Scheme",
  //     shortDescription: "Provides soil health information to farmers to improve productivity through judicious use of inputs.",
  //     fullDescription: "The Soil Health Card Scheme aims to issue soil health cards to all farmers in the country. The card provides information to farmers on nutrient status of their soil along with recommendations on appropriate dosage of nutrients to be applied for improving soil health and its fertility.",
  //     department: "Ministry of Agriculture and Farmers Welfare",
  //     category: "Soil Health",
  //     state: "All India",
  //     eligibility: "All farmers in the country",
  //     benefits: ["Free soil testing", "Nutrient recommendations", "Improved crop productivity", "Reduced input costs"],
  //     howToApply: "Contact nearest agricultural extension officer or soil testing laboratory",
  //     officialLink: "https://soilhealth.dac.gov.in",
  //     helpline: "011-23382651",
  //     email: "soilhealth.dac@gov.in",
  //     lastUpdated: "2024-01-08"
  //   },
  //   {
  //     id: 5,
  //     title: "National Agriculture Market (e-NAM)",
  //     shortDescription: "Online trading platform for agricultural commodities in India, providing better price discovery and transparent auction process.",
  //     fullDescription: "e-NAM is a pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities. The portal provides a single window service for all APMC related information and services including commodity arrivals & prices, buy & sell trade offers, provision to respond to trade offers, among other services.",
  //     department: "Ministry of Agriculture and Farmers Welfare",
  //     category: "Market Access",
  //     state: "All India",
  //     eligibility: "Farmers, FPOs, and other stakeholders involved in agricultural trade",
  //     benefits: ["Better price discovery", "Transparent auction process", "Online payment", "Quality assurance"],
  //     howToApply: "Register on e-NAM portal with required documents",
  //     officialLink: "https://enam.gov.in",
  //     helpline: "1800-270-0224",
  //     email: "enam.helpdesk@gov.in",
  //     lastUpdated: "2024-01-05"
  //   }
  // ]

  const categories = [
    "All Categories",
    "Income Support",
    "Crop Insurance", 
    "Credit Support",
    "Soil Health",
    "Market Access",
    "Irrigation",
    "Subsidy",
    "Fertilizer Support"
  ]

  const states = [
    "All States",
    "All India",
    "Andhra Pradesh",
    "Gujarat",
    "Karnataka",
    "Maharashtra",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal"
  ]

  // Simulate API call
  // useEffect(() => {
  //   const fetchSchemes = async () => {
  //     setLoading(true)
  //     try {
  //       // Simulate API delay
  //       await new Promise(resolve => setTimeout(resolve, 1500))
  //       setSchemes(mockSchemes)
  //       setFilteredSchemes(mockSchemes)
  //       setError(null)
  //     } catch (err) {
  //       setError("Failed to fetch government schemes. Please try again later.")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchSchemes()
  // }, [])

  // Filter schemes based on search and filters
  useEffect(() => {
    let filtered = schemes

    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory)
    }

    // if (selectedState && selectedState !== "All States") {
    //   filtered = filtered.filter(scheme => scheme.state === selectedState)
    // }

    setFilteredSchemes(filtered)
  }, [schemes, searchTerm, selectedCategory])

  // Infinite scroll functionality
  const lastSchemeElementRef = useCallback(node => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedSchemes < filteredSchemes.length) {
        setDisplayedSchemes(prev => Math.min(prev + 10, filteredSchemes.length))
      }
    })
    if (node) observerRef.current.observe(node)
  }, [loading, displayedSchemes, filteredSchemes.length])

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  const SchemeModal = ({ scheme, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-800">{scheme.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Building className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Department</p>
                  <p className="text-stone-800 font-semibold">{scheme.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Tag className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600 font-medium">Category</p>
                  <p className="text-stone-800 font-semibold">{scheme.category}</p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Description
              </h3>
              <p className="text-stone-600 leading-relaxed">{scheme.fullDescription}</p>
            </div>

            {/* Eligibility */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Eligibility
              </h3>
              <p className="text-stone-600 p-4 bg-amber-50 rounded-lg border border-amber-200">{scheme.eligibility}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {scheme.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-stone-600">
                    <ChevronRight className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Apply */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                How to Apply
              </h3>
              <p className="text-stone-600 p-4 bg-blue-50 rounded-lg border border-blue-200">{scheme.howToApply}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-stone-500">Helpline</p>
                    <p className="text-stone-800 font-medium">{scheme.helpline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-stone-500">Email</p>
                    <p className="text-stone-800 font-medium text-sm">{scheme.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-stone-500">Last Updated</p>
                    <p className="text-stone-800 font-medium">{scheme.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Link */}
            <div className="pt-4 border-t border-stone-200">
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                Visit Official Website
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Government Schemes" />

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
                  <Building className="w-8 h-8" />
                  Government Schemes 🏛️
                </h1>
                <p className="text-emerald-100 text-lg">Discover and apply for agricultural schemes and subsidies</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-emerald-100">Available Schemes</p>
                <p className="text-2xl font-bold">{filteredSchemes.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
          >
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search schemes by title, description, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Filter Toggle and Clear Button */}
              

              {/* Filter Dropdowns */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200"
                  >
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">State</label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <p className="text-stone-600">Loading government schemes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            /* Schemes Grid */
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSchemes.slice(0, displayedSchemes).map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  ref={index === displayedSchemes - 1 ? lastSchemeElementRef : null}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${{
                          'Income Support': 'bg-emerald-100 text-emerald-700',
                          'Crop Insurance': 'bg-blue-100 text-blue-700',
                          'Credit Support': 'bg-purple-100 text-purple-700',
                          'Soil Health': 'bg-amber-100 text-amber-700',
                          'Market Access': 'bg-teal-100 text-teal-700'
                        }[scheme.category] || 'bg-stone-100 text-stone-700'}`}>
                          {scheme.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-2 line-clamp-2">
                        {scheme.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {truncateText(scheme.shortDescription, 120)}
                        {scheme.shortDescription.length > 120 && (
                          <button
                            onClick={() => setSelectedScheme(scheme)}
                            className="text-emerald-600 hover:text-emerald-700 ml-1 font-medium"
                          >
                            Read more
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Department */}
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Building className="w-4 h-4" />
                      <span className="truncate">{scheme.department}</span>
                    </div>

                    {/* Eligibility */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-600 font-medium mb-1">Eligibility</p>
                      <p className="text-sm text-stone-700">{truncateText(scheme.eligibility, 80)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedScheme(scheme)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={scheme.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Indicator */}
          {displayedSchemes < filteredSchemes.length && (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          )}
        </div>
      </main>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </div>
  )
}

export default GovSchemes