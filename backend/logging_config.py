import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    os.makedirs('logs', exist_ok=True)
    
    # File handler
    file_handler = RotatingFileHandler(
        'logs/harvestlink.log',
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger = logging.getLogger('harvestlink')
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    logger.setLevel(logging.INFO)
    
    # Also configure basic logging to ensure other libs log consistently
    logging.basicConfig(level=logging.INFO, handlers=[file_handler, console_handler])
    
    return logger
