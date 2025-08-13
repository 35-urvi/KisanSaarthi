from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("forgot-password/send-otp/", views.forgot_password_send_otp),
    path("forgot-password/verify-otp/", views.forgot_password_verify_otp),
    path("forgot-password/reset/", views.forgot_password_reset),
    path("login/", views.login, name="login")

]
