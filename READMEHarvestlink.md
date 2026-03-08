# 🌾 HarvestLink - Smart Agriculture Platform

HarvestLink is an AI-powered platform designed for Tamil Nadu farmers and shop owners. It reduces food wastage and increases profit by predicting crop demand, alerting users of price crashes, and recommending the best crops to grow.

## 🚀 Features

- **Crop AI Recommender**: Personalized suggestions based on land and soil.
- **Demand Forecasting**: Predicts market demand and future prices.
- **Price Crash Alerts**: High-recall early warnings for oversupply.
- **Spoilage Risk Manager**: Predicts vegetable shelf life based on transport and weather.
- **Weather Integration**: Automatic weather data fetching via OpenWeatherMap.

## 🛠️ Tech Stack

- **ML**: scikit-learn, Pandas, NumPy, Joblib, Imbalanced-learn.
- **Backend**: Python Flask, SQLite, JWT, Flask-CORS.
- **Frontend**: HTML5, Tailwind CSS, Vanilla JS, Chart.js.

## 📦 Setup Instructions (Windows)

### 1. Prerequisites

- Python 3.10+ installed.
- VS Code (Recommended).

### 2. Environment Setup

```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Database Initialization

```powershell
python database/init_db.py
```

### 4. Running the Backend

```powershell
# In one terminal
python backend/app.py
```

### 5. Running the Frontend

- Open `frontend/index.html` directly in your browser or use a VS Code "Live Server".

## 📂 Folder Structure

```
HarvestLink/
├── backend/        # Flask API and Routes
├── data/           # CSV Synthetic Datasets
├── database/       # SQLite DB and Schema
├── harvestlink-web/    # React App
├── ml/             # ML Training and Pipeline
└── models/         # Trained .pkl Files
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```
SECRET_KEY=your_secret_key
WEATHER_API_KEY=YOUR_OPENWEATHERMAP_KEY
```

## 🤖 Machine Learning Models

HarvestLink includes 4 pre-trained ML models:

1. **Crop Recommender**: Suggests optimal crops based on soil type, climate, and season.
2. **Demand Forecaster**: Predicts market demand trends for the next 30 days.
3. **Price Crash Detector**: Alerts farmers of potential price drops with high recall.
4. **Spoilage Risk Manager**: Estimates vegetable shelf life during transport and storage.

## 📡 API Endpoints

### Authentication Routes

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login with JWT
- `POST /auth/logout` - User logout

### Crop & Prediction Routes

- `GET /crops/recommend` - Get crop recommendations
- `POST /predict/demand` - Predict market demand
- `POST /predict/price-crash` - Check price crash alerts
- `POST /predict/spoilage` - Predict spoilage risk

### Market & Analytics Routes

- `GET /market/prices` - Get current market prices
- `GET /analytics/dashboard` - User analytics dashboard
- `GET /weather` - Get weather data

_See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed endpoint information._

## 🚀 Quick Start

1. **Clone the repository** (if applicable)
2. **Set up environment**: Follow Setup Instructions above
3. **Access the application**:
   - Backend API: `http://localhost:5000`
   - Frontend: Open `frontend/index.html` in browser
4. **Login or Register** with your credentials
5. **Explore features**: Check crop recommendations, market prices, and alerts

## ⚙️ Configuration

- **Database**: SQLite (automatically initialized in `backend/db.sqlite3`)
- **ML Models**: Located in `models/` directory (auto-loaded on startup)
- **Logs**: Check `logs/` directory for application logs
- **Data**: Sample datasets in `data/` for training and testing

## 🐛 Troubleshooting

### Virtual Environment Issues

```powershell
# If activation fails, try:
python -m venv .venv --upgrade-deps
.venv\Scripts\activate
```

### Database Errors

```powershell
# Reset database:
python database/init_db.py
```

### Port Already in Use

- Change port in `backend/config.py` or run:

```powershell
python app.py --port 5001
```

### Missing Dependencies

```powershell
pip install --upgrade -r backend/requirements.txt
```

## 📊 Performance & Analytics

- Real-time weather data integration
- ML model prediction latency: < 100ms
- SQLite database optimized for read-heavy operations
- Frontend caching for offline access

## 👥 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

## 📧 Support & Contact

- **Issues**: Report bugs via GitHub Issues
- **Suggestions**: Open a GitHub Discussion
- **Email**: support@harvestlink.in
- **Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🎯 Project Status

✅ Core Features: Complete  
✅ ML Models: Trained & Optimized  
🔄 Mobile App: In Development  
🔄 Advanced Analytics: Coming Soon

---

Built with ❤️ for Tamil Nadu Farmers.  
_Empowering farmers with AI-driven insights._
