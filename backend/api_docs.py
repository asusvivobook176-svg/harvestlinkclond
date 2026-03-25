from flask_restx import Api, Resource, fields
from flask import Blueprint

api_bp = Blueprint('api_docs', __name__)
api = Api(api_bp, version='1.0', title='HarvestLink API',
          description='AI-powered agricultural platform API documentation',
          doc='/')

# Define models for documentation
crop_model = api.model('CropRecommendation', {
    'land_size_acres': fields.Float(required=True, description='Size of the land in acres'),
    'soil_type': fields.String(required=True, description='Type of soil (loamy, clay, sandy, silty)'),
    'climate_zone': fields.String(required=True, description='Climate zone of the farm'),
    'water_availability': fields.String(description='Water availability level'),
    'temperature_avg': fields.Float(description='Average temperature'),
    'rainfall_mm': fields.Float(description='Annual rainfall in mm')
})

auth_model = api.model('Login', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})

# Create namespaces
ns_ai = api.namespace('ai', description='AI & Prediction operations')
ns_auth = api.namespace('auth', description='Authentication operations')
ns_market = api.namespace('market', description='Marketplace operations')

@ns_ai.route('/crop-recommendations')
class CropRecommendations(Resource):
    @ns_ai.expect(crop_model)
    def post(self):
        """Get crop recommendations based on farm data"""
        return {"message": "Success", "recommendations": []}

@ns_auth.route('/login')
class Login(Resource):
    @ns_auth.expect(auth_model)
    def post(self):
        """Authenticate user and return JWT token"""
        return {"token": "sample-token"}

@ns_market.route('/listings')
class Listings(Resource):
    def get(self):
        """List all available crop listings"""
        return {"listings": []}
