import mysql.connector
from googleapiclient.discovery import build
import requests  # URL 유효성 검사용

# Google API 설정
API_KEY = "AIzaSyDLiFEGPq1vqB8M7IO68FrLlakKYzjJ7ZA"  # 발급받은 API 키
CSE_ID = "e60be83f02a3749fe"  # 생성한 검색 엔진 ID

# MySQL 데이터베이스 연결
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12341234",
    database="mbti_db"
)
cursor = db.cursor()

# MBTI 타입 목록
mbti_types = ["INTJ", "ENTP", "INFJ", "ENFP", "ISTJ", "ESTP", "ISFJ", "ESFP", "INTP", "ENTJ", "INFP", "ENFJ", "ISTP", "ESTJ", "ISFP", "ESFJ"]

# URL 유효성 검사 함수
def is_valid_url(url):
    try:
        response = requests.head(url, timeout=5)  # HEAD 요청으로 빠르게 상태 확인
        return response.status_code == 200  # HTTP 200 OK인 경우만 유효
    except requests.RequestException:
        return False

# Google 이미지 검색 함수
def search_images(query, start_index, num_results=6):
    service = build("customsearch", "v1", developerKey=API_KEY)
    results = service.cse().list(
        q=query, cx=CSE_ID, searchType="image", start=start_index, num=num_results
    ).execute()
    images = []
    for item in results.get("items", []):
        if is_valid_url(item["link"]):  # URL 유효성 검사
            images.append({"url": item["link"], "alt": item.get("title", "No description available")})
    return images

# 데이터베이스에 데이터 저장
def save_to_db(mbti_type, images):
    for image in images:
        cursor.execute(
            "INSERT INTO memes (type, url, alt, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
            (mbti_type, image["url"], image["alt"])
        )
    db.commit()

# MBTI별 이미지 검색 및 저장
for mbti in mbti_types:
    print(f"Searching for {mbti} memes...")
    query = f"{mbti} meme"
    try:
        # 이미 저장된 이미지 수 확인
        cursor.execute("SELECT COUNT(*) FROM memes WHERE type = %s", (mbti,))
        start_index = cursor.fetchone()[0] + 1

        # 이미지 검색
        images = search_images(query, start_index, num_results=6)
        if images:
            save_to_db(mbti, images)
            print(f"Saved {len(images)} memes for {mbti}")
        else:
            print(f"No valid images found for {mbti}")
    except Exception as e:
        print(f"Error fetching data for {mbti}: {e}")

# 연결 종료
cursor.close()
db.close()