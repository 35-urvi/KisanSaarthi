from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("forgot-password/send-otp/", views.forgot_password_send_otp),
    path("forgot-password/verify-otp/", views.forgot_password_verify_otp),
    path("forgot-password/reset/", views.forgot_password_reset),
    path("profile/", views.get_profile, name="get_profile"),
    path("profile/update/", views.update_profile, name="update_profile"),
    path("profile/password/", views.update_password, name="update_password"),
    path("profile/download/", views.download_profile_data, name="download_profile_data"),
    path("profile/delete/", views.delete_account, name="delete_account"),
    path("login/", views.login, name="login"),
    path("weather/", views.get_weather_forecast, name="get_weather_forecast"),
    path("fertilizer/recommend/", views.recommend_fertilizer, name="recommend_fertilizer"),
    path("crop/recommend/", views.recommend_crop, name="recommend_crop"),
    path("scrape-schemes/", views.scrape_schemes, name="scrape_schemes"),
    path("yield/train/", views.train_yield_model, name="train_yield_model"),
    path("yield/predict/", views.predict_yield_endpoint, name="predict_yield"),
    path("disease-detect/", views.disease_detect, name="disease_detect"),
]
