"""
HarvestLink AI Agriculture Chatbot Service
Handles farmer & market user queries with ML model integration
Supports English & Tamil responses
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import json
from enum import Enum

import requests
from flask import current_app
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class QueryType(Enum):
    """Types of farmer queries"""
    CROP_RECOMMENDATION = "crop_recommendation"
    DISEASE_DIAGNOSIS = "disease_diagnosis"
    FERTILIZER_ADVICE = "fertilizer_advice"
    PEST_CONTROL = "pest_control"
    IRRIGATION = "irrigation"
    MARKET_PRICE = "market_price"
    DEMAND_FORECAST = "demand_forecast"
    PRICE_CRASH_ALERT = "price_crash_alert"
    SOIL_PREPARATION = "soil_preparation"
    SEASONAL_ADVICE = "seasonal_advice"
    GENERAL_QUESTION = "general_question"


class ChatbotService:
    """
    AI-powered agriculture chatbot for HarvestLink
    
    Capabilities:
    - Answer agriculture questions
    - Integrate with ML models (crop, price, demand)
    - Provide disease diagnosis advice
    - Recommend natural fertilizers
    - Give seasonal guidance
    - Support Tamil & English
    """
    
    def __init__(self):
        """Initialize chatbot service"""
        # Delaying initialization until necessary or grabbing it safely
        self.api_key = None
        self.knowledge_base = self._load_knowledge_base()
        self.crop_data = self._load_crop_data()
        self.fertilizer_db = self._load_fertilizer_database()
        
    def _initialize_api(self):
        if not self.api_key:
            self.api_key = current_app.config.get('OPENAI_API_KEY')
            if self.api_key:
                # Use AsyncOpenAI client
                self.openai_client = AsyncOpenAI(api_key=self.api_key)

    def _load_knowledge_base(self) -> Dict:
        """Load agriculture knowledge base"""
        return {
            'crops': {
                'tomato': {
                    'season': 'year-round',
                    'water_needs': 'high',
                    'soil_type': 'loamy',
                    'common_diseases': ['early_blight', 'late_blight', 'leaf_spot', 'bacterial_wilt'],
                    'natural_fertilizers': ['neem', 'panchagavya', 'compost', 'eggshell_powder']
                },
                'onion': {
                    'season': 'october-february',
                    'water_needs': 'medium',
                    'soil_type': 'well-drained',
                    'common_diseases': ['purple_blotch', 'pink_root', 'downy_mildew'],
                    'natural_fertilizers': ['vermicompost', 'bone_meal', 'wood_ash']
                },
                'potato': {
                    'season': 'september-february',
                    'water_needs': 'medium',
                    'soil_type': 'loamy',
                    'common_diseases': ['late_blight', 'early_blight', 'black_scurf'],
                    'natural_fertilizers': ['cow_dung', 'panchagavya', 'neem', 'green_manure']
                },
                'chilli': {
                    'season': 'year-round',
                    'water_needs': 'medium',
                    'soil_type': 'well-drained',
                    'common_diseases': ['leaf_spot', 'fruit_rot', 'mite', 'leaf_curl'],
                    'natural_fertilizers': ['neem_oil', 'wood_ash', 'compost', 'fish_amino_acid']
                },
                'brinjal': {
                    'season': 'year-round',
                    'water_needs': 'medium',
                    'soil_type': 'loamy',
                    'common_diseases': ['fruit_borer', 'wilt', 'little_leaf'],
                    'natural_fertilizers': ['vermicompost', 'panchagavya', 'neem_cake']
                }
            },
            'natural_treatments': {
                'early_blight': {
                    'description': 'Brown spots with concentric rings on leaves',
                    'solution': 'Neem oil spray',
                    'mix': '5ml neem oil + 1L water + 5ml soap solution',
                    'frequency': 'Every 5 days for 2 weeks',
                    'severity_response': {
                        'low': 'Monitor and spray as needed',
                        'medium': 'Start spraying immediately',
                        'high': 'Remove infected leaves + intensive spray'
                    },
                    'cost': '₹50-100'
                },
                'late_blight': {
                    'description': 'Water-soaked spots on leaves, white fungus on undersides',
                    'solution': 'Baking soda spray',
                    'mix': '1 tbsp baking soda + 1L water + few drops soap',
                    'frequency': 'Every 3-4 days',
                    'severity_response': {
                        'low': 'Reduce irrigation, improve drainage',
                        'medium': 'Remove infected parts, spray regularly',
                        'high': 'Isolate plants, daily spraying, remove infected leaves'
                    },
                    'cost': '₹10-20'
                },
                'leaf_spot': {
                    'description': 'Circular spots with yellow halo on leaves',
                    'solution': 'Buttermilk spray',
                    'mix': '1 cup buttermilk + 10 cups water',
                    'frequency': 'Every 7 days',
                    'severity_response': {
                        'low': 'Monitor closely',
                        'medium': 'Start spraying every 7 days',
                        'high': 'Daily spray, remove affected leaves'
                    },
                    'cost': '₹5-10'
                },
                'powdery_mildew': {
                    'description': 'White powder coating on leaves and stems',
                    'solution': 'Milk spray',
                    'mix': '1 cup milk + 9 cups water',
                    'frequency': 'Every 5-7 days',
                    'severity_response': {
                        'low': 'Improve air circulation',
                        'medium': 'Weekly spraying',
                        'high': 'Daily spraying, remove heavily affected leaves'
                    },
                    'cost': '₹20-30'
                },
                'fruit_rot': {
                    'description': 'Sunken circular spots on fruit',
                    'solution': 'Garlic & Ginger spray',
                    'mix': '50g garlic + 50g ginger blended in 1L water',
                    'frequency': 'Every 4-5 days',
                    'severity_response': {
                        'low': 'Remove affected fruit',
                        'medium': 'Spray and remove affected parts',
                        'high': 'Intensive spraying + soil treatment'
                    },
                    'cost': '₹40-60'
                }
            }
        }
    
    def _load_crop_data(self) -> Dict:
        """Load crop-specific information"""
        return {
            'tamil_nadu_crops': [
                'tomato', 'onion', 'potato', 'chilli', 'brinjal', 'sugarcane',
                'rice', 'cotton', 'coconut', 'groundnut', 'turmeric', 'coriander',
                'banana', 'mango', 'jasmine', 'marigold'
            ],
            'seasonal_crops': {
                'kharif': ['rice', 'cotton', 'groundnut', 'maize', 'turmeric'],
                'rabi': ['tomato', 'onion', 'potato', 'chilli', 'coriander'],
                'summer': ['chilli', 'brinjal', 'okra', 'watermelon', 'cucumber']
            }
        }
    
    def _load_fertilizer_database(self) -> Dict:
        """Load natural fertilizer information"""
        return {
            'neem_oil': {
                'type': 'insecticide & fungicide',
                'benefits': 'Kills pests, prevents fungal diseases',
                'mixing': '5ml per 1L water',
                'frequency': 'Every 5-7 days',
                'crops': ['tomato', 'chilli', 'brinjal', 'okra'],
                'cost': 'Low (₹50-100 per liter)'
            },
            'panchagavya': {
                'type': 'bio-fertilizer',
                'benefits': 'Enhances growth, improves immunity',
                'mixing': '3% solution (30ml per 1L water)',
                'frequency': 'Every 15 days',
                'crops': ['all_crops'],
                'cost': 'Very low (₹20-30 per liter)'
            },
            'vermicompost': {
                'type': 'organic fertilizer',
                'benefits': 'Improves soil health, increases yield',
                'mixing': '2-3 kg per plot',
                'frequency': 'Before planting',
                'crops': ['all_crops'],
                'cost': 'Low (₹30-50 per kg)'
            },
            'cow_dung': {
                'type': 'organic fertilizer',
                'benefits': 'Improves soil structure, adds nutrients',
                'mixing': '5-10 kg per plot',
                'frequency': 'Once per season',
                'crops': ['all_crops'],
                'cost': 'Very low (₹10-20 per kg)'
            },
            'wood_ash': {
                'type': 'mineral fertilizer',
                'benefits': 'Adds potassium, repels pests',
                'mixing': 'Sprinkle directly on soil',
                'frequency': 'Once every 20 days',
                'crops': ['tomato', 'chilli', 'brinjal'],
                'cost': 'Free (agricultural waste)'
            },
            'garlic_chili_spray': {
                'type': 'insecticide',
                'benefits': 'Repels insects naturally',
                'mixing': '50g garlic + 50g chili + 1L water (blend & strain)',
                'frequency': 'Every 3-4 days',
                'crops': ['all_crops'],
                'cost': 'Very low (₹5-10)'
            },
            'fish_amino_acid': {
                'type': 'growth promoter',
                'benefits': 'High nitrogen content, increases flowering',
                'mixing': '2ml per 1L water',
                'frequency': 'Every 10-15 days',
                'crops': ['vegetables', 'fruit_trees'],
                'cost': 'Moderate (₹150-200)'
            },
            'eggshell_powder': {
                'type': 'calcium supplement',
                'benefits': 'Prevents blossom end rot in tomatoes',
                'mixing': 'Apply directly to base of plant',
                'frequency': 'Monthly',
                'crops': ['tomato', 'chilli', 'brinjal'],
                'cost': 'Free (kitchen waste)'
            }
        }
    
    def identify_query_type(self, query: str) -> QueryType:
        """
        Classify user query into categories
        """
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['disease', 'sick', 'spots', 'blight', 'fungus', 'pest', 'insect', 'damage', 'yellow', 'brown', 'wilting']):
            return QueryType.DISEASE_DIAGNOSIS
        if any(word in query_lower for word in ['best crop', 'which crop', 'what to grow', 'plant', 'variety']):
            return QueryType.CROP_RECOMMENDATION
        if any(word in query_lower for word in ['fertilizer', 'manure', 'compost', 'nutrient', 'yield', 'growth', 'urea', 'potash', 'organic']):
            return QueryType.FERTILIZER_ADVICE
        if any(word in query_lower for word in ['pest', 'bug', 'insect', 'mite', 'worm', 'fly', 'borer']):
            return QueryType.PEST_CONTROL
        if any(word in query_lower for word in ['water', 'irrigation', 'moisture', 'flood', 'drought', 'pumps', 'drip']):
            return QueryType.IRRIGATION
        if any(word in query_lower for word in ['price', 'market', 'cost', 'rate', 'sell', 'today price', 'wholesale']):
            return QueryType.MARKET_PRICE
        if any(word in query_lower for word in ['demand', 'buyer', 'customer', 'export']):
            return QueryType.DEMAND_FORECAST
        if any(word in query_lower for word in ['crash', 'drop', 'fall', 'decline', 'risk', 'loss']):
            return QueryType.PRICE_CRASH_ALERT
        if any(word in query_lower for word in ['soil', 'ground', 'prepare', 'loamy', 'clay', 'sandy', 'ph']):
            return QueryType.SOIL_PREPARATION
        if any(word in query_lower for word in ['season', 'month', 'best time', 'when to', 'adi', 'thai', 'pattam']):
            return QueryType.SEASONAL_ADVICE
        return QueryType.GENERAL_QUESTION
    
    async def process_query(
        self,
        query: str,
        user_id: int,
        farm_data: Optional[Dict] = None,
        language: str = 'en'
    ) -> Dict:
        """
        Process user query and generate response
        """
        self._initialize_api()
        try:
            query_type = self.identify_query_type(query)
            logger.info(f"Processing query: {query} | Type: {query_type.value}")
            
            if query_type == QueryType.DISEASE_DIAGNOSIS:
                response = await self._handle_disease_query(query, farm_data)
            elif query_type == QueryType.CROP_RECOMMENDATION:
                response = await self._handle_crop_query(query, farm_data)
            elif query_type == QueryType.FERTILIZER_ADVICE:
                response = await self._handle_fertilizer_query(query, farm_data)
            elif query_type == QueryType.PEST_CONTROL:
                response = await self._handle_pest_query(query)
            elif query_type == QueryType.IRRIGATION:
                response = await self._handle_irrigation_query(query, farm_data)
            elif query_type == QueryType.MARKET_PRICE:
                response = await self._handle_market_query(query, farm_data)
            elif query_type == QueryType.PRICE_CRASH_ALERT:
                response = await self._handle_price_crash_query(query, farm_data)
            elif query_type == QueryType.SOIL_PREPARATION:
                response = await self._handle_soil_query(query, farm_data)
            elif query_type == QueryType.SEASONAL_ADVICE:
                response = await self._handle_seasonal_query(query, farm_data)
            else:
                response = await self._handle_general_query(query, farm_data)
            
            if language == 'ta':
                response['tamil_translation'] = await self._translate_to_tamil(response['response'])
            
            response['timestamp'] = datetime.utcnow().isoformat()
            response['user_id'] = user_id
            response['language'] = language
            
            await self._save_to_chat_history(user_id, query, response)
            return response
        
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return {
                'response': 'மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை. மீண்டும் கேட்கவும்.' if language == 'ta' else 'Sorry, I had trouble understanding that. Could you rephrase?',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def _handle_disease_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        # Check if query mentions a specific disease we know
        query_lower = query.lower()
        matched_disease = None
        for disease in self.knowledge_base['natural_treatments'].keys():
            if disease.replace('_', ' ') in query_lower:
                matched_disease = disease
                break
        
        if matched_disease:
            info = self.knowledge_base['natural_treatments'][matched_disease]
            return {
                'response': f"I see you're asking about **{matched_disease.replace('_', ' ').title()}**.\n\nDescription: {info['description']}\n\n**Natural Solution:** {info['solution']}\nMix: {info['mix']}\nFrequency: {info['frequency']}\nCost: {info.get('cost', 'Varies')}\n\nWould you like to schedule monitoring for this?",
                'query_type': 'disease_diagnosis',
                'disease_found': matched_disease,
                'treatment_info': info,
                'suggestions': ['Schedule Monitoring', 'Describe more symptoms'],
                'confidence': 0.95
            }

        return {
            'response': f"I understand you might have a crop disease issue.\nTo help you better, I can:\n1. **Upload a photo** 📸\n2. **Describe symptoms** (e.g., 'yellow spots on tomato')\n3. **Get treatment immediately**\n\nWhat symptoms are you seeing?",
            'query_type': 'disease_diagnosis',
            'suggestions': ['Upload Photo', 'Yellow spots', 'White powder', 'Wilting'],
            'confidence': 0.85,
            'next_action': 'image_upload_or_description'
        }
    
    async def _handle_crop_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        return {
            'response': f"I can help you choose the best crop for your farm! 🌾\n\nTo give you a precise recommendation, tell me:\n- Your District/Location\n- Farm Size (Acres)\n- Soil Type (Sandy, Clay, Loamy)\n- Water Source (Bore, Rainfed)\n- Current Season",
            'query_type': 'crop_recommendation',
            'suggestions': ['Coimbatore, 5 acres, Loamy', 'Salem, 2 acres, Sandy'],
            'confidence': 0.80,
            'ml_model_ready': True
        }
    
    async def _handle_fertilizer_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        # Check for specific crop or issue
        return {
            'response': "Choosing the right natural fertilizer is key to quality yield! 🌱\n\n**Top Natural Recommendations:**\n1. **Panchagavya** - For overall growth & immunity\n2. **Neem Cake/Oil** - Controls soil pests & fungus\n3. **Vermicompost** - Improves soil structure\n4. **Fish Amino Acid** - Boosts flowering\n5. **Wood Ash** - Natural potassium source\n\nWhich crop are you growing? I can give you the exact mixing ratio.",
            'query_type': 'fertilizer_advice',
            'fertilizer_options': list(self.fertilizer_db.keys()),
            'suggestions': ['Panchagavya for Tomato', 'Neem for Chilli'],
            'confidence': 0.90
        }
    
    async def _handle_pest_query(self, query: str) -> Dict:
        return {
            'response': "Pest problems? Let's fix it naturally! 🐛\n\n**Common Pests & Organic Solutions:**\n1. **Sucking Pests** (Aphids/Mites) -> Neem Oil or Yellow Sticky Traps\n2. **Leaf Borers** -> Light Traps or Trichogramma cards\n3. **Mealybugs** -> Fish Oil Rosin Soap or Soapy Water spray\n4. **Caterpillars** -> Garlic Ginger Chili spray\n\nDescribe the pest you see (color, size, location) or upload a photo!",
            'query_type': 'pest_control',
            'suggestions': ['Little green bugs', 'White sticky stuff', 'Holes in leaves'],
            'confidence': 0.85
        }

    async def _handle_irrigation_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        return {
            'response': "Efficient watering saves money and prevents disease! 💧\n\n**Recommendations:**\n- **Drip Irrigation** is best for row crops like Tomato & Chilli.\n- Water early morning or late evening to reduce evaporation.\n- Monitor soil moisture 4 inches deep before watering again.\n\nAre you using drip or flood irrigation?",
            'query_type': 'irrigation',
            'suggestions': ['Drip Irrigation', 'Flood Irrigation', 'Watering frequency'],
            'confidence': 0.85
        }

    async def _handle_soil_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        return {
            'response': "Healthy soil is the foundation! 🏜️\n\n**Tips for Soil Health:**\n1. Grow **Green Manure** (Sunn hemp) and plow it back.\n2. Apply **Well-decomposed Cow Dung** (5-10 tons per acre).\n3. Use **Bio-fertilizers** (Azospirillum, Phosphobacteria).\n4. Check soil pH - Tamil Nadu soils are often alkaline.\n\nHave you done a soil test recently?",
            'query_type': 'soil_preparation',
            'suggestions': ['Soil testing labs', 'Green manure seeds', 'pH level help'],
            'confidence': 0.80
        }

    async def _handle_seasonal_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        current_month = datetime.now().strftime("%B")
        return {
            'response': f"It is currently **{current_month}**. In Tamil Nadu, this is a great time for certain crops.\n\n**Current Seasonal Advice:**\n- **Kharif (Adi Pattam):** Rice, Turmeric, Cotton\n- **Rabi (Thai Pattam):** Onion, Tomato, Vegetables\n\nWhat are you planning to plant next?",
            'query_type': 'seasonal_advice',
            'current_month': current_month,
            'suggestions': ['Thai Pattam crops', 'Adi Pattam crops'],
            'confidence': 0.85
        }
    
    async def _handle_market_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        return {
            'response': "Looking for market insights? 📊\nI can provide:\n1. **Current Prices** - Real-time rates from nearby mandis\n2. **Demand Trends** - Which crops will sell high next month\n3. **Profit Calculator** - Calculate your net profit\n\nWhich crop price are you looking for today?",
            'query_type': 'market_price',
            'ml_model': 'price_prediction',
            'suggestions': ['Tomato price today', 'Onion price forecast'],
            'confidence': 0.85
        }
    
    async def _handle_price_crash_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        return {
            'response': "Smart move monitoring price crashes! 📉\nCrashes usually happen during peak harvest. I'll check my market intelligence model for you.\n\nTell me your crop and location, and I'll give you a 7-day risk assessment.",
            'query_type': 'price_crash_alert',
            'ml_model': 'price_crash_detection',
            'suggestions': ['Tomato crash risk', 'Onion supply status'],
            'confidence': 0.80
        }
    
    async def _handle_general_query(self, query: str, farm_data: Optional[Dict]) -> Dict:
        if not self.api_key:
            return {
                'response': "I am working in offline mode. I can help with pests, diseases, and fertilizers directly. For complex advice, please try again when I'm online!",
                'confidence': 0.5
            }
        
        system_prompt = """You are HarvestLink AI, an expert agricultural assistant dedicated to helping Tamil Nadu farmers.
        Provide simple, practical, and highly accurate advice. 
        Focus heavily on natural, organic, and cost-effective solutions.
        Format your answers with bullet points and bold text for readability.
        If the user asks something dangerous or illegal related to farming, politely decline."""
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                temperature=0.7,
                max_tokens=400
            )
            return {
                'response': response.choices[0].message.content,
                'query_type': 'general',
                'ml_model': 'gpt-3.5-turbo',
                'confidence': 0.85
            }
        except Exception as e:
            logger.error(f"OpenAI error: {e}")
            return {
                'response': "I'm having a bit of trouble thinking right now. Let's focus on basics - are you seeing any pest or disease symptoms?",
                'error': str(e),
                'confidence': 0.0
            }
    
    async def _translate_to_tamil(self, text: str) -> str:
        if not self.api_key:
            return "[தமிழ் மொழியாக்கம் தற்போது கிடைக்கவில்லை]"
        
        tamil_prompt = f"Translate the following agricultural advice into professional yet simple Tamil that a farmer in Tamil Nadu would understand perfectly. Keep the tone helpful and encouraging:\n\n{text}"
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": tamil_prompt}],
                max_tokens=600,
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return "[மொழியாக்கம் தோல்வியடைந்தது]"
    
    async def _save_to_chat_history(self, user_id: int, query: str, response: Dict):
        """Placeholder for database persistence logic"""
        logger.info(f"Saving chat for user {user_id}: {query[:50]}...")


_chatbot_service = None

def get_chatbot_service() -> ChatbotService:
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service
