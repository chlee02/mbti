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
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
    }
    try:
        if len(url) > 2048:
            return False
        response = requests.head(url, headers=headers, timeout=5)  # HEAD 요청으로 콘텐츠 유형만 확인
        if response.status_code == 200:
            content_type = response.headers.get("Content-Type", "")
            if content_type.startswith("image/"):  # 이미지 MIME 타입 확인
                return True
    except requests.RequestException:
        pass
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

# 데이터베이스에서 start_index 가져오기
def get_start_index(mbti_type):
    cursor.execute("SELECT start_index FROM start_index_tracker WHERE type = %s", (mbti_type,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        cursor.execute("INSERT INTO start_index_tracker (type, start_index) VALUES (%s, %s)", (mbti_type, 1))
        db.commit()
        return 1

# start_index 업데이트
def update_start_index(mbti_type, new_index):
    cursor.execute("UPDATE start_index_tracker SET start_index = %s WHERE type = %s", (new_index, mbti_type))
    db.commit()

# MBTI별 이미지 검색 및 저장
for mbti in mbti_types:
    print(f"Searching for {mbti} memes...")
    query = f"{mbti} 밈 meme"
    start_index = get_start_index(mbti)  # DB에 저장된 start_index 가져오기
    try:
        images = search_images(query, start_index=start_index, num_results=5)
        if images:  # 유효한 이미지가 있으면 저장
            save_to_db(mbti, images)
        print(f"Saved {len(images)} memes for {mbti}")
        # start_index 업데이트 (5 증가)
        update_start_index(mbti, start_index + 5)
    except Exception as e:
        print(f"Error fetching data for {mbti}: {e}")

# 연결 종료
cursor.close()
db.close()