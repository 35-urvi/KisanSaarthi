import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Bell,
  Globe,
  Sprout,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  Settings,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Real user data from backend
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    latitude: '',
    longitude: '',
    dateJoined: '',
    farmSize: '',
    experience: '',
    bio: '',
    profileImage: null,
  })

  const [tempUserData, setTempUserData] = useState({ ...userData })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Load user profile data on component mount
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserData(data.profile)
          setTempUserData(data.profile)
        }
      } else {
        console.error('Failed to fetch profile data')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

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

  // Location mapping
  const locationData = {
    states: {
      up: 'Uttar Pradesh',
      punjab: 'Punjab',
      haryana: 'Haryana',
      rajasthan: 'Rajasthan',
      mp: 'Madhya Pradesh',
      gujarat: 'Gujarat'
    },
    districts: {
      lucknow: 'Lucknow',
      kanpur: 'Kanpur',
      agra: 'Agra',
      ludhiana: 'Ludhiana',
      amritsar: 'Amritsar',
      ahmedabad: 'Ahmedabad',
      surat: 'Surat',
      baroda: 'Baroda'
    },
    villages: {
      malihabad: 'Malihabad',
      'bakshi-ka-talab': 'Bakshi Ka Talab',
      'mohanlalganj': 'Mohanlalganj',
      viramgam: 'Viramgam',
      kalol: 'Kalol',
      mandal: 'Mandal'
    }
  }

  // Profile stats
  const profileStats = [
    {
      title: "Years of Experience",
      value: userData.experience || "Not specified",
      icon: <Calendar className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Farm Size",
      value: userData.farmSize || "Not specified",
      icon: <Sprout className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Member Since",
      value: userData.dateJoined ? new Date(userData.dateJoined).getFullYear().toString() : "Not specified",
      icon: <Award className="w-5 h-5" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Location",
      value: userData.village && userData.district ? `${locationData.villages[userData.village] || userData.village}, ${locationData.districts[userData.district] || userData.district}` : "Not specified",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ]

  // Tab items
  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ]

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTempUserData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    
    // Validate password strength when new password changes
    if (field === 'newPassword') {
      validatePasswordStrength(value)
    }
  }

  // Password strength validation
  const validatePasswordStrength = (password) => {
    const errors = {}
    let strength = 0
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters long'
    } else {
      strength += 1
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter'
    } else {
      strength += 1
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter'
    } else {
      strength += 1
    }
    
    if (!/\d/.test(password)) {
      errors.number = 'Password must contain at least one number'
    } else {
      strength += 1
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.special = 'Password must contain at least one special character'
    } else {
      strength += 1
    }
    
    setPasswordErrors(errors)
    setPasswordStrength(strength)
  }

  // Get password strength color and text
  const getPasswordStrengthInfo = () => {
    if (passwordStrength <= 2) return { color: 'text-red-600', text: 'Weak', bgColor: 'bg-red-100' }
    if (passwordStrength <= 3) return { color: 'text-yellow-600', text: 'Fair', bgColor: 'bg-yellow-100' }
    if (passwordStrength <= 4) return { color: 'text-blue-600', text: 'Good', bgColor: 'bg-blue-100' }
    return { color: 'text-green-600', text: 'Strong', bgColor: 'bg-green-100' }
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('No authentication token found')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8000/api/profile/update/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempUserData)
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setUserData(data.profile)
        setTempUserData(data.profile)
        setEditMode(false)
        alert('Profile updated successfully!')
      } else {
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setTempUserData({ ...userData })
    setEditMode(false)
  }

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newData = { ...tempUserData, profileImage: e.target.result }
        setTempUserData(newData)
        if (!editMode) {
          setUserData(newData)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle password change
  const handlePasswordUpdate = async () => {
    // Validate password strength
    if (Object.keys(passwordErrors).length > 0) {
      alert('Please fix password validation errors before continuing')
      return
    }
    
    if (passwordStrength < 3) {
      alert('Password is too weak. Please choose a stronger password.')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('No authentication token found')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8000/api/profile/password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setPasswordErrors({})
        setPasswordStrength(0)
        setShowPasswordFields(false)
        alert('Password updated successfully!')
      } else {
        alert(data.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* TopBar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Profile" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {/* <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-stone-50 transition-colors">
                  <Camera className="w-4 h-4 text-stone-600" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label> */}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {userData.firstName || 'User'} {userData.lastName || ''}
                </h1>
                <p className="text-emerald-100 text-lg mb-2">{userData.bio || 'No bio available'}</p>
                <div className="flex items-center gap-4 text-sm text-emerald-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {userData.village ? (locationData.villages[userData.village] || userData.village) : 'Location not set'}, {userData.district ? (locationData.districts[userData.district] || userData.district) : ''}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {userData.dateJoined ? new Date(userData.dateJoined).getFullYear() : 'N/A'}</span>
                  </div> */}
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(!editMode)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Stats */}
          {/* <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {profileStats.map((stat, index) => (
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
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Tabs and Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Settings</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-600'
                          : 'text-stone-600 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200">
                {/* Profile Info Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-stone-800">Profile Information</h3>
                      {editMode && (
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border-2 border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-all duration-300"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                          >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? 'Saving...' : 'Save'}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2">Personal Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">First Name</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.firstName || ''}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.firstName || 'Not specified'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Last Name</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.lastName || ''}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.lastName || 'Not specified'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                          {editMode ? (
                            <input
                              type="email"
                              value={tempUserData.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-stone-500" />
                              {userData.email || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Phone</label>
                          <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-stone-500" />
                            {userData.phone ? `+91 ${userData.phone}` : 'Not specified'}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">Phone number cannot be changed for security reasons</p>
                        </div>
                      </div>

                      {/* Location & Farming Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2">Location & Farming</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">State</label>
                          {editMode ? (
                            <select
                              value={tempUserData.state || ''}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            >
                              <option value="">Select State</option>
                              {Object.entries(locationData.states).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-stone-500" />
                              {userData.state ? (locationData.states[userData.state] || userData.state) : 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">District</label>
                          {editMode ? (
                            <select
                              value={tempUserData.district || ''}
                              onChange={(e) => handleInputChange('district', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            >
                              <option value="">Select District</option>
                              {Object.entries(locationData.districts).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">
                              {userData.district ? (locationData.districts[userData.district] || userData.district) : 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Village</label>
                          {editMode ? (
                            <select
                              value={tempUserData.village || ''}
                              onChange={(e) => handleInputChange('village', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            >
                              <option value="">Select Village</option>
                              {Object.entries(locationData.villages).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">
                              {userData.village ? (locationData.villages[userData.village] || userData.village) : 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Farm Size</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.farmSize || ''}
                              onChange={(e) => handleInputChange('farmSize', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                              placeholder="e.g., 5.2 acres"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.farmSize || 'Not specified'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Experience</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.experience || ''}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                              placeholder="e.g., 15 years"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.experience || 'Not specified'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2 mb-4">Bio</h4>
                      {editMode ? (
                        <textarea
                          value={tempUserData.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                          placeholder="Tell us about your farming experience..."
                        />
                      ) : (
                        <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.bio || 'No bio available'}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">Security Settings</h3>
                    
                    {/* Password Change Section */}
                    <div className="space-y-6">
                      <div className="p-6 border-2 border-stone-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-stone-700">Change Password</h4>
                            <p className="text-sm text-stone-600">Update your password to keep your account secure</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
                          >
                            {showPasswordFields ? 'Cancel' : 'Change Password'}
                          </button>
                        </div>

                        {showPasswordFields && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-stone-600 mb-1">Current Password</label>
                              <div className="relative">
                                <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                  className="w-full px-3 py-2 pr-10 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                                />
                                <button
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-stone-600 mb-1">New Password</label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  value={passwordData.newPassword}
                                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                  className="w-full px-3 py-2 pr-10 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                                />
                                <button
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                                >
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              
                              {/* Password Strength Indicator */}
                              {passwordData.newPassword && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-stone-600">Password Strength:</span>
                                    <span className={`text-sm font-medium px-2 py-1 rounded ${getPasswordStrengthInfo().bgColor} ${getPasswordStrengthInfo().color}`}>
                                      {getPasswordStrengthInfo().text}
                                    </span>
                                  </div>
                                  <div className="w-full bg-stone-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        passwordStrength <= 2 ? 'bg-red-500' : 
                                        passwordStrength <= 3 ? 'bg-yellow-500' : 
                                        passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Password Validation Messages */}
                              {passwordData.newPassword && Object.keys(passwordErrors).length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {Object.entries(passwordErrors).map(([key, message]) => (
                                    <div key={key} className="flex items-center gap-2 text-sm text-red-600">
                                      <AlertCircle className="w-4 h-4" />
                                      {message}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-stone-600 mb-1">Confirm New Password</label>
                              <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                              />
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handlePasswordUpdate}
                              disabled={loading}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                            >
                              {loading ? <Loader2 className="w-4 h-5" /> : <Lock className="w-4 h-5" />}
                              {loading ? 'Updating...' : 'Update Password'}
                            </motion.button>
                          </motion.div>
                        )}
                      </div>

                      {/* Account Security Status */}
                      <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                        <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Account Security Status
                        </h4>
                        <div className="space-y-2 text-sm">
                          {/* <div className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Email verified</span>
                          </div> */}
                          <div className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Phone number verified</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Strong password set</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">App Settings</h3>
                    
                    <div className="space-y-6">
                      {/* Account Actions */}
                      <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                        <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Account Actions
                        </h4>
                        <div className="space-y-3">
                          <button onClick={async ()=>{
                            try{
                              const token = localStorage.getItem('token')
                              const res = await fetch('http://localhost:8000/api/profile/download/', { headers: { Authorization: `Bearer ${token}` }})
                              const data = await res.json()
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = 'my_profile.json'
                              a.click()
                              URL.revokeObjectURL(url)
                            }catch(e){ alert('Failed to download data') }
                          }} className="w-full px-4 py-2 text-left text-stone-700 hover:bg-white rounded-lg transition-colors">
                            Download My Data
                          </button>
                          <button onClick={async ()=>{
                            if(!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
                            try{
                              const token = localStorage.getItem('token')
                              const res = await fetch('http://localhost:8000/api/profile/delete/', { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }})
                              const data = await res.json()
                              if(res.ok && data.success){
                                localStorage.removeItem('token');
                                localStorage.removeItem('userName');
                                window.location.href = '/login'
                              }else{
                                alert(data.error || 'Failed to delete account')
                              }
                            }catch(e){ alert('Failed to delete account') }
                          }} className="w-full px-4 py-2 text-left text-red-600 hover:bg-white rounded-lg transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile