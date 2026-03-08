import sqlite3
import os
import random
from datetime import datetime, timedelta

def init_db():
    db_path = os.path.join('database', 'harvestlink.db')
    schema_path = os.path.join('database', 'schema.sql')
    
    if not os.path.exists('database'):
        os.makedirs('database')
        
    conn = sqlite3.connect(db_path)
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    conn.executescript(schema)
    
    # Seed mock data for transactions if table is empty
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM transactions")
    if cursor.fetchone()[0] == 0:
        print("Seeding transaction data...")
        crops = ['Tomato', 'Onion', 'Potato', 'Carrot', 'Eggplant']
        # Assume some IDs exist for farmers (1-5) and shops (1-3)
        for i in range(60): # 60 days of data
            date = datetime.now() - timedelta(days=i)
            # Add 2-5 transactions per day
            for _ in range(random.randint(2, 5)):
                seller_id = random.randint(1, 5)
                buyer_id = random.randint(1, 3)
                crop = random.choice(crops)
                qty = random.uniform(50, 500)
                price = random.uniform(20, 60)
                total = qty * price
                cursor.execute('''INSERT INTO transactions (seller_id, buyer_id, crop_name, quantity, price_per_unit, total_price, transaction_date)
                               VALUES (?, ?, ?, ?, ?, ?, ?)''',
                               (seller_id, buyer_id, crop, qty, price, total, date.strftime('%Y-%m-%d %H:%M:%S')))
        
    conn.commit()
    conn.close()
    print(f"Database initialized and seeded at {db_path}")

if __name__ == "__main__":
    init_db()
