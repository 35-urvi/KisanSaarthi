import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Shield,
  Sprout,
  ArrowRight,
  UserPlus,
  Key
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
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-2 text-red-500 text-sm"
          id={`${label}-error`}
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}
    </div>
  )
}

// Reusable Card Component
const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-100 ${className}`}
  >
    {children}
  </motion.div>
)

// Main Login Component
const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  })
  
  const [errors, setErrors] = useState({})

  // Validation function
  const validateLogin = () => {
    const newErrors = {}
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Mobile number must be 10 digits'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
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

  // const handleLogin = async () => {
  //   if (validateLogin()) {
  //     setLoading(true)
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     setLoading(false)
  //     // Handle successful login here
  //     alert('Login successful! Welcome back to KisanSaarthi!')
  //   }
  // }
  const handleLogin = async () => {
  if (validateLogin()) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        alert("Login successful! Welcome back to KisanSaarthi!");
        // optionally save user info to localStorage
        // localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setErrors(prev => ({ ...prev, password: data.error || "Login failed" }));
      }
    } catch (err) {
      setLoading(false);
      setErrors(prev => ({ ...prev, password: "Server error, please try again" }));
    }
  }
};


  // const handleForgotPasswordClick = () => {
  //   // Pass the current phone number to forgot password page if available
  //   if (onForgotPassword) {
  //     onForgotPassword(formData.phone)
  //   }
  // }

  // const handleSignUpClick = () => {
  //   if (onSignUp) {
  //     onSignUp()
  //   }
  // }

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
        <Card className="w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sprout className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-800">KisanSaarthi</h1>
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Welcome Back</h2>
            <p className="text-stone-600 text-sm">Sign in to continue your farming journey</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Mobile Number Input */}
            <Input
              label="Mobile Number"
              type="tel"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="Enter 10-digit mobile number"
              required
              maxLength={10}
            />
            
            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              icon={Shield}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm text-stone-600">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={() => navigate("/forgotpassword")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1"
              >
                <Key className="h-3 w-3" />
                Forgot password?
              </button>
            </div>
            
            {/* Login Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </div>

          {/* Additional Info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-emerald-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate("/signup")}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors inline-flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </button>
            </p>
          </div>

          {/* App Info */}
          <div className="text-center mt-4">
            <p className="text-xs text-stone-500">
              Empowering farmers with technology and knowledge
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login