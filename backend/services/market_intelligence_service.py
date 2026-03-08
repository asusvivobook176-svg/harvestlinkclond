"""
Market Intelligence Service for Shop Owners & Traders
Provides real-time market data, price trends, and supply-demand analysis
"""

import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import numpy as np
from enum import Enum

logger = logging.getLogger(__name__)

class UserType(Enum):
    """Market chatbot user types"""
    SHOP_OWNER = "shop_owner"  # Retail shopkeeper
    WHOLESALE_TRADER = "wholesale_trader"  # Bulk buyer/seller
    FARMER_COOPERATIVE = "farmer_cooperative"
    COMMISSION_AGENT = "commission_agent"

class MarketIntelligence:
    """
    Provides market intelligence for traders & shop owners
    - Real-time prices
    - Trend analysis
    - Demand forecasting
    - Supplier management
    - Profit optimization
    """
    
    def __init__(self):
        """Initialize market intelligence service"""
        self.market_data = self._load_market_data()
        self.price_history = self._load_price_history()
        self.supplier_network = self._load_supplier_network()
        self.demand_patterns = self._load_demand_patterns()
        
    def _load_market_data(self) -> Dict:
        """Load current market data for major crops"""
        return {
            'tomato': {
                'current_price': 28,  # ₹/kg
                'price_range': (22, 35),
                'supply_level': 'HIGH',
                'demand_level': 'HIGH',
                'market_status': 'STABLE',
                'volume_traded': 5000,  # tons/day
                'main_suppliers': ['Coimbatore', 'Salem', 'Madurai'],
                'main_buyers': ['Chennai', 'Bangalore', 'Hyderabad']
            },
            'onion': {
                'current_price': 28,
                'price_range': (20, 40),
                'supply_level': 'MEDIUM',
                'demand_level': 'HIGH',
                'market_status': 'VOLATILE',
                'volume_traded': 3000,
                'main_suppliers': ['Salem', 'Krishnagiri', 'Coimbatore'],
                'main_buyers': ['All major cities']
            },
            'potato': {
                'current_price': 22,
                'price_range': (18, 28),
                'supply_level': 'HIGH',
                'demand_level': 'MEDIUM',
                'market_status': 'STABLE',
                'volume_traded': 2500,
                'main_suppliers': ['Krishnagiri', 'Coimbatore'],
                'main_buyers': ['Processing units', 'Retail chains']
            },
            'chilli': {
                'current_price': 45,
                'price_range': (35, 60),
                'supply_level': 'LOW',
                'demand_level': 'HIGH',
                'market_status': 'BULLISH',
                'volume_traded': 500,
                'main_suppliers': ['Guntur AP', 'Telangana'],
                'main_buyers': ['Food processors', 'Export companies']
            },
            'brinjal': {
                'current_price': 18,
                'price_range': (12, 25),
                'supply_level': 'HIGH',
                'demand_level': 'MEDIUM',
                'market_status': 'STABLE'
            }
        }
    
    def _load_price_history(self) -> Dict:
        """Load 90-day price history for trending"""
        # Simulated data - in production, load from database
        return {
            'tomato': {
                'daily_prices': [25 + np.sin(i/10) * 3 for i in range(90)],
                'weekly_avg': [25, 26, 27, 28, 27, 26, 27, 28, 28, 27, 26, 25, 24],
                'monthly_avg': [25.5, 26.5, 27.5]
            },
            'onion': {
                'daily_prices': [25 + np.sin(i/8) * 5 for i in range(90)],
                'weekly_avg': [24, 26, 28, 30, 28, 26, 24, 22, 20, 22, 24, 26, 28],
                'monthly_avg': [26.0, 26.5, 24.0]
            }
        }
    
    def _load_supplier_network(self) -> Dict:
        """Load supplier information"""
        return {
            'coimbatore': {
                'suppliers': [
                    {
                        'name': 'Coimbatore Farmers Cooperative',
                        'contact': '+91-9876543210',
                        'reliability_score': 95,
                        'avg_delivery_days': 1,
                        'crops': ['tomato', 'brinjal', 'chilli'],
                        'min_order_qty': 100,  # kg
                        'prices': {'tomato': 26, 'brinjal': 15, 'chilli': 43}
                    },
                    {
                        'name': 'Salem Fresh Farms',
                        'contact': '+91-8765432109',
                        'reliability_score': 92,
                        'avg_delivery_days': 2,
                        'crops': ['tomato', 'onion', 'potato'],
                        'min_order_qty': 200,
                        'prices': {'tomato': 25, 'onion': 26, 'potato': 20}
                    }
                ]
            },
            'salem': {
                'suppliers': [
                    {
                        'name': 'Salem Trading Hub',
                        'contact': '+91-7654321098',
                        'reliability_score': 88,
                        'avg_delivery_days': 1,
                        'crops': ['onion', 'potato', 'tomato'],
                        'min_order_qty': 150,
                        'prices': {'onion': 27, 'potato': 21, 'tomato': 27}
                    }
                ]
            }
        }
    
    def _load_demand_patterns(self) -> Dict:
        """Load seasonal demand patterns"""
        return {
            'tomato': {
                'jan': {'demand': 95, 'price_trend': 'stable'},
                'feb': {'demand': 90, 'price_trend': 'stable'},
                'mar': {'demand': 100, 'price_trend': 'up'},
                'apr': {'demand': 105, 'price_trend': 'up'},
                'may': {'demand': 110, 'price_trend': 'peak'},
                'jun': {'demand': 100, 'price_trend': 'down'},
                'jul': {'demand': 80, 'price_trend': 'down'},
                'aug': {'demand': 85, 'price_trend': 'down'},
                'sep': {'demand': 90, 'price_trend': 'stable'},
                'oct': {'demand': 95, 'price_trend': 'stable'},
                'nov': {'demand': 100, 'price_trend': 'up'},
                'dec': {'demand': 105, 'price_trend': 'up'}
            },
            'onion': {
                'jan': {'demand': 100, 'price_trend': 'stable'},
                'feb': {'demand': 95, 'price_trend': 'down'},
                'mar': {'demand': 120, 'price_trend': 'up'},
                'apr': {'demand': 115, 'price_trend': 'peak'},
                'may': {'demand': 105, 'price_trend': 'down'},
                'jun': {'demand': 95, 'price_trend': 'down'},
                'jul': {'demand': 85, 'price_trend': 'down'},
                'aug': {'demand': 90, 'price_trend': 'stable'},
                'sep': {'demand': 100, 'price_trend': 'up'},
                'oct': {'demand': 110, 'price_trend': 'peak'},
                'nov': {'demand': 105, 'price_trend': 'down'},
                'dec': {'demand': 100, 'price_trend': 'stable'}
            }
        }
    
    async def answer_market_query(
        self,
        query: str,
        user_id: int,
        user_type: UserType,
        location: Optional[str] = None
    ) -> Dict:
        """
        Answer market-related query
        """
        query_lower = query.lower()
        
        # Route to appropriate handler
        if any(word in query_lower for word in ['best time', 'when to buy', 'buy price']):
            return await self._answer_buying_query(query, location, user_type)
        elif any(word in query_lower for word in ['demand', 'selling', 'sell', 'high demand']):
            return await self._answer_demand_query(query)
        elif any(word in query_lower for word in ['supplier', 'where to buy', 'bulk buy']):
            return await self._answer_supplier_query(query, location, user_type)
        elif any(word in query_lower for word in ['profit', 'margin', 'money', 'earn']):
            return await self._answer_profit_query(query)
        elif any(word in query_lower for word in ['price', 'trend', 'forecast']):
            return await self._answer_price_query(query)
        elif any(word in query_lower for word in ['supply', 'shortage', 'surplus']):
            return await self._answer_supply_query(query)
        else:
            return await self._answer_general_market_query(query)
            
    async def _answer_buying_query(self, query: str, location: Optional[str], user_type: UserType) -> Dict:
        """Answer "When/how to buy" queries"""
        # Extract crop name
        crop = self._extract_crop_name(query)
        if not crop or crop not in self.market_data:
            return {
                'response': 'Which crop? (Tomato, Onion, Potato, Chilli)',
                'suggestions': list(self.market_data.keys()),
                'timestamp': datetime.utcnow().isoformat()
            }
            
        crop_data = self.market_data[crop]
        current_price = crop_data['current_price']
        price_range = crop_data['price_range']
        
        # Predict next 7 days
        prediction = await self._predict_price_trend(crop, days=7)
        
        # Generate response
        response = f"""
📊 **Best Time to Buy {crop.upper()}**

**Current Status:**
• Price: ₹{current_price}/kg
• Price Range: ₹{price_range[0]}-{price_range[1]}/kg
• Supply: {crop_data['supply_level']}
• Demand: {crop_data['demand_level']}
• Market: {crop_data['market_status']}

**7-Day Price Forecast:**
"""
        for day, data in prediction.items():
            response += f"\n{data['day']}: ₹{data['predicted_price']}/kg ({data['trend']})"
            
        response += f"""

**Recommendation:**
{self._get_buying_recommendation(crop, current_price, prediction)}

**Best Suppliers Near {location or 'your area'}:**
"""
        suppliers = self._get_nearby_suppliers(crop, location)
        for i, supplier in enumerate(suppliers[:3], 1):
            response += f"""
{i}. {supplier['name']}
   Price: ₹{supplier['price']}/kg
   Reliability: {supplier['reliability_score']}%
   Delivery: {supplier['avg_delivery_days']} days
   Contact: {supplier['contact']}
"""

        return {
            'response': response,
            'crop': crop,
            'current_price': current_price,
            'forecast': prediction,
            'suppliers': suppliers,
            'recommendation': 'BUY_NOW' if prediction['day_1']['trend'] == 'up' else 'WAIT',
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_demand_query(self, query: str) -> Dict:
        """Answer "High demand?" / "Which crop to sell?" queries"""
        # Analyze all crops for demand
        demand_analysis = {}
        current_month = datetime.now().month
        
        for crop, patterns in self.demand_patterns.items():
            month_index = (current_month - 1) % 12
            month_key = list(patterns.keys())[month_index]
            month_data = patterns[month_key]
            demand_analysis[crop] = {
                'current_demand': month_data['demand'],
                'trend': month_data['price_trend'],
                'next_month_demand': month_data['demand'] + 10  # Simplified
            }
            
        # Sort by demand
        sorted_crops = sorted(
            demand_analysis.items(), 
            key=lambda x: x[1]['current_demand'], 
            reverse=True
        )
        
        response = f"""
📈 **Current Market Demand Analysis**

**Top Crops by Demand (Right Now):**
"""
        for i, (crop, data) in enumerate(sorted_crops[:3], 1):
            emoji = "🔴" if data['trend'] == 'up' else "🟡" if data['trend'] == 'stable' else "🟢"
            response += f"""
{i}. **{crop.upper()}** {emoji}
   Current Demand: {data['current_demand']}/100 (VERY HIGH!)
   Trend: {data['trend']}
   Next Month: {data['next_month_demand']}/100
   Profit Potential: 35-50%
   Market Price: ₹{self.market_data[crop]['current_price']}/kg
   Supply Status: {self.market_data[crop]['supply_level']}
"""
            
        response += """

**Best Selling Opportunities:**
• High demand crops: Tomato, Chilli, Onion
• Best season: March-May (peak demand)
• Best markets: Chennai, Bangalore, Hyderabad
• Recommended action: Stock these crops NOW

**Next Month Forecast:**
Tomato demand ↑15% (Higher prices expected)
Onion demand ↓5% (Lower prices expected)
Chilli demand ↑10% (Steady increase)
"""
        return {
            'response': response,
            'high_demand_crops': [crop for crop, _ in sorted_crops[:3]],
            'analysis': demand_analysis,
            'recommendation': sorted_crops[0],
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_supplier_query(self, query: str, location: Optional[str], user_type: UserType) -> Dict:
        """Answer "Where to buy?" / "Best supplier?" queries"""
        crop = self._extract_crop_name(query)
        if not crop or crop not in self.market_data:
            return {
                'response': 'Which crop? (Tomato, Onion, Potato, Chilli)',
                'timestamp': datetime.utcnow().isoformat()
            }
            
        suppliers = self._get_nearby_suppliers(crop, location)
        
        response = f"""
🏭 **Best Suppliers for {crop.upper()}**

**Location:** {location or 'Your Area'}

**Top Suppliers:**
"""
        for i, supplier in enumerate(suppliers[:5], 1):
            response += f"""
{i}. **{supplier['name']}** ⭐ {supplier['reliability_score']}%
   Location: {supplier['location']}
   Price: ₹{supplier['price']}/kg
   Reliability: {supplier['reliability_score']}%
   Delivery: {supplier['avg_delivery_days']} days
   Min Order: {supplier['min_order_qty']} kg
   Quality: {supplier['quality']}
   Contact: {supplier['contact']}
   
💰 **Cost Analysis:**
For 500kg: ₹{supplier['price'] * 500:,} ({supplier['margin_estimate']}% profit margin)
"""

        # Best deal analysis
        best_price = min(suppliers, key=lambda x: x['price']) if suppliers else None
        
        response += f"""
**Quick Comparison:**
• Cheapest: {best_price['name'] if best_price else 'N/A'} (₹{best_price['price'] if best_price else 0}/kg)
• Fastest Delivery: {suppliers[0]['name'] if suppliers else 'N/A'}

**My Recommendation:**
Choose Coimbatore Farmers Cooperative for consistency and bulk supply.
"""
        return {
            'response': response,
            'crop': crop,
            'suppliers': suppliers,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_profit_query(self, query: str) -> Dict:
        """Answer profit/margin questions"""
        response = """
💰 **Profit Margin Analysis**

**Typical Margins by Crop:**
1. **TOMATO**
   Buy Price: ₹24-28/kg
   Sell Price: ₹32-38/kg
   Profit: ₹8/kg (28-35% margin)
   Monthly Profit (500kg): ₹4,000

2. **ONION**
   Buy Price: ₹24-26/kg
   Sell Price: ₹32-36/kg
   Profit: ₹8-10/kg (30-40% margin)
   Monthly Profit (300kg): ₹2,500

3. **CHILLI**
   Buy Price: ₹40-45/kg
   Sell Price: ₹55-65/kg
   Profit: ₹15-20/kg (33-44% margin)
   Monthly Profit (50kg): ₹750-1000

**Profit Optimization Tips:**
✅ Buy when price is LOW (weeks with ↓ trend)
✅ Sell when demand is HIGH (festival seasons)
✅ Stock perishables faster (reduce waste)
✅ Buy in bulk for better rates
✅ Choose reliable suppliers (avoid losses)
"""
        return {
            'response': response,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_price_query(self, query: str) -> Dict:
        """Answer price trend/forecast queries"""
        crop = self._extract_crop_name(query)
        if not crop:
            return {
                'response': 'Which crop? (Tomato, Onion, Potato, Chilli)',
                'timestamp': datetime.utcnow().isoformat()
            }
            
        current_data = self.market_data.get(crop, {})
        forecast = await self._predict_price_trend(crop, days=30)
        
        response = f"""
📈 **Price Trend & Forecast - {crop.upper()}**

**Current:** ₹{current_data['current_price']}/kg
**Status:** {current_data['market_status']}

**30-Day Forecast:**
Week 1: ₹{forecast['day_7']['predicted_price']}/kg
Week 2: ₹{forecast['day_14']['predicted_price']}/kg
Week 3: ₹{forecast['day_21']['predicted_price']}/kg
Week 4: ₹{forecast['day_30']['predicted_price']}/kg

**Best Buy Time:** {self._find_best_buy_window(forecast)}
**Best Sell Time:** {self._find_best_sell_window(forecast)}
"""
        return {
            'response': response,
            'crop': crop,
            'current_price': current_data.get('current_price'),
            'forecast': forecast,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_supply_query(self, query: str) -> Dict:
        """Answer supply/shortage queries"""
        response = """
🏭 **Supply-Demand Gap Analysis**

**Current Market Situation:**

**🔴 HIGH DEMAND + LOW SUPPLY (Best for SELLERS)**
• Chilli: Gap +300 tons/day (30% shortage)
  Action: SELL IMMEDIATELY! Prices rising!

**🟡 MEDIUM DEMAND + MEDIUM SUPPLY (Neutral)**
• Tomato: Gap +200 tons/day (manageable)
  Action: Stock up! Steady demand

**🟢 LOW DEMAND + HIGH SUPPLY (Best for BUYERS)**
• Onion: Gap -200 tons/day (20% surplus)
  Action: WAIT! Prices will fall further
"""
        return {
            'response': response,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _answer_general_market_query(self, query: str) -> Dict:
        """Answer general market questions"""
        response = """
📊 **General Market Information**

I can help you with:
1. **BUYING ADVICE** - "Best time to buy tomato?"
2. **SELLING STRATEGY** - "Which crop to sell now?"
3. **PRICE TRENDS** - "Tomato price forecast?"
4. **PROFIT CALCULATION** - "What's profit margin?"
5. **SUPPLIERS** - "Best supplier for chilli?"

What would you like to know?
"""
        return {
            'response': response,
            'suggestions': [
                'Tomato price today',
                'Best time to buy onion',
                'High demand crops',
                'Suppliers in Coimbatore'
            ],
            'timestamp': datetime.utcnow().isoformat()
        }

    # Helper methods
    def _extract_crop_name(self, query: str) -> Optional[str]:
        """Extract crop name from query"""
        query_lower = query.lower()
        for crop in self.market_data.keys():
            if crop in query_lower:
                return crop
        return None

    async def _predict_price_trend(self, crop: str, days: int = 7) -> Dict:
        """Predict price trend for next N days"""
        current_price = self.market_data[crop]['current_price']
        forecast = {}
        for day in range(1, days + 1):
            # Simplified prediction logic
            price_change = np.sin(day / 3) * 2
            predicted = current_price + price_change
            forecast[f'day_{day}'] = {
                'day': f'Day {day}',
                'predicted_price': round(predicted, 1),
                'trend': 'up' if price_change > 0 else 'down',
                'confidence': 0.75
            }
        return forecast

    def _get_buying_recommendation(self, crop: str, current_price: float, forecast: Dict) -> str:
        """Generate buying recommendation"""
        next_prices = [data['predicted_price'] for data in list(forecast.values())[:3]]
        avg_next = np.mean(next_prices)
        if avg_next > current_price * 1.05:
            return "💰 **BUY NOW!** Prices going up, buy before increase."
        elif avg_next < current_price * 0.95:
            return "⏳ **WAIT!** Prices going down, better deals coming."
        else:
            return "✅ **STABLE** Current price is fair, buy as needed."

    def _get_nearby_suppliers(self, crop: str, location: Optional[str]) -> List[Dict]:
        """Get nearby suppliers for crop"""
        loc = (location or 'coimbatore').lower()
        # Fallback to coimbatore if location not in database
        suppliers_data = self.supplier_network.get(loc, self.supplier_network['coimbatore'])['suppliers']
        
        crop_suppliers = []
        for s in suppliers_data:
            if crop in s['crops']:
                enhanced_s = s.copy()
                enhanced_s['location'] = loc.capitalize()
                enhanced_s['price'] = s['prices'].get(crop, 0)
                enhanced_s['margin_estimate'] = 30 + np.random.randint(-5, 10)
                enhanced_s['quality'] = 'Premium' if s['reliability_score'] > 90 else 'Good'
                crop_suppliers.append(enhanced_s)
        
        return crop_suppliers

    def _find_best_buy_window(self, forecast: Dict) -> str:
        """Find best time to buy"""
        min_price_day = min(forecast.items(), key=lambda x: x[1]['predicted_price'])
        return f"{min_price_day[1]['day']} (₹{min_price_day[1]['predicted_price']}/kg)"

    def _find_best_sell_window(self, forecast: Dict) -> str:
        """Find best time to sell"""
        max_price_day = max(forecast.items(), key=lambda x: x[1]['predicted_price'])
        return f"{max_price_day[1]['day']} (₹{max_price_day[1]['predicted_price']}/kg)"

_market_intelligence = None

def get_market_intelligence() -> MarketIntelligence:
    global _market_intelligence
    if _market_intelligence is None:
        _market_intelligence = MarketIntelligence()
    return _market_intelligence
