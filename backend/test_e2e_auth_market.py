import requests
import json
import uuid

BASE_URL = "http://localhost:5000/api"

def test_e2e():
    print("--- Starting E2E Auth & Market Test ---")
    
    # 1. Register
    email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    reg_data = {
        "name": "Test Farmer",
        "email": email,
        "password": "password123",
        "role": "farmer"
    }
    print(f"1. Registering user: {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        if resp.status_code != 201:
            print(f"FAILED: Registration status {resp.status_code}")
            print(resp.text)
            return
        print("✓ Registration successful")
    except Exception as e:
        print(f"FAILED: Connection error {e}")
        return

    # 2. Login
    print("2. Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": "password123"})
    if resp.status_code != 200:
        print(f"FAILED: Login status {resp.status_code}")
        print(resp.text)
        return
        
    token = resp.json()['token']
    user_id = resp.json()['user']['id']
    print(f"✓ Login successful, token received. User ID: {user_id}")
    
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Marketplace: Create Listing
    print("3. Creating marketplace listing...")
    listing_data = {
        "farmer_id": user_id,
        "crop_name": "Tomato",
        "quantity": 100,
        "unit": "kg",
        "price_per_unit": 25,
        "location": "Chennai",
        "description": "Fresh organic tomatoes"
    }
    resp = requests.post(f"{BASE_URL}/market/listings", json=listing_data, headers=headers)
    if resp.status_code != 201:
        print(f"FAILED: Listing creation status {resp.status_code}")
        print(resp.text)
        return
    print("✓ Listing created successfully")

    # 4. Marketplace: Get Listings
    print("4. Fetching listings...")
    resp = requests.get(f"{BASE_URL}/market/listings")
    if resp.status_code != 200:
        print(f"FAILED: Fetch listings status {resp.status_code}")
        return
        
    listings = resp.json()
    if not any(l['crop_name'] == "Tomato" for l in listings):
        print("FAILED: Tomato listing NOT found in results")
        return
    print(f"✓ Verified Tomato listing in {len(listings)} results")

    # 5. ML: Price Alert Check
    print("5. Testing Price Alert Check...")
    alert_data = {
        "crop_name": "Tomato",
        "current_price": 30,
        "arrival_volume": 500,
        "is_festival_season": True
    }
    resp = requests.post(f"{BASE_URL}/ai/price-alert-check", json=alert_data, headers=headers)
    if resp.status_code != 200:
        print(f"FAILED: Price alert status {resp.status_code}")
        print(resp.text)
        return
        
    result = resp.json()
    print(f"✓ Price alert result: Risk={result['risk_level']}, Predicted Price={result['predicted_price']}")

    print("\n--- E2E Test Passed Successfully! ---")

if __name__ == "__main__":
    try:
        test_e2e()
    except Exception as e:
        print(f"❌ Test Failed: {e}")
        import traceback
        traceback.print_exc()
