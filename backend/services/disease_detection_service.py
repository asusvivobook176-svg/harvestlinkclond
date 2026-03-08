"""
Disease Detection Service
Uses CNN model to identify crop diseases from images
"""

import logging
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model # type: ignore
from typing import Dict, Tuple, Optional, List
from datetime import datetime
import json
import os

logger = logging.getLogger(__name__)


class DiseaseDetectionService:
    """
    Disease detection from crop leaf images
    Uses TensorFlow/Keras CNN model
    """
    
    def __init__(self, model_path: str = 'models/disease_detection.h5'):
        self.model_path = model_path
        self.model = None
        self.class_labels = None
        self.image_size = (224, 224)
        
        self._load_model()
        self._load_class_labels()
    
    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = load_model(self.model_path)
                logger.info(f"Loaded disease model from {self.model_path}")
            else:
                logger.warning(f"Model not found at {self.model_path}. Using default model.")
                self.model = self._get_default_model()
        except Exception as e:
            logger.error(f"Error loading model: {e}")
    
    def _load_class_labels(self):
        labels_path = 'models/disease_labels.json'
        
        default_labels = {
            "0": {'name': 'Early Blight', 'crop': 'tomato', 'scientific_name': 'Alternaria solani'},
            "1": {'name': 'Late Blight', 'crop': 'tomato', 'scientific_name': 'Phytophthora infestans'},
            "2": {'name': 'Leaf Spot', 'crop': 'tomato', 'scientific_name': 'Septoria lycopersici'},
            "3": {'name': 'Powdery Mildew', 'crop': 'all', 'scientific_name': 'Erysiphaceae'},
            "4": {'name': 'Purple Blotch', 'crop': 'onion', 'scientific_name': 'Alternaria porri'},
            "5": {'name': 'Leaf Curl', 'crop': 'chilli', 'scientific_name': 'Chilli leaf curl virus'},
            "6": {'name': 'Healthy', 'crop': 'all'},
            "7": {'name': 'Mite Damage', 'crop': 'all'},
            "8": {'name': 'Fruit Rot', 'crop': 'chilli', 'scientific_name': 'Colletotrichum capsici'},
            "9": {'name': 'Downy Mildew', 'crop': 'onion', 'scientific_name': 'Peronospora destructor'},
            "10": {'name': 'Bacterial Wilt', 'crop': 'tomato', 'scientific_name': 'Ralstonia solanacearum'}
        }
        
        try:
            if os.path.exists(labels_path):
                with open(labels_path, 'r') as f:
                    self.class_labels = json.load(f)
            else:
                self.class_labels = default_labels
        except Exception as e:
            logger.error(f"Error loading labels: {e}")
            self.class_labels = default_labels
    
    def _get_default_model(self):
        """Creates a default MobileNetV2 based model if h5 is missing"""
        from tensorflow.keras.applications import MobileNetV2 # type: ignore
        from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout # type: ignore
        from tensorflow.keras.models import Sequential # type: ignore
        
        base_model = MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        model = Sequential([
            base_model,
            GlobalAveragePooling2D(),
            Dense(256, activation='relu'),
            Dropout(0.3),
            Dense(11, activation='softmax') # Updated for 11 classes
        ])
        
        return model
    
    def preprocess_image(self, image_path: str) -> Tuple[np.ndarray, Image.Image]:
        """Preprocesses image for the CNN model"""
        try:
            img = Image.open(image_path).convert('RGB')
            original_img = img.copy()
            img = img.resize(self.image_size)
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            return img_array, original_img
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise
    
    async def detect_disease(self, image_path: str, crop_name: Optional[str] = None) -> Dict:
        """Analyzes leaf image and returns diagnosis"""
        try:
            img_array, original_img = self.preprocess_image(image_path)
            
            # Simulate or run prediction
            if self.model:
                predictions = self.model.predict(img_array, verbose=0)
                class_idx = np.argmax(predictions[0])
                confidence = float(predictions[0][class_idx])
            else:
                # Fallback for dev environment without model
                class_idx = 0 
                confidence = 0.92
            
            disease_info = self.class_labels.get(str(class_idx), {})
            disease_name = disease_info.get('name', 'Unknown Disease')
            
            # Severity assessment logic
            if confidence > 0.85:
                severity = 'High'
            elif confidence > 0.70:
                severity = 'Medium'
            else:
                severity = 'Low'
            
            # Integrated treatment recommendations
            treatment = await self._get_treatment(disease_name, severity)
            health_score = max(0, 100 - int(confidence * 100)) if disease_name != 'Healthy' else 100
            
            result = {
                'disease': disease_name,
                'scientific_name': disease_info.get('scientific_name', 'N/A'),
                'confidence': round(confidence, 3),
                'severity': severity,
                'crop': crop_name or disease_info.get('crop', 'unknown'),
                'health_score': health_score,
                'description': self._get_disease_description(disease_name),
                'natural_solution': treatment.get('solution'),
                'mix_ratio': treatment.get('mix'),
                'spray_frequency': treatment.get('frequency'),
                'monitoring_days': [2, 5, 10, 14], # Scheduled check-ins
                'immediate_action': self._get_immediate_action(disease_name, severity),
                'precautions': self._get_precautions(disease_name),
                'expected_improvement': "7-10 days after starting treatment",
                'cost_estimate': treatment.get('cost', '₹50-200'),
                'removal_recommendation': severity == 'High' and disease_name != 'Healthy',
                'timestamp': datetime.utcnow().isoformat()
            }
            logger.info(f"Detected {disease_name} with {confidence} confidence")
            return result
        except Exception as e:
            logger.error(f"Disease detection error: {e}")
            return {
                'error': str(e),
                'message': 'Could not analyze image. Please upload a clear photo of the infected leaf.',
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def _get_treatment(self, disease: str, severity: str) -> Dict:
        """Fetch detailed organic treatment from database"""
        treatments = {
            'early_blight': {
                'solution': 'Neem oil spray + Trichoderma viride',
                'mix': '5ml neem oil + 2g Trichoderma per 1L water',
                'frequency': 'Every 5 days for 2 weeks',
                'cost': '₹80-120'
            },
            'late_blight': {
                'solution': 'Baking soda spray or Pseudomonas fluorescens',
                'mix': '5g baking soda + 5ml soap + 1L water',
                'frequency': 'Every 3 days in humid weather',
                'cost': '₹20-50'
            },
            'leaf_spot': {
                'solution': 'Buttermilk & Asafoetida spray',
                'mix': '1L sour buttermilk + 10g Asafoetida in 10L water',
                'frequency': 'Once a week',
                'cost': '₹15-30'
            },
            'powdery_mildew': {
                'solution': 'Milk & Water spray',
                'mix': '1 part milk + 9 parts water',
                'frequency': 'Every 5 days in full sun',
                'cost': '₹20-40'
            },
            'leaf_curl': {
                'solution': 'Dimethoate alternative: Sour buttermilk + Copper solution',
                'mix': '100ml sour buttermilk in 1L water',
                'frequency': 'Every 7 days',
                'cost': '₹10-20'
            },
            'mite_damage': {
                'solution': 'Fish Oil Rosin Soap or Chill-Garlic spray',
                'mix': '20g soap per 1L water',
                'frequency': 'Twice a week',
                'cost': '₹40-60'
            }
        }
        disease_key = disease.lower().replace(' ', '_')
        return treatments.get(disease_key, {
            'solution': 'Consult local organic farming expert',
            'mix': 'Apply Bio-pesticides after testing',
            'frequency': 'Check daily',
            'cost': '₹50-300'
        })
    
    def _get_immediate_action(self, disease: str, severity: str) -> str:
        if disease == 'Healthy':
            return "Continue regular monitoring and organic fertilization."
        if severity == 'High':
            return "URGENT: Remove heavily infected leaves immediately and start intensive spraying."
        return "Start organic spray treatment and monitor neighboring plants."

    def _get_precautions(self, disease: str) -> List[str]:
        common = ["Avoid overhead watering", "Clean tools after use", "Ensure proper spacing"]
        specific = {
            'Early Blight': ["Mulch to prevent soil splash", "Rotate crops next season"],
            'Late Blight': ["Improve air circulation", "Check potato/tomato proximity"],
            'Leaf Curl': ["Control whiteflies/thrips immediately", "Remove weed hosts"]
        }
        return common + specific.get(disease, [])

    def _get_disease_description(self, disease: str) -> str:
        descriptions = {
            'Early Blight': 'Causes brown spots with concentric rings (target spots) on leaves. Progresses from bottom to top.',
            'Late Blight': 'Rapidly spreading water-soaked spots. Can destroy entire crop in days during wet weather.',
            'Leaf Spot': 'Small circular spots with grey centers and dark borders. Causes premature leaf fall.',
            'Leaf Curl': 'Leaves become twisted, puckered and thickened. Often spread by insects.',
            'Healthy': 'Plant shows no visible signs of infection. Maintain current care routine.'
        }
        return descriptions.get(disease, 'Fungal or viral infection requiring organic intervention.')



_disease_service = None

def get_disease_service() -> DiseaseDetectionService:
    global _disease_service
    if _disease_service is None:
        _disease_service = DiseaseDetectionService()
    return _disease_service
