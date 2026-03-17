import requests
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

# 사용자가 입력한 최신 키 적용
API_KEY = "AIzaSyCHwjv0UZd294WPbyupAOezcZgjwo-7idg"
CSE_ID = "53655fbb4ec9049b7"

def test_google_api():
    print(f"Testing API with Key: {API_KEY[:10]}...")
    print(f"Testing with CSE ID: {CSE_ID}")
    
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': 'test',
        'key': API_KEY,
        'cx': CSE_ID,
        'searchType': 'image',
        'num': 1
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Success! API is working.")
            print(f"Result snippet: {response.json().get('items', [{}])[0].get('title', 'No title')}")
        else:
            print("❌ Failed.")
            print(f"Error Message: {response.text}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_google_api()
