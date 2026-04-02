import psycopg2
from duckduckgo_search import DDGS
import requests
import os
import time
from dotenv import load_dotenv

# .env.local 파일 로드
load_dotenv(".env.local")

# Postgres 데이터베이스 연결
DB_URL = os.getenv("POSTGRES_URL")
db = psycopg2.connect(DB_URL)
cursor = db.cursor()

# MBTI 타입 목록
mbti_types = ["INTJ", "ENTP", "INFJ", "ENFP", "ISTJ", "ESTP", "ISFJ", "ESFP", "INTP", "ENTJ", "INFP", "ENFJ", "ISTP", "ESTJ", "ISFP", "ESFJ"]

# URL 유효성 검사 함수
def is_valid_url(url):
    # 비디오 썸네일이나 불필요한 이미지 필터링
    invalid_keywords = [
        'ytimg.com', 'video', 'thumb', 'hqdefault', 'mqdefault', 
        'sddefault', 'maxresdefault', 'vimeocdn', 'kakaotv', 'preview',
        'pstatic.net', # 네이버 이미지(블로그/카페) 필터링 추가
        'humoruniv.com', 'fmkorea.com', 'itssa.co.kr', 'daum.net', 'daumcdn.net',
        'kakaocdn.net', 'hdslb.com', 'blogger.googleusercontent.com',
        'wolf.community', 'twojstory.com', 'dmitory.com', 'ruliweb.com',
        'duitang.com', 'zuomeme.com' # 신규 차단 도메인 추가 (v3.2)
    ]
    if any(keyword in url.lower() for keyword in invalid_keywords):
        return False

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
    }
    try:
        if len(url) > 2048:
            return False
        # DuckDuckGo에서 가져온 URL은 이미 유효한 경우가 많으므로 헤더 체크는 선택적이나 기존 코드 유지
        response = requests.head(url, headers=headers, timeout=5)
        if response.status_code == 200:
            content_type = response.headers.get("Content-Type", "")
            if content_type.startswith("image/"):
                return True
    except requests.RequestException:
        pass
    return False

# DuckDuckGo 이미지 검색 함수
def search_images(query, num_results=6):
    images = []
    with DDGS() as ddgs:
        results = ddgs.images(
            keywords=query,
            region="wt-wt",
            safesearch="off",
            size=None,
            color=None,
            type_image=None,
            layout=None,
            license_image=None,
            max_results=num_results,
        )
        for r in results:
            url = r['image']
            title = r.get('title', 'No description available')
            if is_valid_url(url):
                images.append({"url": url, "alt": title})
    return images

# 데이터베이스에 데이터 저장
def save_to_db(mbti_type, images):
    saved_count = 0
    for image in images:
        # 중복 체크: 이미 DB에 있는 URL인지 확인
        cursor.execute("SELECT id FROM memes WHERE url = %s", (image["url"],))
        if cursor.fetchone():
            continue
            
        cursor.execute(
            "INSERT INTO memes (type, url, alt, created_at, updated_at, recommendations) VALUES (%s, %s, %s, NOW(), NOW(), 0)",
            (mbti_type, image["url"], image["alt"])
        )
        saved_count += 1
    db.commit()
    return saved_count

# MBTI별 이미지 검색 및 저장
for mbti in mbti_types:
    print(f"Searching for {mbti} memes...")
    query = f"{mbti} 밈 meme -site:youtube.com -site:instagram.com -site:tiktok.com -site:facebook.com -site:humoruniv.com -site:naver.com"
    
    try:
        # 최신 결과 100개를 요청하고 이미 있는 것은 중복 체크로 제외
        fetch_count = 100
        images = search_images(query, num_results=fetch_count)
        
        saved_count = 0
        if images:
            saved_count = save_to_db(mbti, images)
        
        print(f"[{mbti}] Fetched {len(images)} results. Saved {saved_count} new memes.")
        
        # 과도한 요청 방지를 위해 1초 대기
        time.sleep(1)
        
    except Exception as e:
        print(f"Error fetching data for {mbti}: {e}")

# 연결 종료
cursor.close()
db.close()