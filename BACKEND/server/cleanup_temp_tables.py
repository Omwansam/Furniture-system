#!/usr/bin/env python3
"""
Cleanup script to remove leftover temporary tables from failed migrations
"""
import sqlite3
import os

def cleanup_temp_tables():
    db_path = 'instance/app.db'
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Find all temporary tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '_alembic_tmp_%'")
    temp_tables = cursor.fetchall()
    
    if temp_tables:
        print(f"Found {len(temp_tables)} temporary tables to clean up:")
        for table in temp_tables:
            table_name = table[0]
            print(f"  - {table_name}")
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
                print(f"    ✓ Dropped {table_name}")
            except Exception as e:
                print(f"    ✗ Failed to drop {table_name}: {e}")
    else:
        print("No temporary tables found.")
    
    # Commit and close
    conn.commit()
    conn.close()
    print("Cleanup completed.")

if __name__ == "__main__":
    cleanup_temp_tables()
