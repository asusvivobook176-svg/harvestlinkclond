import sqlite3
import os

def update_db():
    db_path = os.path.join('database', 'harvestlink.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check pilot_participants table
    cursor.execute("PRAGMA table_info(pilot_participants)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if 'phone_number' not in columns:
        print("Adding phone_number to pilot_participants...")
        cursor.execute("ALTER TABLE pilot_participants ADD COLUMN phone_number TEXT")
    
    if 'joined_date' not in columns:
        print("Adding joined_date to pilot_participants...")
        cursor.execute("ALTER TABLE pilot_participants ADD COLUMN joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

    # Add notifications and notification_preferences tables if they don't exist
    # (init_db already runs schema.sql which has CREATE TABLE IF NOT EXISTS)
    # But let's be sure
    schema_path = os.path.join('database', 'schema.sql')
    with open(schema_path, 'r') as f:
        schema = f.read()
    conn.executescript(schema)

    conn.commit()
    conn.close()
    print("Database schema update complete.")

if __name__ == "__main__":
    update_db()
