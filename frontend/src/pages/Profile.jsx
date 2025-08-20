import { useState } from "react"
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

  // Mock user data based on signup form structure
  const [userData, setUserData] = useState({
    firstName: 'राम',
    lastName: 'प्रसाद',
    email: 'ram.prasad@gmail.com',
    phone: '9876543210',
    state: 'up',
    district: 'lucknow',
    village: 'malihabad',
    latitude: '26.8467',
    longitude: '80.9462',
    crops: ['wheat', 'rice', 'sugarcane'],
    joinDate: '2023-08-15',
    profileImage: null,
    bio: 'Experienced farmer with 15+ years in sustainable agriculture',
    farmSize: '5.2 acres',
    experience: '15 years'
  })

  const [tempUserData, setTempUserData] = useState({ ...userData })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  // Location mapping
  const locationData = {
    states: {
      up: 'Uttar Pradesh',
      punjab: 'Punjab',
      haryana: 'Haryana',
      rajasthan: 'Rajasthan',
      mp: 'Madhya Pradesh'
    },
    districts: {
      lucknow: 'Lucknow',
      kanpur: 'Kanpur',
      agra: 'Agra',
      ludhiana: 'Ludhiana',
      amritsar: 'Amritsar'
    },
    villages: {
      malihabad: 'Malihabad',
      'bakshi-ka-talab': 'Bakshi Ka Talab',
      'mohanlalganj': 'Mohanlalganj'
    },
    crops: {
      wheat: 'Wheat',
      rice: 'Rice',
      sugarcane: 'Sugarcane',
      cotton: 'Cotton',
      maize: 'Maize',
      pulses: 'Pulses'
    }
  }

  // Profile stats
  const profileStats = [
    {
      title: "Years of Experience",
      value: userData.experience,
      icon: <Calendar className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Farm Size",
      value: userData.farmSize,
      icon: <Sprout className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Crops Grown",
      value: `${userData.crops.length} Types`,
      icon: <Award className="w-5 h-5" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Member Since",
      value: new Date(userData.joinDate).getFullYear().toString(),
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
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUserData({ ...tempUserData })
    setEditMode(false)
    setLoading(false)
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
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordFields(false)
    setLoading(false)
    alert('Password updated successfully!')
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
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-stone-50 transition-colors">
                  <Camera className="w-4 h-4 text-stone-600" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-emerald-100 text-lg mb-2">{userData.bio}</p>
                <div className="flex items-center gap-4 text-sm text-emerald-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {locationData.villages[userData.village]}, {locationData.districts[userData.district]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(userData.joinDate).getFullYear()}</span>
                  </div>
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

          {/* Stats Section */}
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
                              value={tempUserData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Last Name</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.lastName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                          {editMode ? (
                            <input
                              type="email"
                              value={tempUserData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-stone-500" />
                              {userData.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Phone</label>
                          {editMode ? (
                            <input
                              type="tel"
                              value={tempUserData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-stone-500" />
                              +91 {userData.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Location & Farming Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2">Location & Farming</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">State</label>
                          <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-stone-500" />
                            {locationData.states[userData.state]}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">District</label>
                          <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">
                            {locationData.districts[userData.district]}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Village</label>
                          <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">
                            {locationData.villages[userData.village]}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Farm Size</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.farmSize}
                              onChange={(e) => handleInputChange('farmSize', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.farmSize}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Experience</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={tempUserData.experience}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.experience}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Crops Section */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2 mb-4">Crops Grown</h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.crops.map((crop, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200"
                          >
                            {locationData.crops[crop]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2 mb-4">Bio</h4>
                      {editMode ? (
                        <textarea
                          value={tempUserData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                          placeholder="Tell us about your farming experience..."
                        />
                      ) : (
                        <p className="px-3 py-2 bg-stone-50 rounded-lg text-stone-700">{userData.bio}</p>
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
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
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
                          <div className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Email verified</span>
                          </div>
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
                      {/* Notification Settings */}
                      <div className="p-6 border-2 border-stone-200 rounded-xl">
                        <h4 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
                          <Bell className="w-5 h-5" />
                          Notification Preferences
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Weather Alerts</p>
                              <p className="text-sm text-stone-600">Get notified about weather changes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Crop Health Updates</p>
                              <p className="text-sm text-stone-600">Receive disease detection alerts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Market Updates</p>
                              <p className="text-sm text-stone-600">Stay updated on crop prices</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Community Updates</p>
                              <p className="text-sm text-stone-600">Forum discussions and tips</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Language & Region */}
                      <div className="p-6 border-2 border-stone-200 rounded-xl">
                        <h4 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          Language & Region
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-stone-600 mb-2">Language</label>
                            <select className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors">
                              <option value="en">English</option>
                              <option value="hi">हिंदी</option>
                              <option value="pa">ਪੰਜਾਬੀ</option>
                              <option value="gu">ગુજરાતી</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-600 mb-2">Unit System</label>
                            <select className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors">
                              <option value="metric">Metric (Celsius, Kilometers)</option>
                              <option value="imperial">Imperial (Fahrenheit, Miles)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Data & Privacy */}
                      <div className="p-6 border-2 border-stone-200 rounded-xl">
                        <h4 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Data & Privacy
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Location Tracking</p>
                              <p className="text-sm text-stone-600">Allow location access for weather updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-700">Data Analytics</p>
                              <p className="text-sm text-stone-600">Help improve our services</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          <div className="pt-4 border-t border-stone-200">
                            <p className="text-xs text-stone-500">
                              We respect your privacy. Your data is encrypted and never shared with third parties without your consent. 
                              Read our <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a> for more details.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                        <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Account Actions
                        </h4>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-2 text-left text-stone-700 hover:bg-white rounded-lg transition-colors">
                            Download My Data
                          </button>
                          <button className="w-full px-4 py-2 text-left text-orange-600 hover:bg-white rounded-lg transition-colors">
                            Deactivate Account
                          </button>
                          <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-white rounded-lg transition-colors">
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

          {/* Activity Timeline */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200"
          >
            <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  action: "Profile updated",
                  time: "2 hours ago",
                  description: "Changed profile picture and bio",
                  icon: <User className="w-4 h-4" />,
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  action: "Disease detection used",
                  time: "1 day ago",
                  description: "Analyzed wheat crop images",
                  icon: <Camera className="w-4 h-4" />,
                  color: "bg-green-100 text-green-600"
                },
                {
                  action: "Weather alert received",
                  time: "2 days ago",
                  description: "Rain forecasted for next week",
                  icon: <Bell className="w-4 h-4" />,
                  color: "bg-amber-100 text-amber-600"
                },
                {
                  action: "Marketplace activity",
                  time: "3 days ago",
                  description: "Listed wheat for sale",
                  icon: <TrendingUp className="w-4 h-4" />,
                  color: "bg-purple-100 text-purple-600"
                },
                {
                  action: "Community post",
                  time: "1 week ago",
                  description: "Shared farming tips in forum",
                  icon: <Activity className="w-4 h-4" />,
                  color: "bg-teal-100 text-teal-600"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-stone-800">{activity.action}</h4>
                      <span className="text-sm text-stone-500">{activity.time}</span>
                    </div>
                    <p className="text-stone-600 text-sm mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </main>
    </div>
  )
}

export default Profile