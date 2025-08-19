import json
import os
import random
import requests
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from dotenv import load_dotenv
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ml.fertilizer_model import predict_from_payload
from .ml.crop_model import predict_crop_from_payload
from bs4 import BeautifulSoup
from datetime import datetime




# Generate a random 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))


# Send OTP via httpSMS Cloud API
def send_otp_sms(phone: str, otp: str) -> bool:
    API_URL = "https://api.httpsms.com/v1/messages/send"
    API_KEY = os.getenv("HTTPSMS_API_KEY")
    FROM_NUMBER = os.getenv("HTTPSMS_FROM_NUMBER")

    print("🔍 API Key loaded:", bool(API_KEY), "Length:", len(API_KEY) if API_KEY else 0)
    print("🔍 From Number:", FROM_NUMBER)

    if not API_KEY or not FROM_NUMBER:
        print(f"❌ API not configured. OTP for {phone}: {otp}")
        return False

    headers = {"x-api-key": API_KEY}
    payload = {
        "from": FROM_NUMBER,
        "to": f"+91{phone}",
        "content": f"Your OTP is {otp}. It is valid for 10 minutes."
    }

    try:
        r = requests.post(API_URL, json=payload, headers=headers, timeout=10)
        print("🔍 Response Status:", r.status_code)
        print("🔍 Response Body:", r.text)
        r.raise_for_status()
        return True
    except Exception as e:
        import traceback
        print("❌ Exception occurred:", e)
        traceback.print_exc()
        return False


@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        state = data.get("state")
        district = data.get("district")
        village = data.get("village")

        # Check for existing email
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        # Check for existing phone
        if UserProfile.objects.filter(phone=phone).exists():
            return JsonResponse({"error": "Phone already registered"}, status=400)

        # Generate OTP
        otp = generate_otp()
        # Store signup data temporarily in session
        request.session["signup_data"] = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "password": make_password(password),
            "state": state,
            "district": district,
            "village": village,
            "otp": otp,
            "otp_sent_at": datetime.now(timezone.utc).isoformat(),
            "otp_send_count": 1,
        }

        # Send OTP via httpSMS
        sent = send_otp_sms(phone, otp)
        if not sent:
            return JsonResponse({"error": "Failed to send OTP. Please try again."}, status=500)

        return JsonResponse({"message": "OTP sent successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        otp_entered = data.get("otp")

        signup_data = request.session.get("signup_data")
        if not signup_data:
            return JsonResponse({"error": "No signup data found"}, status=400)

        if signup_data["otp"] == otp_entered:
            # Create Django User
            user = User.objects.create(
                first_name=signup_data["first_name"],
                last_name=signup_data["last_name"],
                email=signup_data["email"],
                username=signup_data["email"],  # required internally
                password=signup_data["password"]
            )
            # Create UserProfile
            UserProfile.objects.create(
                user=user,
                phone=signup_data["phone"],
                state=signup_data["state"],
                district=signup_data["district"],
                village=signup_data["village"],
                is_verified=True
            )

            # Clear session
            del request.session["signup_data"]

            return JsonResponse({"message": "Signup successful"})

        return JsonResponse({"error": "Invalid OTP"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def resend_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    signup_data = request.session.get("signup_data")
    if not signup_data:
        return JsonResponse({"error": "No signup data found"}, status=400)

    # Cooldown: allow resend only every 60 seconds; limit to 5 sends
    try:
        last_sent = datetime.fromisoformat(signup_data.get("otp_sent_at"))
    except Exception:
        last_sent = None
    send_count = int(signup_data.get("otp_send_count", 0))

    now = datetime.now(timezone.utc)
    if last_sent and (now - last_sent) < timedelta(seconds=60):
        remaining = 60 - int((now - last_sent).total_seconds())
        if remaining < 0:
            remaining = 0
        return JsonResponse({"error": f"Please wait {remaining} seconds before resending"}, status=429)

    if send_count >= 5:
        return JsonResponse({"error": "Maximum OTP resend attempts reached"}, status=429)

    # Generate and send new OTP
    new_otp = generate_otp()
    signup_data["otp"] = new_otp
    signup_data["otp_sent_at"] = now.isoformat()
    signup_data["otp_send_count"] = send_count + 1
    request.session["signup_data"] = signup_data

    sent = send_otp_sms(signup_data["phone"], new_otp)
    if not sent:
        return JsonResponse({"error": "Failed to resend OTP. Please try again."}, status=500)

    return JsonResponse({"message": "OTP resent successfully"})

@api_view(["POST"])
def login(request):
    phone = request.data.get("phone")
    password = request.data.get("password")

    if not phone or not password:
        return JsonResponse({"success": False, "error": "Missing phone or password"}, status=400)

    try:
        profile = UserProfile.objects.get(phone=phone)
        user = profile.user
    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "error": "User not found"}, status=404)

    if not user.check_password(password):
        return JsonResponse({"success": False, "error": "Invalid password"}, status=401)

    return JsonResponse({
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.first_name,
            "phone": phone
        }
    })

otp_store = {}

@api_view(["POST"])
def forgot_password_send_otp(request):
    phone = request.data.get("phone")
    if not phone:
        return JsonResponse({"success": False, "error": "Phone number is required"}, status=400)

    # Check if user exists
    try:
        profile = UserProfile.objects.get(phone=phone)
        user = profile.user
    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "error": "User not found"}, status=404)

    # Generate OTP
    otp = str(random.randint(100000, 999999))
    otp_store[phone] = otp

    # Send via HTTP SMS (replace with your actual SMS sending logic)
    api_key = os.getenv("HTTPSMS_API_KEY")
    from_number = os.getenv("HTTPSMS_FROM_NUMBER")

    payload = {
        "from": from_number,
        "to": f"+91{phone}",
        "content": f"Your OTP for password reset is {otp}"
    }

    headers = {"x-api-key": api_key}

    try:
        response = requests.post("https://api.httpsms.com/v1/messages/send", json=payload, headers=headers)
        if response.status_code == 200:
            return JsonResponse({"success": True, "message": "OTP sent successfully"})
        else:
            return JsonResponse({"success": False, "error": "Failed to send OTP"}, status=500)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["POST"])
def forgot_password_verify_otp(request):
    phone = request.data.get("phone")
    otp = request.data.get("otp")

    if not phone or not otp:
        return JsonResponse({"success": False, "error": "Phone and OTP are required"}, status=400)

    if otp_store.get(phone) == otp:
        return JsonResponse({"success": True, "message": "OTP verified successfully"})
    else:
        return JsonResponse({"success": False, "error": "Invalid OTP"}, status=400)


@api_view(["POST"])
def forgot_password_reset(request):
    phone = request.data.get("phone")
    new_password = request.data.get("newPassword")

    if not phone or not new_password:
        return JsonResponse({"success": False, "error": "Phone and new password are required"}, status=400)

    try:
        profile = UserProfile.objects.get(phone=phone)
        user = profile.user
        user.set_password(new_password)
        user.save()
        # Remove OTP after reset
        if phone in otp_store:
            del otp_store[phone]
        return JsonResponse({"success": True, "message": "Password reset successful"})
    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "error": "User not found"}, status=404)
    
load_dotenv()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@api_view(["GET"])
def get_weather_forecast(request):
    city = request.GET.get("city")
    if not OPENWEATHER_API_KEY:
        return Response({"error": "API key not configured"}, status=500)

    try:
        # Step 1: Current weather
        current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        current_data = requests.get(current_url).json()

        if "cod" in current_data and current_data["cod"] != 200:
            return Response({"error": current_data.get("message", "Error fetching current weather")}, status=400)

        # Step 2: 5-day / 3-hour forecast
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        forecast_data = requests.get(forecast_url).json()

        if "list" not in forecast_data:
            return Response({"error": forecast_data.get("message", "Error fetching forecast")}, status=400)

        # Step 3: Group into daily summary
        daily_forecast = {}
        for entry in forecast_data["list"]:
            # Convert timestamp → YYYY-MM-DD string
            date_str = datetime.fromtimestamp(entry["dt"]).strftime("%Y-%m-%d")

            if date_str not in daily_forecast:
                daily_forecast[date_str] = {
                    "min": float(entry["main"]["temp_min"]),
                    "max": float(entry["main"]["temp_max"]),
                    "condition": entry["weather"][0]["description"].title(),
                    "icon": entry["weather"][0]["icon"],
                    "humidity": int(entry["main"]["humidity"]),
                    "windSpeed": float(entry["wind"]["speed"])
                }
            else:
                daily_forecast[date_str]["min"] = min(daily_forecast[date_str]["min"], float(entry["main"]["temp_min"]))
                daily_forecast[date_str]["max"] = max(daily_forecast[date_str]["max"], float(entry["main"]["temp_max"]))

        # Take only 5 days
        forecast_list = []
        for date, info in list(daily_forecast.items())[:5]:
            forecast_list.append({
                "date": date,
                **info
            })

        # Final response
        return Response({
            "city": city,
            "current": {
                "temp": float(current_data["main"]["temp"]),
                "condition": current_data["weather"][0]["description"].title(),
                "humidity": int(current_data["main"]["humidity"]),
                "windSpeed": float(current_data["wind"]["speed"]),
                "icon": current_data["weather"][0]["icon"]
            },
            "forecast": forecast_list
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def recommend_fertilizer(request):
    try:
        payload = request.data if hasattr(request, "data") else json.loads(request.body or "{}")
        result = predict_from_payload(payload)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def recommend_crop(request):
    try:
        payload = request.data if hasattr(request, "data") else json.loads(request.body or "{}")
        result = predict_crop_from_payload(payload)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(["GET"])
def scrape_schemes(request):
    url = "https://www.india.gov.in/topics/agriculture"
    headers = {"User-Agent": "Mozilla/5.0"}  # helps avoid blocking
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    schemes = []
    for idx, item in enumerate(soup.select(".views-row"), start=1):
        # Title + Link
        title_tag = item.select_one(".views-field-title a")
        if not title_tag:   # skip if no title
            continue

        title = title_tag.get_text(strip=True)
        link = "https://www.india.gov.in" + title_tag.get("href", "#")

        # Description (optional)
        desc_tag = item.select_one(".views-field-body p")
        desc = desc_tag.get_text(strip=True) if desc_tag else "Description not available"

        schemes.append({
            "id": idx,
            "title": title,
            "shortDescription": desc[:150] + ("..." if len(desc) > 150 else ""),
            "fullDescription": desc,
            "officialLink": link,
            "department": "Government of India",
            "category": "Agriculture",
            "state": "All India",
            "eligibility": "Check official link for details",
            "benefits": ["Details available on official site"],
            "howToApply": "Visit official website",
            "helpline": "N/A",
            "email": "N/A",
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
        })

    return Response(schemes)