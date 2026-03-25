import requests
import json

BASE_URL = "http://localhost:5000/api/analytics"

def test_farmer_analytics():
    print("\n--- Testing Farmer Analytics ---")
    response = requests.get(f"{BASE_URL}/farmer/1")
    if response.status_code == 200:
        data = response.json()
        print("Success! Keys found:", list(data.keys()))
        print("KPIs:", data['kpis'])
        print("Trends count (daily):", len(data['revenue_trends']['daily']))
    else:
        print(f"Failed with status: {response.status_code}")
        print(response.text)

def test_shop_analytics():
    print("\n--- Testing Shop Analytics ---")
    response = requests.get(f"{BASE_URL}/shop/1")
    if response.status_code == 200:
        data = response.json()
        print("Success! Keys found:", list(data.keys()))
        print("KPIs:", data['kpis'])
    else:
        print(f"Failed with status: {response.status_code}")

def test_admin_analytics():
    print("\n--- Testing Admin Analytics ---")
    response = requests.get(f"{BASE_URL}/admin")
    if response.status_code == 200:
        data = response.json()
        print("Success! Keys found:", list(data.keys()))
        print("System Health:", data['system_health'])
    else:
        print(f"Failed with status: {response.status_code}")

if __name__ == "__main__":
    try:
        test_farmer_analytics()
        test_shop_analytics()
        test_admin_analytics()
    except Exception as e:
        print(f"Error during testing: {e}")
