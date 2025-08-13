#!/usr/bin/env python
"""
Test script for signup and OTP functionality
Run this after starting the Django server
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_signup():
    """Test the signup process"""
    print("Testing signup process...")
    
    # Test data
    signup_data = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "phone": "9876543210",
        "password": "testpass123",
        "state": "up",
        "district": "lucknow",
        "village": "malihabad"
    }
    
    # Make signup request
    response = requests.post(
        f"{BASE_URL}/signup/",
        json=signup_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Signup Response Status: {response.status_code}")
    print(f"Signup Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Signup successful! OTP should be displayed in console.")
        return True
    else:
        print("❌ Signup failed!")
        return False

def test_resend_otp():
    """Test resending OTP"""
    print("\nTesting resend OTP...")
    
    response = requests.post(
        f"{BASE_URL}/resend-otp/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Resend OTP Response Status: {response.status_code}")
    print(f"Resend OTP Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ OTP resent successfully!")
        return True
    else:
        print("❌ OTP resend failed!")
        return False

if __name__ == "__main__":
    print("🚀 Starting signup and OTP tests...")
    print("Make sure Django server is running on http://localhost:8000")
    print("-" * 50)
    
    # Test signup
    if test_signup():
        # Wait a bit then test resend
        import time
        time.sleep(2)
        test_resend_otp()
    
    print("\n" + "=" * 50)
    print("Test completed! Check the console output above.")
