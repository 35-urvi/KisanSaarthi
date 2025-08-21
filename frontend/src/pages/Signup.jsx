import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Sprout,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

// Reusable Components
const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  icon: Icon,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && showPassword ? 'text' : type

  return (
    <div className="relative mb-6">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3.5 h-5 w-5 text-stone-400 transition-colors" />
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3.5 ${Icon ? 'pl-12' : ''} ${isPasswordType ? 'pr-12' : ''} 
            bg-white border-2 rounded-xl transition-all duration-300 outline-none
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : isFocused 
                ? 'border-emerald-400 shadow-lg shadow-emerald-100' 
                : 'border-stone-200 hover:border-stone-300'
            }
            text-stone-700 placeholder-stone-400
          `}
          required={required}
          aria-label={label}
          aria-describedby={error ? `${label}-error` : undefined}
          {...props}
        />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: isFocused || value ? '-0.5rem' : '0.875rem',
            left: Icon ? '2.75rem' : '1rem',
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            color: error ? '#ef4444' : isFocused ? '#10b981' : '#6b7280'
          }}
          className="absolute bg-white px-2 pointer-events-none font-medium transition-all duration-300"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </motion.label>

        {/* Password Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1 mt-2 text-red-500 text-sm"
            id={`${label}-error`}
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Select = ({ label, value, onChange, options, error, required = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative mb-6">
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-300 outline-none
          ${error 
            ? 'border-red-300 focus:border-red-500' 
            : isFocused 
              ? 'border-emerald-400 shadow-lg shadow-emerald-100' 
              : 'border-stone-200 hover:border-stone-300'
          }
          text-stone-700 appearance-none cursor-pointer
        `}
        required={required}
        aria-label={label}
        {...props}
      >
        <option value="" disabled>Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <motion.label
        initial={false}
        animate={{
          top: isFocused || value ? '-0.5rem' : '0.875rem',
          left: '1rem',
          fontSize: isFocused || value ? '0.75rem' : '1rem',
          color: error ? '#ef4444' : isFocused ? '#10b981' : '#6b7280'
        }}
        className="absolute bg-white px-2 pointer-events-none font-medium transition-all duration-300"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </motion.label>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1 mt-2 text-red-500 text-sm"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Button = ({ 
  children, 
  onClick, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600',
    secondary: 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300',
    outline: 'bg-transparent hover:bg-emerald-50 text-emerald-600 border-emerald-600'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        border-2 rounded-xl font-semibold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : Icon ? (
        <Icon className="h-5 w-5" />
      ) : null}
      {!loading && children}
    </motion.button>
  )
}

const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-100 ${className}`}
  >
    {children}
  </motion.div>
)

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center gap-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <React.Fragment key={step}>
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === step ? 1.2 : 1,
              backgroundColor: currentStep >= step ? '#10b981' : '#d1d5db'
            }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
              ${currentStep === step ? 'ring-4 ring-emerald-200' : ''}
            `}
          >
            {currentStep > step ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              step
            )}
          </motion.div>
          {step < totalSteps && (
            <motion.div
              initial={false}
              animate={{
                backgroundColor: currentStep > step ? '#10b981' : '#d1d5db'
              }}
              className="w-8 h-1 rounded"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
)

// Main Signup Component
const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  state: "",
  district: "",
  village: "",
  confirmPassword: "",
});

  // const [otp, setOtp] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpStep, setOtpStep] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);


  const [errors, setErrors] = useState({})

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showOtpFields, setShowOtpFields] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [locationPermission, setLocationPermission] = useState('prompt')

  // Sample data
  const states = [
    {valuse:'gujarat',label:'Gujarat'},
    { value: 'up', label: 'Uttar Pradesh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'haryana', label: 'Haryana' },
    // { value: 'rajasthan', label: 'Rajasthan' },
    // { value: 'mp', label: 'Madhya Pradesh' }
  ]

  const districts = {
    gujarat: [
      { value: 'ahmedabad', label: 'Ahmedabad' },
      { value: 'surat', label: 'Surat' },
      { value: 'baroda', label: 'Baroda' }
    ],
    up: [
      { value: 'lucknow', label: 'Lucknow' },
      { value: 'kanpur', label: 'Kanpur' },
      { value: 'agra', label: 'Agra' }
    ],
    punjab: [
      { value: 'ludhiana', label: 'Ludhiana' },
      { value: 'amritsar', label: 'Amritsar' },
      { value: 'jalandhar', label: 'Jalandhar' }
    ],
    haryana: [
      { value: 'gurgaon', label: 'Gurgaon' },
      { value: 'faridabad', label: 'Faridabad' },
      { value: 'panipat', label: 'Panipat' }
    ]
  }

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendSeconds])

  const villages = {
    ahmedabad: [
      { value: 'viramgam', label: 'viramgam' },
      { value: 'kalol', label: 'kalol' },
      { value: 'mandal', label: 'mandal' }
    ],
    surat:[

    ],
    baroda:[

    ],
    lucknow: [
      { value: 'malihabad', label: 'Malihabad' },
      { value: 'bakshi-ka-talab', label: 'Bakshi Ka Talab' },
      { value: 'mohanlalganj', label: 'Mohanlalganj' }
    ],
    kanpur: [
      { value: 'bilhaur', label: 'Bilhaur' },
      { value: 'ghatampur', label: 'Ghatampur' },
      { value: 'derapur', label: 'Derapur' }
    ],
    agra: [
      { value: 'fatehabad', label: 'Fatehabad' },
      { value: 'kheragarh', label: 'Kheragarh' },
      { value: 'bah', label: 'Bah' }
    ],
    ludhiana: [
      { value: 'doraha', label: 'Doraha' },
      { value: 'khanna', label: 'Khanna' },
      { value: 'payal', label: 'Payal' }
    ],
    amritsar: [
      { value: 'tarn-taran', label: 'Tarn Taran' },
      { value: 'jandiala', label: 'Jandiala Guru' },
      { value: 'rayya', label: 'Rayya' }
    ],
    jalandhar: [
      { value: 'nakodar', label: 'Nakodar' },
      { value: 'phillaur', label: 'Phillaur' },
      { value: 'adampur', label: 'Adampur' }
    ],
    gurgaon: [
      { value: 'sohna', label: 'Sohna' },
      { value: 'pataudi', label: 'Pataudi' },
      { value: 'farukh-nagar', label: 'Farukh Nagar' }
    ],
    faridabad: [
      { value: 'ballabgarh', label: 'Ballabgarh' },
      { value: 'tigaon', label: 'Tigaon' },
      { value: 'palwal', label: 'Palwal' }
    ],
    panipat: [
      { value: 'samalkha', label: 'Samalkha' },
      { value: 'israna', label: 'Israna' },
      { value: 'bapoli', label: 'Bapoli' }
    ]
  }

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.district) newErrors.district = 'District is required'
    if (!formData.village) newErrors.village = 'Village is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Please choose a stronger password.'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOTP = () => {
    const newErrors = {}
    const otpValue = otp.join('')
    if (!otpValue.trim()) {
      newErrors.otp = 'OTP is required'
    } else if (otpValue.length !== 6) {
      newErrors.otp = 'Please enter complete 6-digit OTP'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    
    // Validate password strength when password changes
    if (field === 'password') {
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
    if (passwordStrength <= 3) return { color: 'text-yellow-600', text: 'Fair', bgColor: 'bg-blue-100' }
    if (passwordStrength <= 4) return { color: 'text-blue-600', text: 'Good', bgColor: 'bg-blue-100' }
    return { color: 'text-green-600', text: 'Strong', bgColor: 'bg-green-100' }
  }

  // GPS Location Functions
  const getCurrentLocation = () => {
    setGpsLoading(true)
    
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, gps: 'Geolocation is not supported by this browser' }))
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        handleInputChange('latitude', latitude.toFixed(6))
        handleInputChange('longitude', longitude.toFixed(6))
        
        // Try to get location details from reverse geocoding
        try {
          await reverseGeocode(latitude, longitude)
          setLocationPermission('granted')
        } catch (error) {
          console.log('Reverse geocoding failed:', error)
        }
        
        setGpsLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            setLocationPermission('denied')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setErrors(prev => ({ ...prev, gps: errorMessage }))
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const reverseGeocode = async (lat, lng) => {
    // This is a mock implementation. In a real app, you'd use a service like:
    // - Google Maps Geocoding API
    // - OpenStreetMap Nominatim
    // - MapBox Geocoding API
    
    // For demo purposes, we'll simulate the response
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock response - in reality, you'd parse the actual API response
    const mockLocationData = {
      state: 'up',
      district: 'lucknow',
      village: 'malihabad'
    }
    
    // Auto-fill the form with the geocoded data
    handleInputChange('state', mockLocationData.state)
    handleInputChange('district', mockLocationData.district)
    handleInputChange('village', mockLocationData.village)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtp(newOtp)
    
    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`)
      nextInput?.focus()
    }
    
    // Clear error if exists
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: null }))
    }
  }

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`)
      prevInput?.focus()
    }
  }

  const nextStep = async () => {
    let isValid = false
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        if (isValid) {
          setLoading(true)
          // Simulate OTP sending
          await new Promise(resolve => setTimeout(resolve, 2000))
          setOtpSent(true)
          setShowOtpFields(true)
          setLoading(false)
        }
        break
      default:
        isValid = true
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSignup = async () => {
        console.log(formData)

  try {
    const response = await fetch("http://localhost:8000/api/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success("OTP sent successfully");
      setShowOtpFields(true)
       setCurrentStep(4)
      // Start resend cooldown timer
      setResendSeconds(60)
      
      // Display OTP for development (remove in production)
      if (data.otp) {
        console.log("OTP for testing:", data.otp);
        toast.success(`OTP for testing: ${data.otp}`)
      }
      
      // setCurrentStep(prev => prev + 1)
      setOtpStep(true); // Move to OTP input step
    } else {
      toast.error(data.error || "Signup failed");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

const handleVerifyOtp = async () => {
   const otpValue = otp.join("");
  console.log(otpValue)
  try {
    const response = await fetch("http://localhost:8000/api/verify-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp: otpValue }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      if (formData.firstName || formData.lastName) {
        const fullName = `${formData.firstName ?? ''} ${formData.lastName ?? ''}`.trim()
        if (fullName) localStorage.setItem("userName", fullName)
      }
      toast.success("Signup successful");
      navigate("/login");
    } else {
      console.log(data.s)
      toast.error(data.error|| "OTP verification failed");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


  // const handleOTPSubmit = async () => {
  //   if (validateOTP()) {
  //     setLoading(true)
  //     // Simulate OTP verification
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     setLoading(false)
  //     // Handle successful signup
  //     alert('Signup successful! Welcome to KisanSaarthi!')
  //   }
  // }

  

  const stepVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 bg-amber-400/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 text-6xl opacity-20"
        >
          🌱
        </motion.div>
        <motion.div
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-20 text-4xl opacity-30"
        >
          🌿
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-20 text-5xl opacity-25"
        >
          🌾
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sprout className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-800">KisanSaarthi</h1>
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Join Our Farming Community</h2>
            <p className="text-stone-600 text-sm">Create your account to get started</p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={4} />

          {/* Form Steps */}
          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-stone-700 mb-6">Basic Information</h3>
                  
                  <Input
                    label="First Name"
                    icon={User}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                    required
                  />
                  
                  <Input
                    label="Last Name"
                    icon={User}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </motion.div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-stone-700 mb-6">Location Information</h3>
                  
                  {/* GPS Auto-fill Section */}
                  {/* <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Auto-detect Location</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={getCurrentLocation}
                        disabled={gpsLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {gpsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {gpsLoading ? 'Getting Location...' : 'Use My Location'}
                      </motion.button>
                    </div>
                    <p className="text-sm text-emerald-700">
                      Allow location access to automatically fill your address details
                    </p>
                    
                    GPS Coordinates Display
                    {formData.latitude && formData.longitude && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-2 bg-emerald-100 rounded-lg text-sm text-emerald-800"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Location detected: {formData.latitude}°N, {formData.longitude}°E</span>
                        </div>
                      </motion.div>
                    )}
                    
                    GPS Error Display
                    <AnimatePresence>
                      {errors.gps && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1 mt-3 text-red-600 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.gps}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div> */}
                  
                  <Select
                    label="State"
                    value={formData.state}
                    onChange={(e) => {
                      handleInputChange('state', e.target.value)
                      handleInputChange('district', '') // Reset district when state changes
                      handleInputChange('village', '') // Reset village when state changes
                    }}
                    options={states}
                    error={errors.state}
                    required
                  />
                  
                  <Select
                    label="District"
                    value={formData.district}
                    onChange={(e) => {
                      handleInputChange('district', e.target.value)
                      handleInputChange('village', '') // Reset village when district changes
                    }}
                    options={districts[formData.state] || []}
                    error={errors.district}
                    required
                    disabled={!formData.state}
                  />
                  
                  <Select
                    label="Village/Town"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    options={villages[formData.district] || []}
                    error={errors.village}
                    required
                    disabled={!formData.district}
                  />
                  
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-blue-50 p-3 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Accurate location helps us provide weather updates, local farming tips, and connect you with nearby farmers</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Security & Contact */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-stone-700 mb-6">Security & Contact</h3>
                  
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    required
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-stone-600">Password Strength:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          passwordStrength <= 2 ? 'bg-red-100 text-red-600' : 
                          passwordStrength <= 3 ? 'bg-yellow-100 text-yellow-600' : 
                          passwordStrength <= 4 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {passwordStrength <= 2 ? 'Weak' : 
                           passwordStrength <= 3 ? 'Fair' : 
                           passwordStrength <= 4 ? 'Good' : 'Strong'}
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
                  {formData.password && Object.keys(passwordErrors).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(passwordErrors).map(([key, message]) => (
                        <div key={key} className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {message}
                        </div>
                      ))}
                    </div>
                  )}
                  
                      <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                  
                  <Input
                    label="Mobile Number"
                    type="tel"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    required
                    placeholder="Enter 10-digit mobile number"
                  />
                  
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-blue-50 p-3 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>We'll send an OTP to verify your mobile number</span>
                  </div>
                </motion.div>
              )}

              {/* Step 4: OTP Verification */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Shield className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-stone-700">Verify Your Phone</h3>
                    <p className="text-stone-600 text-sm mt-2">
                      We've sent a 6-digit code to <br />
                      <span className="font-medium">+91 {formData.phone}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Animated OTP Input Fields */}
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.5, y: 20 }}
                          animate={{ 
                            opacity: showOtpFields ? 1 : 0, 
                            scale: showOtpFields ? 1 : 0.5,
                            y: showOtpFields ? 0 : 20
                          }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: 0.4,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }}
                        >
                          <input
                            type="text"
                            name={`otp-${index}`}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={`
                              w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
                              transition-all duration-300 outline-none
                              ${errors.otp 
                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                : digit 
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700' 
                                  : 'border-stone-200 focus:border-emerald-400 hover:border-stone-300'
                              }
                              focus:ring-2 focus:ring-emerald-200
                            `}
                            maxLength={1}
                            autoComplete="off"
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Error Message */}
                    <AnimatePresence>
                      {errors.otp && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center gap-1 text-red-500 text-sm"
                          role="alert"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.otp}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Success Animation for Complete OTP */}
                    {otp.join('').length === 6 && !errors.otp && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        OTP Complete
                      </motion.div>
                    )}
                    
                    {/* Resend Option */}
                    <div className="text-center">
                      <button
                        onClick={async () => {
                          if (resendSeconds > 0) return
                          try {
                            const res = await fetch("http://localhost:8000/api/resend-otp/", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setOtpSent(true)
                              toast.success("OTP resent successfully")
                              // Display new OTP for development (remove in production)
                              if (data.otp) {
                                console.log("New OTP for testing:", data.otp);
                                toast.success(`New OTP for testing: ${data.otp}`)
                              }
                              setResendSeconds(60)
                            } else {
                              toast.error(data.error || "Failed to resend OTP")
                            }
                          } catch (err) {
                            toast.error("Network error while resending OTP")
                          }
                        }}
                        className={`text-sm font-medium transition-colors ${resendSeconds>0 ? 'text-stone-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
                        disabled={resendSeconds > 0}
                      >
                        {resendSeconds > 0 ? `Resend available in ${resendSeconds}s` : "Didn't receive code? Resend"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6 gap-4">
            {currentStep > 1 && currentStep <= 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border border-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </motion.button>
            ) : (
              <div></div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={currentStep === 4 ? handleVerifyOtp : currentStep === 3 ? handleSignup : nextStep}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {loading ? 'Processing...' : currentStep === 4 ? 'Verify & Complete' : currentStep === 3 ? 'Send OTP' : 'Next Step'}
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : currentStep === 4 ? (
                <Shield className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-600">
              Already have an account?{' '}
              <button className="text-emerald-600 hover:text-emerald-700 font-medium" onClick={() => navigate("/login")}>
                Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Signup