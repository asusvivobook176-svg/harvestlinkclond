import pytest
import os
import sys

# Add root directory to path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from backend import db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

class TestCropRecommendationFlow:
    def test_full_crop_recommendation_workflow(self, client):
        """Test: Register -> Post farm data -> Get recommendation"""
        
        # Step 1: Register user
        reg_response = client.post('/api/auth/register', json={
            'email': 'farmer@test.com',
            'password': 'TestPass123!',
            'role': 'farmer',
            'full_name': 'Test Farmer'
        })
        assert reg_response.status_code in [200, 201]
        
        # Step 2: Login
        login_response = client.post('/api/auth/login', json={
            'email': 'farmer@test.com',
            'password': 'TestPass123!'
        })
        assert login_response.status_code == 200
        token = login_response.json.get('token')
        assert token is not None
        
        # Step 3: Get crop recommendation
        headers = {'Authorization': f'Bearer {token}'}
        pred_response = client.post('/api/predict/crop', 
            json={
                'land_size_acres': 2.5,
                'soil_type': 'loamy',
                'climate_zone': 'tropical',
                'water_availability': 'high',
                'temperature_avg': 28,
                'rainfall_mm': 1200
            },
            headers=headers
        )
        assert pred_response.status_code == 200
        assert 'recommendation' in pred_response.json or 'recommendations' in pred_response.json

class TestMarketplaceFlow:
    def test_farmer_post_listing(self, client):
        """Test: Farmer posts crop listing"""
        
        # Register and Login
        client.post('/api/auth/register', json={
            'email': 'farmer2@test.com',
            'password': 'TestPass123!',
            'role': 'farmer'
        })
        login_resp = client.post('/api/auth/login', json={
            'email': 'farmer2@test.com',
            'password': 'TestPass123!'
        })
        token = login_resp.json['token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # Farmer posts listing
        listing_response = client.post('/api/market/listings', 
            json={
                'crop_name': 'Tomato',
                'quantity': 100,
                'price_per_unit': 25,
                'category': 'Vegetable'
            },
            headers=headers
        )
        assert listing_response.status_code in [200, 201]
        
        # Browse listings
        browse_response = client.get('/api/market/listings', headers=headers)
        assert browse_response.status_code == 200
        listings = browse_response.json.get('listings', browse_response.json)
        # Handle cases where listings might be a list directly or in a dict
        if isinstance(listings, list):
            assert any(item.get('crop_name') == 'Tomato' for item in listings)
        else:
             assert any(item.get('crop_name') == 'Tomato' for item in listings.get('listings', []))

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
