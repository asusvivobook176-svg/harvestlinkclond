from locust import HttpUser, task, between, SequentialTaskSet
import random

class UserBehavior(SequentialTaskSet):
    def on_start(self):
        """Setup: Register and Login"""
        self.email = f"user_{random.randint(1000, 9999)}@test.com"
        self.password = "TestPass123!"
        
        # Register
        self.client.post("/api/auth/register", json={
            "email": self.email,
            "password": self.password,
            "role": "farmer",
            "full_name": "Load Test User"
        })
        
        # Login
        response = self.client.post("/api/auth/login", json={
            "email": self.email,
            "password": self.password
        })
        if response.status_code == 200:
            self.token = response.json().get("token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.token = None

    @task(3)
    def get_crop_recommendations(self):
        if not self.token: return
        self.client.post("/api/predict/crop", json={
            "land_size_acres": 2.5,
            "soil_type": "loamy",
            "climate_zone": "tropical",
            "water_availability": "high"
        }, headers=self.headers)

    @task(2)
    def browse_market(self):
        if not self.token: return
        self.client.get("/api/market/listings", headers=self.headers)

    @task(1)
    def check_health(self):
        self.client.get("/api/health")

class HarvestLinkUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)
    host = "http://localhost:5000"
