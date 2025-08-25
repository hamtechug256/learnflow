
import uvicorn
import time
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# A library for performing Google searches.
from googlesearch import search

# --- Caching Setup ---
CACHE = {}
CACHE_DURATION_SECONDS = 3600  # 1 hour

# --- Data Models ---
class Resource(BaseModel):
    title: str
    url: str

class Topic(BaseModel):
    topic: str
    resources: List[Resource]

class StudyPath(BaseModel):
    course: str
    study_path: List[Topic]

# --- FastAPI Application ---
app = FastAPI(
    title="Study Path API",
    description="An API to generate a dynamic study path for any course.",
    version="1.0.0",
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Helper Functions ---
def get_topics_from_url(url: str) -> List[str]:
    """Scrapes a URL for h2 and h3 tags to use as topics."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        headings = soup.find_all(['h2', 'h3'])
        topics = [head.get_text(strip=True) for head in headings]
        unique_topics = list(dict.fromkeys(topics))
        return [t for t in unique_topics if len(t.split()) > 2]
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return []

# --- API Endpoint ---
@app.get("/generate_study_path", response_model=StudyPath)
def generate_study_path(course: str, style: str = 'reading'):
    """Generates a study path for a given course, with caching and web scraping, tailored to a learning style."""
    current_time = time.time()
    cache_key = (course, style)
    if cache_key in CACHE and current_time - CACHE[cache_key]['timestamp'] < CACHE_DURATION_SECONDS:
        print(f"Returning cached result for: {course} (Style: {style})")
        return CACHE[cache_key]['data']

    print(f"Generating new result for: {course} (Style: {style})")
    final_path = []
    topics = []

    # --- Step 1: Find a source URL and scrape it for topics ---
    print(f"Searching for curriculum source for: {course}")
    try:
        curriculum_query = f"{course} curriculum syllabus roadmap"
        source_urls = [url for url in search(curriculum_query, num_results=3, lang="en")]
        
        if source_urls:
            print(f"Found source URL: {source_urls[0]}")
            topics = get_topics_from_url(source_urls[0])

        if not topics:
            print("Scraping failed, falling back to search titles.")
            topics = [title for title in search(f"{course} topics", num_results=5, lang="en")]

        if not topics:
            print("Fallback failed, using generic topics.")
            topics = [f"Introduction to {course}", f"{course} Fundamentals", f"Advanced {course} Topics"]

    except Exception as e:
        print(f"An error occurred during curriculum search: {e}")
        topics = [f"Introduction to {course}", f"{course} Fundamentals", f"Advanced {course} Topics"]

    # --- Step 2: Find resources for each topic based on learning style ---
    style_keywords = {
        'reading': 'article tutorial guide text',
        'video': 'video course youtube',
        'auditory': 'podcast audiobook lecture',
        'kinesthetic': 'interactive tutorial hands-on project example'
    }
    search_keywords = style_keywords.get(style, 'tutorial guide') # Default to general terms

    for topic_title in topics[:10]:
        print(f"Finding '{style}' resources for topic: {topic_title}")
        resources_for_topic = []
        try:
            resource_query = f'{topic_title} {search_keywords}'
            resource_results = search(resource_query, num_results=3, lang="en")
            
            for url in resource_results:
                simple_title = url.split('//')[-1].split('/')[0]
                resources_for_topic.append(Resource(title=simple_title, url=url))

        except Exception as e:
            print(f"An error occurred during resource search for '{topic_title}': {e}")
            pass

        if resources_for_topic:
            final_path.append(Topic(topic=topic_title, resources=resources_for_topic))

    # --- Store in Cache ---
    result = StudyPath(course=course, study_path=final_path)
    CACHE[cache_key] = {
        'timestamp': current_time,
        'data': result
    }
    
    return result


