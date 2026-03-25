import requests
import json

BASE_URL = "http://localhost:5000/api/pilot"

def test_pilot_workflow():
    print("\n--- Testing Pilot Workflow ---")
    
    # 1. Get Participants
    print("1. Fetching participants...")
    p_resp = requests.get(f"{BASE_URL}/participants")
    if p_resp.status_code == 200:
        participants = p_resp.json()
        print(f"   Found {len(participants)} participants")
        if participants:
            p_id = participants[0]['id']
            print(f"   Testing training for participant {p_id}")
            
            # 2. Log Training
            t_resp = requests.post(f"{BASE_URL}/training", json={
                "farmer_id": p_id,
                "crop_advisor": True,
                "price_alerts": True,
                "spoilage_checker": True,
                "status": "completed",
                "duration": 60
            })
            if t_resp.status_code == 201:
                print("   Success: Training logged!")
            else:
                print(f"   Error: Training log failed {t_resp.status_code}")
    
    # 3. Get Stats
    print("3. Fetching pilot stats...")
    s_resp = requests.get(f"{BASE_URL}/stats")
    if s_resp.status_code == 200:
        stats = s_resp.json()
        print("   Stats:", json.dumps(stats, indent=2))
        print(f"   Adoption Rate: {stats.get('adoption_rate')}%")
        print(f"   Trained Farmers: {stats.get('trained_farmers')}")
    else:
        print(f"   Error: Stats fetch failed {s_resp.status_code}")

if __name__ == "__main__":
    try:
        test_pilot_workflow()
    except Exception as e:
        print(f"Error during verification: {e}")
