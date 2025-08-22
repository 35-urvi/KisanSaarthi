# 🌾 KisanSaarthi - Smart Agriculture Platform

**KisanSaarthi** is a comprehensive digital agriculture platform designed to empower farmers with AI-driven insights, real-time weather data, disease detection, and community support. Built with modern web technologies, it provides farmers with intelligent crop recommendations, yield predictions, and access to government schemes.

## 🚀 Features

### 🤖 AI-Powered Agriculture Tools
- **Smart Crop Recommendation**: ML-based crop suggestions based on soil NPK values, weather conditions, and environmental factors
- **Disease Detection**: Upload crop images for instant disease identification using computer vision
- **Fertilizer Guide**: Intelligent fertilizer recommendations based on crop type and soil conditions
- **Yield Prediction**: Predict crop yields based on historical data and current conditions

### 🌤️ Weather & Environmental
- **Real-time Weather**: Current weather conditions and 5-day forecasts
- **Location-based Data**: GPS-enabled weather data for precise local conditions
- **Climate Insights**: Weather patterns to help with farming decisions

### 🏛️ Government & Community
- **Government Schemes**: Automated scraping and display of latest agricultural schemes
- **Community Forum**: Platform for farmers to ask questions, share experiences, and get answers
- **Knowledge Sharing**: Collaborative learning environment for agricultural best practices


### 👤 User Management
- **Secure Authentication**: JWT-based authentication with OTP verification
- **User Profiles**: Comprehensive farmer profiles with location, farm size, and experience
- **Phone Verification**: SMS-based OTP verification for account security

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.2.4 with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT with Simple JWT
- **Machine Learning**: 
  - scikit-learn for crop and fertilizer recommendations
  - Hugging Face Transformers for disease detection
  - pandas & numpy for data processing
- **External APIs**: 
  - OpenWeatherMap for weather data
  - Hugging Face for disease detection model
- **Web Scraping**: BeautifulSoup for government schemes

### Frontend
- **Framework**: React 19.1.0 with Vite
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **Routing**: React Router DOM 7.8.0
- **HTTP Client**: Axios 1.10.0
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Machine Learning Models
- **Crop Recommendation**: Random Forest Classifier trained on soil and weather data
- **Fertilizer Prediction**: ML model for NPK-based fertilizer recommendations
- **Disease Detection**: Vision Transformer (ViT) model from Hugging Face
- **Yield Prediction**: Regression model for crop yield forecasting

## 📁 Project Structure

```
KisanSaarthi/
├── backend/
│   ├── kisan_saarthi/          # Django project settings
│   ├── api/                    # Main API application
│   │   ├── ml/                 # Machine learning models
│   │   │   ├── crop_model.py   # Crop recommendation model
│   │   │   ├── fertilizer_model.py # Fertilizer prediction model
│   │   │   ├── yield_model.py  # Yield prediction model
│   │   │   └── *.joblib        # Trained model files
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API endpoints
│   │   └── urls.py             # URL routing
│   ├── data/                   # Training datasets
│   ├── requirements.txt        # Python dependencies
│   └── manage.py               # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── api/                # API configuration
│   │   └── assets/             # Static assets
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KisanSaarthi/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp env_sample.txt .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   DB_NAME=kisan_saarthi
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   HF_API_TOKEN=your_huggingface_token
   OPENWEATHER_API_KEY=your_openweather_key
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run the server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 🔧 API Endpoints

### Authentication
- `POST /api/signup/` - User registration with OTP
- `POST /api/login/` - User login
- `POST /api/verify-otp/` - OTP verification

### ML Services
- `POST /api/crop/recommend/` - Get crop recommendations
- `POST /api/fertilizer/recommend/` - Get fertilizer suggestions
- `POST /api/yield/predict/` - Predict crop yield
- `POST /api/disease-detect/` - Detect plant diseases

### Data Services
- `GET /api/weather/` - Weather data by city or coordinates
- `GET /api/scrape-schemes/` - Government agricultural schemes

## 🤖 Machine Learning Models

### Crop Recommendation Model
- **Algorithm**: Random Forest Classifier
- **Features**: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, Rainfall
- **Output**: Recommended crop with confidence score
- **Accuracy**: ~95% on test data

### Disease Detection Model
- **Model**: Vision Transformer (ViT) from Hugging Face
- **Model ID**: `wambugu71/crop_leaf_diseases_vit`
- **Input**: Crop leaf images
- **Output**: Disease classification with treatment recommendations

### Fertilizer Prediction Model
- **Features**: NPK values, crop type, soil conditions
- **Output**: Fertilizer type, dosage, and application method



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- Hugging Face for machine learning models
- Government of India for agricultural schemes data
- Open source community for various libraries and tools

