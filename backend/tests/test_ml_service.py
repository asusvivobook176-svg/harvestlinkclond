import pytest
import os
import sys

# Add the project root to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.ml_service import get_ml_service

@pytest.fixture
def ml():
    return get_ml_service()

def test_crop_recommendations(ml):
    """Test crop recommendation model"""
    farm_data = {
        'land_size_acres': 2.5,
        'soil_type': 'Loamy',
        'climate_zone': 'Tropical',
        'water_availability': 'High',
        'temperature_avg': 28,
        'rainfall_mm': 1200
    }
    result = ml.get_crop_recommendations(farm_data)
    assert result['success'] == True
    assert 'recommendations' in result
    assert len(result['recommendations']) > 0
    print("✅ Crop recommendations test PASSED")

def test_demand_forecast(ml):
    """Test demand forecast model"""
    forecast_data = {
        'crop_name': 'Tomato',
        'current_price': 30,
        'supply': 1000,
        'market_location': 'Chennai'
    }
    result = ml.forecast_demand(forecast_data)
    assert result['success'] == True
    assert 'forecast' in result
    assert len(result['forecast']) == 30
    print("✅ Demand forecast test PASSED")

def test_price_crash_risk(ml):
    """Test price crash risk model"""
    price_data = {
        'crop_name': 'Tomato',
        'current_price': 30,
        'prev_week_price': 40,
        'supply': 1200,
        'demand': 800,
        'district': 'Salem'
    }
    result = ml.detect_price_crash_risk(price_data)
    assert result['success'] == True
    assert 'risk_level' in result
    assert 'crash_probability' in result
    print("✅ Price crash risk test PASSED")

def test_spoilage_prediction(ml):
    """Test spoilage prediction model"""
    spoilage_data = {
        'crop_name': 'Tomato',
        'harvest_date': '2025-02-25',
        'transport_hours': 4,
        'storage_temp': 28,
        'humidity': 65,
        'storage_method': 'Open Air'
    }
    result = ml.predict_spoilage_risk(spoilage_data)
    assert result['success'] == True
    assert result['shelf_life_days'] > 0
    assert 'risk_level' in result
    print("✅ Spoilage prediction test PASSED")
