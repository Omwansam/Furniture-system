#!/usr/bin/env python3
"""
Simple startup script for the backend server
"""

import os
import sys
import subprocess

def start_server():
    print("Starting Furniture System Backend Server...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('server/app.py'):
        print("Error: Please run this script from the BACKEND directory")
        print("Current directory:", os.getcwd())
        return False
    
    # Change to server directory
    os.chdir('server')
    
    try:
        print("Starting Flask server on http://localhost:5000")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Start the Flask server
        subprocess.run([sys.executable, 'app.py'])
        
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_server()
