"""
Natural Treatment & Fertilizer Recommendation Engine
"""

import logging
from typing import Dict, List, Optional
from enum import Enum

logger = logging.getLogger(__name__)


class SeverityLevel(Enum):
    """Disease severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TreatmentEngine:
    """
    Recommends natural treatments and fertilizers
    """
    
    def __init__(self):
        """Initialize treatment database"""
        self.treatments = self._load_treatments()
        self.fertilizers = self._load_fertilizers()
        self.precautions = self._load_precautions()
    
    def _load_treatments(self) -> Dict:
        """Load natural treatment database"""
        return {
            'early_blight': {
                'disease_name': 'Early Blight',
                'description': 'Brown spots with concentric rings on tomato leaves',
                'causes': ['High humidity', 'Poor air circulation', 'Overwatering'],
                'treatments': {
                    'low': {
                        'action': 'Monitor daily',
                        'spray': None,
                        'frequency': 'Daily inspection',
                        'duration_days': 7,
                        'cost_estimate': 0
                    },
                    'medium': {
                        'action': 'Remove infected leaves + spray neem oil',
                        'spray': {
                            'name': 'Neem Oil Solution',
                            'mix': '5ml neem oil + 1L water + 5ml soap',
                            'coverage': 'Spray until dripping',
                            'best_time': 'Early morning or evening'
                        },
                        'frequency': 'Every 5 days',
                        'duration_days': 14,
                        'cost_estimate': 100
                    },
                    'high': {
                        'action': 'Remove heavily affected leaves + intensive spray + isolation',
                        'spray': {
                            'name': 'Neem Oil + Copper',
                            'mix': '5ml neem + 1L water + 1g copper sulfate',
                            'coverage': 'Complete coverage including undersides',
                            'best_time': 'Early morning'
                        },
                        'frequency': 'Every 2-3 days',
                        'duration_days': 21,
                        'cost_estimate': 250,
                        'extra_actions': [
                            'Remove infected leaves immediately',
                            'Improve air circulation (remove lower leaves)',
                            'Reduce watering frequency',
                            'Isolate infected plants if possible'
                        ]
                    }
                }
            },
            'late_blight': {
                'disease_name': 'Late Blight',
                'description': 'Water-soaked spots with white fungus on undersides',
                'causes': ['Cool, wet conditions', 'High humidity', 'Poor drainage'],
                'treatments': {
                    'low': {
                        'action': 'Improve drainage + monitor',
                        'spray': None,
                        'frequency': 'Daily inspection',
                        'duration_days': 7,
                        'cost_estimate': 0
                    },
                    'medium': {
                        'action': 'Spray baking soda solution',
                        'spray': {
                            'name': 'Baking Soda Fungicide',
                            'mix': '1 tbsp baking soda + 1L water + 5ml soap',
                            'coverage': 'Both sides of leaves',
                            'best_time': 'Evening'
                        },
                        'frequency': 'Every 3-4 days',
                        'duration_days': 14,
                        'cost_estimate': 50
                    },
                    'high': {
                        'action': 'Remove infected plants + intensive spray',
                        'spray': {
                            'name': 'Bordeaux Mixture (Homemade)',
                            'mix': '1 tbsp copper sulfate + 1 tbsp lime + 1L water',
                            'coverage': 'Complete spray',
                            'best_time': 'Early morning'
                        },
                        'frequency': 'Every 2 days',
                        'duration_days': 21,
                        'cost_estimate': 300,
                        'extra_actions': [
                            'Remove infected plants entirely',
                            'Improve drainage immediately',
                            'Reduce watering (water only at soil level)',
                            'Avoid working in field when wet'
                        ]
                    }
                }
            },
            'powdery_mildew': {
                'disease_name': 'Powdery Mildew',
                'description': 'White powder coating on leaves and stems',
                'causes': ['Low humidity', 'Poor air circulation', 'High temperature variation'],
                'treatments': {
                    'low': {
                        'action': 'Improve air circulation',
                        'spray': None,
                        'frequency': 'Monitor every 3 days',
                        'duration_days': 10,
                        'cost_estimate': 0
                    },
                    'medium': {
                        'action': 'Spray sulfur powder or milk solution',
                        'spray': {
                            'name': 'Milk Spray',
                            'mix': '1 part milk + 9 parts water',
                            'coverage': 'Both sides of leaves',
                            'best_time': 'Morning'
                        },
                        'frequency': 'Every 7 days',
                        'duration_days': 14,
                        'cost_estimate': 30
                    },
                    'high': {
                        'action': 'Sulfur dust + intense leaf pruning',
                        'spray': {
                            'name': 'Sulfur Dust',
                            'mix': 'Pure sulfur powder (dusting)',
                            'coverage': 'Dust all affected areas',
                            'best_time': 'Evening'
                        },
                        'frequency': 'Every 5 days',
                        'duration_days': 21,
                        'cost_estimate': 200,
                        'extra_actions': [
                            'Remove heavily affected leaves',
                            'Thin out canopy for air circulation',
                            'Avoid overhead irrigation'
                        ]
                    }
                }
            },
            'leaf_curl': {
                'disease_name': 'Leaf Curl Virus',
                'description': 'Leaves twisted, thickened and puckered',
                'causes': ['Whitefly transmission', 'Infected seeds', 'Nearby host weeds'],
                'treatments': {
                    'low': {
                        'action': 'Remove infected leaves + sticky traps',
                        'spray': {
                            'name': 'Neem Oil Spray',
                            'mix': '5ml neem + 1L water',
                            'coverage': 'Under leaves where whiteflies hide'
                        },
                        'frequency': 'Every 7 days',
                        'duration_days': 14,
                        'cost_estimate': 50
                    },
                    'medium': {
                        'action': 'Yellow sticky traps + Fish amino acid',
                        'spray': {
                            'name': 'Fish Oil Rosin Soap',
                            'mix': '20g per 1L water',
                            'coverage': 'Thorough coverage'
                        },
                        'frequency': 'Every 5 days',
                        'duration_days': 21,
                        'cost_estimate': 120
                    },
                    'high': {
                        'action': 'Remove infected plants + control vector',
                        'spray': {
                            'name': 'Intensive vector control spray',
                            'mix': 'Garlic-Chili-Ginger extract',
                            'coverage': 'Complete coverage'
                        },
                        'frequency': 'Every 3 days',
                        'duration_days': 30,
                        'cost_estimate': 200,
                        'extra_actions': [
                            'Uproot and burn heavily infected plants',
                            'Install yellow sticky traps (10 per acre)',
                            'Remove weeds like Parthenium'
                        ]
                    }
                }
            },
            'fruit_rot': {
                'disease_name': 'Fruit Rot (Anthracnose)',
                'description': 'Sunken circular spots on ripening fruit',
                'causes': ['Wet weather', 'Infected seeds', 'Soil splash'],
                'treatments': {
                    'low': {
                        'action': 'Remove rot-affected fruits',
                        'spray': None,
                        'frequency': 'Daily sorting',
                        'duration_days': 10,
                        'cost_estimate': 0
                    },
                    'medium': {
                        'action': 'Spray Pseudomonas solution',
                        'spray': {
                            'name': 'Pseudomonas Solution',
                            'mix': '10g powder in 1L water',
                            'coverage': 'Focus on fruits and lower leaves'
                        },
                        'frequency': 'Every 7 days',
                        'duration_days': 20,
                        'cost_estimate': 80
                    },
                    'high': {
                        'action': 'Intense removal + Copper spray',
                        'spray': {
                            'name': 'Copper Fungicide (Organic Alternative)',
                            'mix': '1% Bordeaux mixture',
                            'coverage': 'Complete drench'
                        },
                        'frequency': 'Every 5 days',
                        'duration_days': 30,
                        'cost_estimate': 250,
                        'extra_actions': [
                            'Mulch soil with straw to prevent splash',
                            'Harvest immediately if fruit is mature',
                            'Avoid picking fruit when wet'
                        ]
                    }
                }
            }
        }
    
    def _load_fertilizers(self) -> Dict:
        """Load natural fertilizer database"""
        return {
            'neem_oil': {
                'name': 'Neem Oil',
                'type': 'Botanical Insecticide & Fungicide',
                'uses': ['Pest control', 'Disease prevention', 'Leaf health'],
                'mixing': {
                    'base': '5ml neem oil',
                    'water': '1 liter',
                    'soap': '5ml (emulsifier)',
                    'total': '1L solution'
                },
                'frequency': 'Every 5-7 days',
                'cost_per_liter': 75,
                'benefits': [
                    'Kills pests (mites, aphids, whiteflies)',
                    'Prevents fungal diseases',
                    'Improves plant immunity',
                    'Safe for beneficial insects'
                ],
                'crops': ['tomato', 'chilli', 'brinjal', 'okra', 'cucumber']
            },
            'panchagavya': {
                'name': 'Panchagavya',
                'type': 'Traditional Bio-Fertilizer',
                'uses': ['Growth enhancement', 'Immunity booster', 'Yield increase'],
                'mixing': {
                    'panchagavya': '30ml (if concentrated)',
                    'water': '1 liter',
                    'total': '1L solution (3% strength)'
                },
                'frequency': 'Every 15-20 days',
                'cost_per_liter': 25,
                'benefits': [
                    'Promotes vegetative growth',
                    'Increases flowering and fruiting',
                    'Improves soil health',
                    'Contains nitrogen-fixing bacteria',
                    'Very economical'
                ],
                'crops': ['all_crops']
            },
            'vermicompost': {
                'name': 'Vermicompost',
                'type': 'Organic Fertilizer (Soil Amendment)',
                'uses': ['Soil improvement', 'Nutrient source', 'Moisture retention'],
                'mixing': {
                    'application': '2-3 kg per plot',
                    'timing': 'Mix with top 6 inches of soil'
                },
                'frequency': 'Before planting + every 45 days',
                'cost_per_kg': 40,
                'benefits': [
                    'Improves soil structure',
                    'Increases water retention',
                    'Rich in NPK and micronutrients',
                    'Promotes beneficial soil microbes',
                    'Increases yield by 15-20%'
                ],
                'crops': ['all_crops']
            },
            'wood_ash': {
                'name': 'Wood Ash',
                'type': 'Mineral Fertilizer (Potassium source)',
                'uses': ['Pest control', 'Potassium supplement', 'pH adjustment'],
                'mixing': {
                    'application': 'Sprinkle directly on soil around plants',
                    'amount': '100-150g per plant'
                },
                'frequency': 'Every 20-30 days',
                'cost_per_kg': 0,
                'benefits': [
                    'Free (agricultural waste)',
                    'High potassium content',
                    'Repels slugs and soft-bodied insects',
                    'Improves soil pH',
                    'Increases fruit quality'
                ],
                'crops': ['tomato', 'chilli', 'brinjal', 'potato']
            },
            'garlic_chili_spray': {
                'name': 'Garlic-Chili Spray',
                'type': 'Homemade Organic Insecticide',
                'uses': ['Pest control', 'Mite prevention'],
                'mixing': {
                    'garlic': '50g (chopped)',
                    'chili': '50g (fresh)',
                    'water': '1 liter',
                    'method': 'Blend all, strain, spray'
                },
                'frequency': 'Every 3-4 days',
                'cost_per_batch': 10,
                'benefits': [
                    'Extremely economical',
                    'Effective against most pests',
                    'No chemical residue',
                    'Safe for humans and soil',
                    'Easy to prepare'
                ],
                'crops': ['all_crops']
            }
        }
    
    def _load_precautions(self) -> Dict:
        """Load preventive measures"""
        return {
            'general': [
                'Ensure proper spacing between plants',
                'Improve air circulation by pruning lower leaves',
                'Water at soil level, not on leaves',
                'Remove dead leaves and plant debris regularly',
                'Practice crop rotation yearly',
                'Use disease-resistant varieties when available'
            ],
            'by_season': {
                'monsoon': [
                    'Increase drainage',
                    'Reduce watering frequency',
                    'Improve air circulation',
                    'Preventive spraying with neem or milk'
                ],
                'summer': [
                    'Provide shade net if needed',
                    'Increase watering frequency',
                    'Mulching to retain moisture',
                    'Watch for spider mite outbreaks'
                ],
                'winter': [
                    'Proper drainage to avoid waterlogging',
                    'Early morning watering',
                    'Monitor for fungal diseases'
                ]
            }
        }
    
    def get_treatment_plan(
        self,
        disease: str,
        severity: SeverityLevel,
        crop: str,
        days_to_harvest: Optional[int] = None
    ) -> Dict:
        """
        Get complete treatment plan for detected disease
        """
        disease_lower = disease.lower().replace(' ', '_')
        
        if disease_lower not in self.treatments:
            return {
                'error': 'Disease not found',
                'message': 'Please consult local agricultural officer',
                'disease': disease
            }
        
        treatment_data = self.treatments[disease_lower]
        severity_level = severity.value if isinstance(severity, SeverityLevel) else severity
        
        if severity_level not in treatment_data['treatments']:
            severity_level = 'medium'
        
        treatment = treatment_data['treatments'][severity_level]
        
        plan = {
            'disease': treatment_data['disease_name'],
            'severity': severity_level.upper(),
            'crop': crop,
            'description': treatment_data['description'],
            'causes': treatment_data['causes'],
            'immediate_action': treatment['action'],
            'monitoring': {
                'daily': True if severity_level == 'high' else False,
                'frequency_days': 2 if severity_level == 'high' else (3 if severity_level == 'medium' else 5),
                'duration_days': treatment['duration_days']
            },
            'spray_plan': treatment.get('spray'),
            'spray_frequency': treatment['frequency'],
            'expected_improvement_days': treatment['duration_days'] // 2,
            'total_treatment_days': treatment['duration_days'],
            'estimated_cost': f"₹{treatment['cost_estimate']}",
            'extra_precautions': treatment.get('extra_actions', []),
            'general_precautions': self.precautions['general'],
            'follow_up': {
                'day_3': 'Check for improvement',
                'day_7': 'Assess effectiveness, adjust if needed',
                'day_14': 'Consider stopping treatment if healthy'
            }
        }
        
        if days_to_harvest:
            if days_to_harvest < 14:
                plan['harvest_warning'] = f'⚠️ Harvest in {days_to_harvest} days. Use only neem/soap sprays (no harsh chemicals)'
            plan['safe_harvest_days'] = max(0, 14 - days_to_harvest)
        
        return plan
    
    def get_fertilizer_recommendation(
        self,
        crop: str,
        current_stage: str = 'vegetative',
        problem: Optional[str] = None
    ) -> List[Dict]:
        """
        Get fertilizer recommendations
        """
        recommendations = []
        base_recommendations = {
            'tomato': ['panchagavya', 'vermicompost', 'neem_oil', 'wood_ash'],
            'onion': ['vermicompost', 'panchagavya', 'garlic_chili_spray'],
            'chilli': ['neem_oil', 'panchagavya', 'wood_ash', 'vermicompost'],
            'potato': ['vermicompost', 'panchagavya', 'wood_ash']
        }
        
        crop_lower = crop.lower()
        ferts = base_recommendations.get(crop_lower, list(self.fertilizers.keys()))
        
        for fert_name in ferts:
            if fert_name in self.fertilizers:
                fert = self.fertilizers[fert_name].copy()
                
                if current_stage == 'vegetative' and fert_name == 'panchagavya':
                    fert['priority'] = 'HIGH'
                elif current_stage == 'flowering' and fert_name == 'wood_ash':
                    fert['priority'] = 'HIGH'
                else:
                    fert['priority'] = 'MEDIUM'
                
                if problem:
                    if problem.lower() == 'yellowing' and fert_name == 'panchagavya':
                        fert['note'] = '⭐ Best for yellowing leaves'
                    elif problem.lower() == 'low_yield' and fert_name == 'vermicompost':
                        fert['note'] = '⭐ Increase yield by 15-20%'
                
                recommendations.append(fert)
        
        return recommendations


_treatment_engine = None

def get_treatment_engine() -> TreatmentEngine:
    global _treatment_engine
    if _treatment_engine is None:
        _treatment_engine = TreatmentEngine()
    return _treatment_engine
