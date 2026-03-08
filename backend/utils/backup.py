import shutil
from datetime import datetime
import os
import threading
import time
import logging
import schedule

logger = logging.getLogger('harvestlink.backup')

class DatabaseBackup:
    @staticmethod
    def create_backup(db_path='database/harvestlink.db'):
        """Create timestamped backup of database"""
        try:
            os.makedirs('backups', exist_ok=True)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_path = f'backups/harvestlink_{timestamp}.db'
            
            # Ensure source exists
            if not os.path.exists(db_path):
                root_db_path = os.path.join(os.getcwd(), db_path)
                if not os.path.exists(root_db_path):
                     logger.error(f"❌ Backup failed: Database file {db_path} not found.")
                     return None
                db_path = root_db_path

            shutil.copy(db_path, backup_path)
            logger.info(f"✅ Backup created: {backup_path}")
            return backup_path
        except Exception as e:
            logger.error(f"❌ Backup failed: {str(e)}")
            return None
    
    @staticmethod
    def schedule_daily_backup():
        """Schedule automatic daily backups using the schedule library"""
        logger.info("Starting daily backup scheduler using 'schedule' library (02:00 AM)...")
        schedule.every().day.at("02:00").do(DatabaseBackup.create_backup)
        
        while True:
            schedule.run_pending()
            time.sleep(60)

def start_backup_scheduler():
    backup_thread = threading.Thread(target=DatabaseBackup.schedule_daily_backup, daemon=True)
    backup_thread.start()
    return backup_thread
