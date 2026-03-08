import sqlite3
import os
import sys

def elevate_to_admin(email):
    db_path = os.path.join('database', 'harvestlink.db')
    
    if not os.path.exists(db_path):
        print(f"Error: Database not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, name, role FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"Error: No user found with email '{email}'")
            return
        
        # Update role to admin
        cursor.execute("UPDATE users SET role = 'admin' WHERE email = ?", (email,))
        conn.commit()
        
        print(f"Success! User '{user[1]}' ({email}) has been elevated to 'admin'.")
        print("You can now log in with this account and access /admin/pilot")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python elevate_admin.py <user_email>")
        print("Example: python elevate_admin.py farmer@example.com")
    else:
        elevate_to_admin(sys.argv[1])
