import requests
import time

BASE_URL = "http://127.0.0.1:5000/api"

def test_rate_limiting():
    print("Testing Rate Limiting on /auth/login...")
    for i in range(10):
        try:
            resp = requests.post(f"{BASE_URL}/auth/login", json={"email": "test@example.com", "password": "wrong"})
            print(f"Request {i+1}: {resp.status_code}")
            if resp.status_code == 429:
                print("SUCCESS: Rate limit hit!")
                return
        except Exception as e:
            print(f"Error: {e}")
            break
    print("FAILED: Did not hit rate limit within 10 requests.")

def test_sanitization():
    print("\nTesting Sanitization on /predict/crop...")
    bad_data = {
        "district": "Salem",
        "soil_type": "Clay <script>alert('xss')</script>",
        "water_availability": "High",
        "irrigation_type": "Borewell",
        "land_area": 1.0,
        "season": "Summer",
        "previous_crop": "Rice",
        "market_demand_level": "Medium"
    }
    try:
        # Note: We can't easily check the 'request.json_sanitized' from outside, 
        # but we can verify the API still works and doesn't crash on bad tags.
        # In a real test we'd check if the backend logged or stored the clean string.
        resp = requests.post(f"{BASE_URL}/predict/crop", json=bad_data)
        print(f"Sanitization Request Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_rate_limiting()
    test_sanitization()
