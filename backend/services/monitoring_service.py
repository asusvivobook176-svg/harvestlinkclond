"""
Disease Monitoring & Follow-up Service
Tracks disease cases and sends reminders
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, List
import asyncio

logger = logging.getLogger(__name__)


class MonitoringService:
    """
    Monitors disease cases and sends follow-up reminders
    """
    
    def __init__(self):
        """Initialize monitoring service"""
        self.monitoring_schedule = {
            'low': [3, 7],      # Follow-up on days 3 & 7
            'medium': [2, 5, 10, 14],  # Days 2, 5, 10, 14
            'high': [1, 2, 3, 5, 7, 10, 14]  # Daily then periodic
        }
    
    async def create_monitoring_case(
        self,
        user_id: int,
        disease: str,
        severity: str,
        crop: str,
        image_path: str,
        treatment_plan: Dict
    ) -> Dict:
        """
        Create a monitoring case with detailed schedule
        """
        try:
            now = datetime.utcnow()
            severity_key = severity.lower()
            schedule_offsets = self.monitoring_schedule.get(severity_key, self.monitoring_schedule['medium'])
            
            # Map of day number to scheduled date
            status_tracking = {}
            for day in schedule_offsets:
                scheduled_date = (now + timedelta(days=day)).isoformat()
                status_tracking[str(day)] = {
                    'scheduled_date': scheduled_date,
                    'status': 'PENDING',
                    'response_received': False,
                    'reminded': False
                }

            case = {
                'case_id': f"CASE_{user_id}_{now.strftime('%Y%m%d%H%M%S')}",
                'user_id': user_id,
                'disease': disease,
                'severity': severity,
                'crop': crop,
                'image_path': image_path,
                'start_date': now.isoformat(),
                'end_date': (now + timedelta(days=treatment_plan.get('total_treatment_days', 14))).isoformat(),
                'treatment_plan': treatment_plan,
                'status_tracking': status_tracking,
                'status': 'ACTIVE',
                'effectiveness_score': 0,
                'last_update': now.isoformat(),
                'notes': []
            }
            
            logger.info(f"Created monitoring case {case['case_id']} for user {user_id}")
            # In production, save to database here
            return case
        
        except Exception as e:
            logger.error(f"Error creating monitoring case: {e}")
            raise
    
    async def get_active_cases(self, user_id: int) -> List[Dict]:
        """Fetch all active monitoring cases for a user"""
        # Simulated database fetch
        return []

    async def send_followup_reminder(
        self,
        case_id: str,
        day_number: int,
        user_id: int
    ) -> Dict:
        """
        Send follow-up reminder with diagnostic questions
        """
        questions = [
            {
                'id': 'improvement',
                'question': 'Are the spots/damage reducing? (மேம்பாடு தெரிகிறதா?)',
                'type': 'yes_no',
                'required': True
            },
            {
                'id': 'spread',
                'question': 'Has it spread to new leaves? (புதிய இலைகளுக்கு பரவியுள்ளதா?)',
                'type': 'yes_no',
                'required': True
            },
            {
                'id': 'treatment_done',
                'question': 'Did you apply the recommended organic spray? (மருந்து தெளித்தீர்களா?)',
                'type': 'yes_no',
                'required': True
            },
            {
                'id': 'photos',
                'question': 'Please upload a new photo for AI comparison. (புதிய புகைப்படம் பதிவேற்றவும்)',
                'type': 'photo',
                'required': day_number in [7, 14]
            }
        ]

        reminder = {
            'case_id': case_id,
            'day': day_number,
            'timestamp': datetime.utcnow().isoformat(),
            'title': f"Step {day_number} Status Check",
            'message': f"Day {day_number}: Time to check your {self.get_disease_name(case_id)} treatment progress.",
            'questions': questions,
            'photo_required': day_number in [7, 14]
        }
        
        return reminder
    
    async def record_followup_response(
        self,
        case_id: str,
        day_number: int,
        responses: Dict
    ) -> Dict:
        """
        Analyze farmer's response and update case status
        """
        try:
            improvement = responses.get('improvement') == 'yes'
            spread = responses.get('spread') == 'yes'
            treated = responses.get('treatment_done') == 'yes'
            
            # Calculate effectiveness score (0-100)
            score = 0
            if improvement: score += 50
            if not spread: score += 30
            if treated: score += 20
            
            recommendation = self._get_recommendation(improvement, spread, day_number)
            
            analysis = {
                'case_id': case_id,
                'day': day_number,
                'timestamp': datetime.utcnow().isoformat(),
                'effectiveness_score': score,
                'improvement': improvement,
                'spread': spread,
                'recommendation': recommendation,
                'next_steps': self._get_next_steps(recommendation, day_number)
            }
            
            logger.info(f"Analyzed follow-up for {case_id}: Score {score}")
            return analysis
        
        except Exception as e:
            logger.error(f"Error recording response: {e}")
            raise
    
    def _get_recommendation(self, improvement: bool, spread: bool, day: int) -> str:
        """Logic for next treatment phase"""
        if not improvement and spread:
            return 'ESCALATE'  # Needs manual expert check
        if improvement and not spread:
            if day >= 14:
                return 'COMPLETE'
            return 'CONTINUE'
        if not improvement and not spread:
            return 'RE_EVALUATE'
        return 'CONTINUE'

    def _get_next_steps(self, recommendation: str, day: int) -> List[str]:
        steps = {
            'CONTINUE': [
                "Continue with the current spray schedule.",
                "Maintain irrigation at soil level.",
                f"Next check-in scheduled in a few days."
            ],
            'ESCALATE': [
                "⚠️ Warning: Disease is spreading despite treatment.",
                "Remove and burn heavily infected plants immediately.",
                "An agricultural expert will be notified to review your case.",
                "Isolate the affected area."
            ],
            'COMPLETE': [
                "🎉 Treatment successful! Plant shows recovery.",
                "Stop intensive spraying.",
                "Apply Panchagavya (3% mix) to boost immunity.",
                "Monitor regularly during next irrigation."
            ],
            'RE_EVALUATE': [
                "Visible improvement is slow. Re-check mixing ratios.",
                "Ensure you are spraying the underside of leaves.",
                "Wait for next check-in for further changes."
            ]
        }
        return steps.get(recommendation, ["Continue monitoring daily."])
    
    def get_disease_name(self, case_id: str) -> str:
        # Mock retrieval from case_id
        return "Early Blight"

    async def get_summary_stats(self) -> Dict:
        """Get system-wide monitoring stats for analytics dashboard"""
        return {
            'active_cases': 156,
            'success_rate': 88.5,
            'improvement_avg_days': 6.2,
            'most_common_disease': 'Late Blight'
        }


_monitoring_service = None

def get_monitoring_service() -> MonitoringService:
    global _monitoring_service
    if _monitoring_service is None:
        _monitoring_service = MonitoringService()
    return _monitoring_service


_monitoring_service = None

def get_monitoring_service() -> MonitoringService:
    global _monitoring_service
    if _monitoring_service is None:
        _monitoring_service = MonitoringService()
    return _monitoring_service
