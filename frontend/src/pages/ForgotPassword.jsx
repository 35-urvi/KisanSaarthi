import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  Lock,
  KeyRound
} from 'lucide-react'

// Reusable Input Component
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

// Main Forgot Password Component
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showOtpFields, setShowOtpFields] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)

  // Validation functions
  const validatePhone = () => {
    const newErrors = {}
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Mobile number must be 10 digits'
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

  const validatePasswords = () => {
    const newErrors = {}
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtp(newOtp)
    
    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index}"]`)
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

  // const handleSendOTP = async () => {
  //   if (validatePhone()) {
  //     setLoading(true)
  //     // Simulate OTP sending
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     setOtpSent(true)
  //     setShowOtpFields(true)
  //     setCurrentStep(2)
  //     setLoading(false)
  //   }
  // }
  const handleSendOTP = async () => {
  if (validatePhone()) {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/forgot-password/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone })
      })
      const data = await res.json()
      if (data.success) {
        setOtpSent(true)
        setShowOtpFields(true)
        setCurrentStep(2)
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert("Failed to send OTP")
    }
    setLoading(false)
  }
}

  // const handleVerifyOTP = async () => {
  //   if (validateOTP()) {
  //     setLoading(true)
  //     // Simulate OTP verification
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     setCurrentStep(3)
  //     setLoading(false)
  //   }
  // }
  const handleVerifyOTP = async () => {
  if (validateOTP()) {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/forgot-password/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, otp: otp.join('') })
      })
      const data = await res.json()
      if (data.success) {
        setCurrentStep(3)
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert("Failed to verify OTP")
    }
    setLoading(false)
  }
}


const handleResendOTP = async () => {
  setLoading(true)
  try {
    const res = await fetch("http://localhost:8000/api/forgot-password/send-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone })
    })
    const data = await res.json()
    if (data.success) {
      alert("A new OTP has been sent to your phone.")
    } else {
      alert(data.error)
    }
  } catch (err) {
    alert("Failed to resend OTP")
  }
  setLoading(false)
}


  // const handleResetPassword = async () => {
  //   if (validatePasswords()) {
  //     setLoading(true)
  //     // Simulate password reset
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     setLoading(false)
  //     // Show success message
  //     alert('Password reset successful! You can now login with your new password.')
  //   }
  // }
  const handleResetPassword = async () => {
  if (validatePasswords()) {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/forgot-password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, newPassword: formData.newPassword })
      })
      const data = await res.json()
      if (data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        alert("Password reset successful! Please login.")
        navigate("/login")
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert("Failed to reset password")
    }
    setLoading(false)
  }
}

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const stepVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* <motion.div
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
        </motion.div> */}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sprout className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-800">KisanSaarthi</h1>
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Reset Password</h2>
            <p className="text-stone-600 text-sm">
              {currentStep === 1 && "Enter your mobile number to receive OTP"}
              {currentStep === 2 && "Verify the OTP sent to your mobile"}
              {currentStep === 3 && "Create your new password"}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {/* Form Steps */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Mobile Number Input */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
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
                      <Phone className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-stone-700">Enter Mobile Number</h3>
                    <p className="text-stone-600 text-sm mt-2">
                      We'll send an OTP to verify your identity
                    </p>
                  </div>
                  
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
                  
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-blue-50 p-3 rounded-lg mb-6">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>We'll send a 6-digit verification code to this number</span>
                  </div>
                </motion.div>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
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
                    <h3 className="text-lg font-semibold text-stone-700">Verify OTP</h3>
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
                        onClick={handleResendOTP}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        Didn't receive code? Resend
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password Reset */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
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
                      <KeyRound className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-stone-700">Create New Password</h3>
                    <p className="text-stone-600 text-sm mt-2">
                      Choose a strong password for your account
                    </p>
                  </div>
                  
                  <Input
                    label="New Password"
                    type="password"
                    icon={Lock}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    error={errors.newPassword}
                    required
                    placeholder="Enter new password"
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type="password"
                    icon={Lock}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                    placeholder="Confirm new password"
                  />
                  
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-blue-50 p-3 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Password should be at least 6 characters long</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6 gap-4">
            {currentStep > 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goBack}
                className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-700 border-2 border-stone-300 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            ) : (
              <div></div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={
                currentStep === 1 ? handleSendOTP :
                currentStep === 2 ? handleVerifyOTP :
                handleResetPassword
              }
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {loading ? 'Processing...' : 
               currentStep === 1 ? 'Send OTP' :
               currentStep === 2 ? 'Verify OTP' :
               'Reset Password'}
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : currentStep === 3 ? (
                <KeyRound className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-600">
              Remember your password?{' '}
              <button className="text-emerald-600 hover:text-emerald-700 font-medium" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword