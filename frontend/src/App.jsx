import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/signup.jsx";
import ForgotPassward from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import CropRecommendation from "./pages/CropRecommendation.jsx";
import YieldPrediction from "./pages/YieldPrediction.jsx";
import DiseaseDetection from "./pages/DiseaseDetection.jsx";
import FertilizerGuide from "./pages/FertilizerGuide.jsx";
import Weather from "./pages/Weather.jsx";
import Marketplace from "./pages/MarketPlace.jsx";
import GovSchema from "./pages/GovSchemes.jsx";
import CommunityForum from "./pages/CommunityForum.jsx";
import Profile from "./pages/Profile.jsx";
// 9909533733

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassward />} />

         <Route path="/dashboard" element={<Home />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/yield-prediction" element={<YieldPrediction />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/fertilizer-guide" element={<FertilizerGuide />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/gov-schema" element={<GovSchema />} />
        <Route path="/community-forum" element={<CommunityForum />} />
        <Route path="/profile" element={<Profile />} />

        {/* Optional 404 */}
        <Route path="*" element={<Landing />} />

      </Routes>
    </Router>
  );
}

export default App;
