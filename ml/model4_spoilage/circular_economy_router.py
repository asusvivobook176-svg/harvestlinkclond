def get_circular_economy_suggestion(risk_level, days_remaining):
    """
    Logic-based router for circular economy suggestions.
    """
    if risk_level == 'High':
        if days_remaining <= 1:
            return {
                'action': 'Donate to Food Bank / Send to Compost',
                'reason': 'Extremely short shelf life remaining. Immediate consumption or composting needed.'
            }
        else:
            return {
                'action': 'Discount Sale Suggestion',
                'reason': 'High risk of spoilage within 2-3 days. Rapid liquidation recommended.'
            }
    elif risk_level == 'Medium':
        return {
            'action': 'Monitor and Check Tomorrow',
            'reason': 'Moderate shelf life remaining. Ensure proper storage conditions.'
        }
    else:
        return {
            'action': 'Safe to Store',
            'reason': 'Low risk of spoilage. Product is in good condition.'
        }
