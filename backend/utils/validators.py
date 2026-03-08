from typing import Dict, Any, Tuple
import re

class InputValidator:
    @staticmethod
    def validate_email(email: str) -> bool:
        if not email:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, str]:
        if not password:
            return False, "Password is required"
        if len(password) < 8:
            return False, "Password must be at least 8 characters"
        if not any(char.isupper() for char in password):
            return False, "Password must contain uppercase letter"
        if not any(char.isdigit() for char in password):
            return False, "Password must contain digit"
        return True, "Valid"
    
    @staticmethod
    def validate_farm_data(data: Dict[str, Any]) -> Tuple[bool, str]:
        required = ['land_size_acres', 'soil_type', 'climate_zone']
        
        for field in required:
            if field not in data or data[field] is None:
                return False, f"Missing required field: {field}"
        
        try:
            land_size = float(data['land_size_acres'])
            if land_size <= 0:
                return False, "Land size must be a positive number"
        except (ValueError, TypeError):
            return False, "Land size must be a valid number"
        
        valid_soil_types = ['loamy', 'clay', 'sandy', 'silty']
        if str(data['soil_type']).lower() not in valid_soil_types:
            return False, f"Invalid soil type. Choose from: {valid_soil_types}"
        
        return True, "Valid"
    
    @staticmethod
    def validate_crop_listing(data: Dict[str, Any]) -> Tuple[bool, str]:
        required = ['crop_name', 'quantity', 'price_per_unit']
        
        for field in required:
            if field not in data or data[field] is None:
                return False, f"Missing required field: {field}"
        
        try:
            quantity = float(data['quantity'])
            if quantity <= 0:
                return False, "Quantity must be positive"
                
            price = float(data['price_per_unit'])
            if price <= 0:
                return False, "Price must be positive"
        except (ValueError, TypeError):
            return False, "Quantity and price must be valid numbers"
        
        if not str(data['crop_name']).strip():
            return False, "Crop name cannot be empty"
            
        return True, "Valid"
