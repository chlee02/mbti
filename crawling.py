import mysql.connector
from googleapiclient.discovery import build

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

# Google 이미지 검색 함수
def search_images(query, num_results=5):
    service = build("customsearch", "v1", developerKey=API_KEY)
    results = service.cse().list(q=query, cx=CSE_ID, searchType="image", num=num_results).execute()
    images = []
    for item in results.get("items", []):
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
        images = search_images(query, num_results=5)
        save_to_db(mbti, images)
        print(f"Saved {len(images)} memes for {mbti}")
    except Exception as e:
        print(f"Error fetching data for {mbti}: {e}")

# 연결 종료
cursor.close()
db.close()